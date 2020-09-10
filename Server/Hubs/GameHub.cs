using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;
using TicTacToe.Games;

namespace TicTacToe.Hubs
{
	public class GameHub : Hub<IGameClient>
	{
		private IGame _game;
		public GameHub(IGame game)
		{
			_game = game;
		}
		public async Task Action(byte i, byte j, char role)
		{
			_game.UpdateBoard(i, j, role);
			await this.Clients.All.UpdateBoard(_game.Board);
			if (_game.CheckTie())
			{
				await this.Clients.All.Tie();
			} 
			else if (_game.CheckWinner())
			{
				await this.Clients.All.Victory(_game.GetWinner());
			}
			else
			{
				var nextTurn = role == 'x' ? 'o': 'x';
				await this.Clients.All.Turn(nextTurn);
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
			}

			await base.OnConnectedAsync();

			await this.Clients.All.Start(_game.PlayerA, 'x', _game.PlayerB, 'o');
			_game.NewBoard();
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