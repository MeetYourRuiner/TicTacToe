namespace TicTacToe.Games
{
	public class Game : IGame
	{
		public Game()
		{
		}

		public string PlayerA { get; set ; }
		public string PlayerB { get; set; }
		public char[][] Board { get; set; }

		public bool CheckTie()
		{
			throw new System.NotImplementedException();
		}

		public void NewBoard()
		{
			throw new System.NotImplementedException();
		}

		public void UpdateBoard(byte i, byte j, char role)
		{
			throw new System.NotImplementedException();
		}
		
		bool IGame.CheckWinner()
		{
			throw new System.NotImplementedException();
		}

		public string GetWinner()
		{
			throw new System.NotImplementedException();
		}

	}
}