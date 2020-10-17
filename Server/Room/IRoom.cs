using System;
using TicTacToe.GameLogic;

namespace TicTacToe.RoomNS
{
	public interface IRoom
	{
		Game Game { get; set; }
		string Code { get; set; }
		string PlayerAId { get; set; }
		string PlayerBId { get; set; }
		bool PlayerAReadiness { get; set; }
		bool PlayerBReadiness { get; set; }
		string GetPlayerId(Game.Players player);
		void SetReadiness(string id);
		void AddPlayer(string id);
		void RemovePlayer(string id);
		bool IsFull();
		bool IsEmpty();
		bool ArePlayersReady();
		void ResetReadiness();
		void StartTimer(Action DeleteRoomAction);
		void GenerateOtherCode();
	}
}