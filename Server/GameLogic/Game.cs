using System;
using System.Linq;

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

		public Game()
		{
			random = new Random();
		}
		public char RoleA { get; set; }
		public char RoleB { get; set; }
		public char[] Board { get; set; }
		public Players ActivePlayer { get; set; }
		private char Winner { get; set; }

		public enum Players
		{
			A,
			B
		}

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
				ActivePlayer = Players.A;
			}
			else
			{
				RoleA = 'o';
				RoleB = 'x';
				ActivePlayer = Players.B;
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

		public Players GetWinner()
		{
			if (Winner == RoleA)
				return Players.A;
			else
				return Players.B;
		}

		public void NextTurn()
		{
			if (ActivePlayer == Players.A)
			{
				ActivePlayer = Players.B;
			}
			else
			{
				ActivePlayer = Players.A;
			}
		}
	}
}