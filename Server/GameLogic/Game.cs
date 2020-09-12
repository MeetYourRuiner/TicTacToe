using System;

namespace TicTacToe.GameLogic
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
		private static Random random;
		private bool isATurn;
		private char Winner { get; set; }

		public Game()
		{
			PlayerA = string.Empty;
			PlayerB = string.Empty;
			random = new Random();
		}

		public string PlayerA { get; set; }
		public string PlayerB { get; set; }
		public char RoleA { get; set; }
		public char RoleB { get; set; }
		public char[] Board { get; set; }
		public string ActivePlayer { get; set; }

		public bool CheckTie()
		{
			foreach (var cell in Board)
			{
				if (cell == ' ')
					return false;
			}
			return true;
		}

		public void Start()
		{
			Board = new char[9];
			Array.Fill(Board, ' ');
			Winner = ' ';
			if (random.Next(2) == 0)
			{
				RoleA = 'x';
				RoleB = 'o';
				ActivePlayer = PlayerA;
				isATurn = true;
			}
			else
			{
				RoleA = 'o';
				RoleB = 'x';
				ActivePlayer = PlayerB;
				isATurn = false;
			}
		}

		public void UpdateCell(byte i, char role)
		{
			Board[i] = role;
		}

		public bool CheckWinner()
		{
			foreach (var line in winLines)
			{
				bool winCondition = (
					Board[line[0]] != ' ' &
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
			if (Winner == RoleA)
				return PlayerA;
			else
				return PlayerB;
		}

		public void NextTurn()
		{
			if (isATurn)
			{ 
				ActivePlayer = PlayerB;
			}
			else
			{
				ActivePlayer = PlayerA;
			}
			isATurn = !isATurn;
		}
	}
}