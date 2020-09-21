using System;
using System.Linq;
using TicTacToe.GameLogic;
using TicTacToe.CustomExceptions;

namespace TicTacToe.RoomNS
{
	public class Room : IRoom
	{
		public Game Game { get; set; }
		public string Code { get; set; }
		public string PlayerAId { get; set; }
		public string PlayerBId { get; set; }

		public Room()
		{
			PlayerAId = string.Empty;
			PlayerBId = string.Empty;
			Game = new Game();
			Code = GenerateCode(5);
		}

		public string GetPlayerId(Game.Players player)
		{
			return player == Game.Players.A ? PlayerAId : PlayerBId;
		}

		public void AddPlayer(string id)
		{
			if (PlayerAId == string.Empty)
			{
				PlayerAId = id;
			}
			else if (PlayerBId == string.Empty)
			{
				PlayerBId = id;
			}
			else
			{
				throw new RoomException(ErrorCodes.RoomIsFull.ToString(), ErrorCodes.RoomIsFull);
			}
		}

		public void RemovePlayer(string id)
		{
			if (PlayerAId == id)
			{
				PlayerAId = string.Empty;
			}
			else if (PlayerBId == id)
			{
				PlayerBId = string.Empty;
			}
		}

		public bool IsFull()
		{
			if (PlayerAId != string.Empty & PlayerBId != string.Empty)
				return true;
			else
				return false;
		}

		public bool IsEmpty()
		{
			if (PlayerAId == string.Empty & PlayerBId == string.Empty)
				return true;
			else
				return false;
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