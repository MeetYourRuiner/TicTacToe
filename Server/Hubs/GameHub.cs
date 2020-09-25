using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;
using System.Linq;
using TicTacToe.CustomExceptions;

namespace TicTacToe.Hubs
{
	public class GameHub : Hub<IGameClient>
	{
		private IRoomRepository _roomRepository;
		public GameHub(IRoomRepository roomRepository)
		{
			_roomRepository = roomRepository;
		}
		public async Task Action(byte cellIndex, char mark)
		{
			var room = _roomRepository.FindByPlayerID(Context.ConnectionId);
			var game = room.Game;
			game.UpdateCell(cellIndex, mark);
			await this.Clients.Group(room.Code).UpdateBoard(game.Board);
			if (game.CheckTie())
			{
				await this.Clients.Group(room.Code).Tie();
				await this.Clients.Group(room.Code).Stop();
			}
			else if (game.CheckWinner())
			{
				var winner = game.GetWinner();
				var winnerId = room.GetPlayerId(winner);
				await this.Clients.Group(room.Code).Victory(winnerId);
				await this.Clients.Group(room.Code).Stop();
			}
			else
			{
				game.NextTurn();
				var nextActivePlayerId = room.GetPlayerId(game.ActivePlayer);
				await this.Clients.Group(room.Code).Turn(nextActivePlayerId);
			}
		}

		public async Task Connect(string code)
		{
			try
			{
				var room = _roomRepository.FindByCode(code);
				var game = room.Game;
				room.AddPlayer(Context.ConnectionId);
				await Groups.AddToGroupAsync(Context.ConnectionId, room.Code);
				await this.Clients.Caller.Connected();
				if (room.IsFull())
				{
					game.Start();
					await this.Clients.Group(room.Code).Start(room.PlayerAId, game.RoleA, room.PlayerBId, game.RoleB);
					await this.Clients.Group(room.Code).Turn(room.GetPlayerId(game.ActivePlayer));
					await this.Clients.Group(room.Code).UpdateBoard(game.Board);
				}
			}
			catch (RoomException ex)
			{
				await this.Clients.Caller.Error(ex.ErrorCode);
			}
		}

		public override async Task OnConnectedAsync()
		{
			await this.Clients.Caller.Handshake(Context.ConnectionId);
			await base.OnConnectedAsync();
		}

		public override async Task OnDisconnectedAsync(Exception exception)
		{
			try
			{
				var room = _roomRepository.FindByPlayerID(Context.ConnectionId);
				room.RemovePlayer(Context.ConnectionId);
				await this.Clients.Group(room.Code).Stop();
				await Groups.RemoveFromGroupAsync(Context.ConnectionId, room.Code);
				if (room.IsEmpty())
				{
					_roomRepository.Rooms.Remove(room);
				}
			}
			catch { }
			finally
			{
				await base.OnDisconnectedAsync(exception);
			}
		}
	}

}