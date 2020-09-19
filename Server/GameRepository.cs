using System.Collections.Generic;
using TicTacToe.GameLogic;

namespace TicTacToe
{
	public interface IGameRepository
	{
		List<Game> Games { get; }
		Game Create();
	}

	public class GameRepository : IGameRepository
	{
		public List<Game> Games { get; } = new List<Game>();

		public Game Create()
		{
			var game = new Game();
			Games.Add(game);
			return game;
		}
	}
}