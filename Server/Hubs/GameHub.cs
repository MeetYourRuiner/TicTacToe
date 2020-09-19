using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;
using TicTacToe.GameLogic;
using System.Linq;

namespace TicTacToe.Hubs
{
	public class GameHub : Hub<IGameClient>
	{
		private IGameRepository _gameRepository;
		public GameHub(IGameRepository gameRepository)
		{
			_gameRepository = gameRepository;
		}
		public async Task Action(byte cellIndex, char mark)
		{
			var game = _gameRepository.Games.FirstOrDefault(g => g.PlayerA == Context.ConnectionId || g.PlayerB == Context.ConnectionId);
			game.UpdateCell(cellIndex, mark);
			await this.Clients.Group(game.Code).UpdateBoard(game.Board);
			if (game.CheckTie())
			{
				await this.Clients.Group(game.Code).Tie();
				await this.Clients.Group(game.Code).Stop();
			}
			else if (game.CheckWinner())
			{
				await this.Clients.Group(game.Code).Victory(game.GetWinner());
				await this.Clients.Group(game.Code).Stop();
			}
			else
			{
				game.NextTurn();
				var nextActivePlayer = game.ActivePlayer;
				await this.Clients.Group(game.Code).Turn(nextActivePlayer);
			}
		}

		public async Task CreateRoom()
		{
			var game = _gameRepository.Create();
			game.AddPlayer(Context.ConnectionId);
			await Groups.AddToGroupAsync(Context.ConnectionId, game.Code);
			await this.Clients.Caller.ConnectedToRoom(game.Code);
		}

		public async Task ConnectWithCode(string code)
		{
			var game = _gameRepository.Games.FirstOrDefault(g => g.Code == code);
			if (game == null)
			{
				Context.Abort();
				return;
			}
			game.AddPlayer(Context.ConnectionId);
			await Groups.AddToGroupAsync(Context.ConnectionId, game.Code);
			await this.Clients.Caller.ConnectedToRoom(game.Code);
			if (game.PlayerA != String.Empty & game.PlayerB != String.Empty)
			{
				game.Start();
				await this.Clients.Group(game.Code).Start(game.PlayerA, game.RoleA, game.PlayerB, game.RoleB);
				await this.Clients.Group(game.Code).Turn(game.ActivePlayer);
				await this.Clients.Group(game.Code).UpdateBoard(game.Board);
			}
		}

		public override async Task OnConnectedAsync()
		{
			await this.Clients.Caller.Handshake(Context.ConnectionId);
			await base.OnConnectedAsync();
		}

		public override async Task OnDisconnectedAsync(Exception exception)
		{
			var game = _gameRepository.Games.FirstOrDefault(g => g.PlayerA == Context.ConnectionId || g.PlayerB == Context.ConnectionId);
			if (game == null)
			{
				await base.OnDisconnectedAsync(exception);
				return;
			}
			game.RemovePlayer(Context.ConnectionId);
			await this.Clients.Group(game.Code).Stop();
			await Groups.RemoveFromGroupAsync(Context.ConnectionId, game.Code);
			if (game.PlayerA == string.Empty && game.PlayerB == string.Empty)
			{
				_gameRepository.Games.Remove(game);
			}
			await base.OnDisconnectedAsync(exception);
		}
	}

}