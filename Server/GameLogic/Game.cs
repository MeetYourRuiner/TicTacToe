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
		private bool isATurn;

		public Game()
		{
			PlayerA = string.Empty;
			PlayerB = string.Empty;
			InProgress = false;
			Code = GenerateCode(5);

			random = new Random();
		}

		public string PlayerA { get; set; }
		public string PlayerB { get; set; }
		public char RoleA { get; set; }
		public char RoleB { get; set; }
		public char[] Board { get; set; }
		public string ActivePlayer { get; set; }
		public string Code { get; set; }
		public bool InProgress { get; set; }
		private char Winner { get; set; }

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
			InProgress = true;
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

		public void AddPlayer(string id)
		{
			if (PlayerA == string.Empty)
			{
				PlayerA = id;
			}
			else if (PlayerB == string.Empty)
			{
				PlayerB = id;
			}
			else
			{
				throw new Exception("Room is full");
			}
		}

		public void RemovePlayer(string id)
		{
			if (PlayerA == id)
			{
				PlayerA = string.Empty;
			}
			else if (PlayerB == id)
			{
				PlayerB = string.Empty;
			}
			else
			{
				throw new Exception("Player not found");
			}
		}

		private string GenerateCode(int length)
		{
			var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			var random = new Random();
			var result = new string(
				Enumerable.Repeat(chars, length)
				  .Select(s => s[random.Next(s.Length)])
				  .ToArray()
				);
			return result;
		}
	}
}