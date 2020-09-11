namespace TicTacToe.Games
{
	public class Game : IGame
	{
		private int[][,] winLines = {
			new int[,] {{0, 0}, {0, 1}, {0, 2}},
			new int[,] {{1, 0}, {1, 1}, {1, 2}},
			new int[,] {{2, 0}, {2, 1}, {2, 2}},
			new int[,] {{0, 0}, {1, 0}, {2, 0}},
			new int[,] {{0, 1}, {1, 1}, {2, 1}},
			new int[,] {{0, 2}, {1, 2}, {2, 2}},
			new int[,] {{0, 0}, {1, 1}, {2, 2}},
			new int[,] {{0, 2}, {1, 1}, {2, 0}}
		};
		public Game()
		{
			PlayerA = string.Empty;
			PlayerB = string.Empty;
			NewBoard();
		}

		public string PlayerA { get; set; }
		public string PlayerB { get; set; }
		public char[,] Board { get; set; }
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
			Board = new char[3, 3];
			Winner = '\0';
		}

		public void UpdateBoard(byte i, byte j, char role)
		{
			Board[i, j] = role;
		}

		public bool CheckWinner()
		{
			foreach (var line in winLines)
			{
				bool winCondition = (
					Board[line[0, 0], line[0, 1]] != '\0' &
					Board[line[0, 0], line[0, 1]] == Board[line[1, 0], line[1, 1]] &&
					Board[line[0, 0], line[0, 1]] == Board[line[2, 0], line[2, 1]]
				);
				if (winCondition)
				{ 
					Winner = Board[line[0, 0], line[0, 1]];
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