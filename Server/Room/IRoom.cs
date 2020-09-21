using TicTacToe.GameLogic;

namespace TicTacToe.RoomNS
{
	public interface IRoom
	{
		Game Game { get; set; }
		string Code { get; set; }
		string PlayerAId { get; set; }
		string PlayerBId { get; set; }
		string GetPlayerId(Game.Players player);
		void AddPlayer(string id);
		void RemovePlayer(string id);
		bool IsFull();
		bool IsEmpty();
	}
}