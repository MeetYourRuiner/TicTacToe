namespace TicTacToe.Games
{
	public class Game : IGame
	{
		/*
			+---+---+---+
			| 0 | 1 | 2 |
			+---+---+---+
			| 3 | 4 | 5 |
			+---+---+---+
			| 6 | 7 | 8 |
			+---+---+---+
		*/
		private int[][] winLines = {
			new int[] { 0, 1, 2 },
			new int[] { 3, 4, 5 },
			new int[] { 6, 7, 8 },
			new int[] { 0, 3, 6 },
			new int[] { 1, 4, 7 },
			new int[] { 2, 5, 8 },
			new int[] { 0, 4, 8 },
			new int[] { 2, 4, 6 }
		};
		public Game()
		{
			PlayerA = string.Empty;
			PlayerB = string.Empty;
			NewBoard();
		}

		public string PlayerA { get; set; }
		public string PlayerB { get; set; }
		public char[] Board { get; set; }
		private char Winner { get; set; }

		public bool CheckTie()
		{
			foreach (var cell in Board)
			{
				if (cell == '\0')
					return false;
			}
			return true;
		}

		public void NewBoard()
		{
			Board = new char[9];
			Winner = '\0';
		}

		public void UpdateBoard(byte i, char role)
		{
			Board[i] = role;
		}

		public bool CheckWinner()
		{
			foreach (var line in winLines)
			{
				bool winCondition = (
					Board[line[0]] != '\0' &
					Board[line[0]] == Board[line[1]] &&
					Board[line[0]] == Board[line[2]]
				);
				if (winCondition)
				{
					Winner = Board[line[0]];
					return true;
				}
			}
			return false;
		}

		public string GetWinner()
		{
			if (Winner == 'x')
				return PlayerA;
			else
				return PlayerB;
		}
	}
}