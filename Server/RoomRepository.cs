using System.Collections.Generic;
using System.Linq;
using TicTacToe.RoomNS;
using TicTacToe.CustomExceptions;

namespace TicTacToe
{
	public interface IRoomRepository
	{
		List<Room> Rooms { get; }
		Room Create();
		Room FindByPlayerID(string id);
		Room FindByCode(string code);
		void StartRemovalTimer(Room room);
	}

	public class RoomRepository : IRoomRepository
	{
		public List<Room> Rooms { get; } = new List<Room>();

		public Room Create()
		{
			var room = new Room();
			bool isOk = false;
			while (!isOk)
			{
				try
				{
					FindByCode(room.Code);
				}
				catch
				{
					isOk = true;
					Rooms.Add(room);
					StartRemovalTimer(room);
				}
				room.GenerateOtherCode();
			}
			return room;
		}

		public void StartRemovalTimer(Room room)
		{
			room.StartTimer(() => Rooms.Remove(room));
		}

		public Room FindByPlayerID(string id)
		{
			var Room = Rooms.FirstOrDefault(g => g.PlayerAId == id || g.PlayerBId == id);
			if (Room != null)
			{
				return Room;
			}
			else
			{
				throw new RoomException(ErrorCodes.RoomNotFound.ToString(), ErrorCodes.RoomNotFound);
			}
		}

		public Room FindByCode(string code)
		{
			var Room = Rooms.FirstOrDefault(g => g.Code == code);
			if (Room != null)
			{
				return Room;
			}
			else
			{
				throw new RoomException(ErrorCodes.RoomNotFound.ToString(), ErrorCodes.RoomNotFound);
			}
		}
	}
}