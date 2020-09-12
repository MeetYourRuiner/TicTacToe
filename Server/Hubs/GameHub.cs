using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;
using TicTacToe.GameLogic;

namespace TicTacToe.Hubs
{
	public class GameHub : Hub<IGameClient>
	{
		private IGame _game;
		public GameHub(IGame game)
		{
			_game = game;
		}
		public async Task Action(byte cellIndex, char mark)
		{
			_game.UpdateCell(cellIndex, mark);
			await this.Clients.All.UpdateBoard(_game.Board);
			if (_game.CheckTie())
			{
				await this.Clients.All.Tie();
				await this.Clients.All.Stop();
			}
			else if (_game.CheckWinner())
			{
				await this.Clients.All.Victory(_game.GetWinner());
				await this.Clients.All.Stop();
			}
			else
			{
				_game.NextTurn();
				var nextActivePlayer = _game.ActivePlayer;
				await this.Clients.All.Turn(nextActivePlayer);
			}
		}
		public override async Task OnConnectedAsync()
		{
			if (_game.PlayerA == String.Empty)
			{
				_game.PlayerA = Context.ConnectionId;
			}
			else if (_game.PlayerB == String.Empty)
			{
				_game.PlayerB = Context.ConnectionId;
			}
			else 
			{
				Context.Abort();
				await base.OnConnectedAsync();
			}

			await this.Clients.Caller.Handshake(Context.ConnectionId);

			if (_game.PlayerA != String.Empty & _game.PlayerB != String.Empty)
			{
				_game.Start();
				await this.Clients.All.Start(_game.PlayerA, _game.RoleA, _game.PlayerB, _game.RoleB);
				await this.Clients.All.Turn(_game.ActivePlayer);
				await this.Clients.All.UpdateBoard(_game.Board);
			}

		}

		public override async Task OnDisconnectedAsync(Exception exception)
		{
			string disconnectedClient = Context.ConnectionId;
			if (_game.PlayerA == disconnectedClient)
			{
				_game.PlayerA = String.Empty;
				await this.Clients.All.Stop();
			}
			else if (_game.PlayerB == disconnectedClient)
			{
				_game.PlayerB = String.Empty;
				await this.Clients.All.Stop();
			}
			await base.OnDisconnectedAsync(exception);
		}
	}

}