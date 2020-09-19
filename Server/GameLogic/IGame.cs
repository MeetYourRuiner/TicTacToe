namespace TicTacToe.GameLogic
{
	public interface IGame
	{
		string Code { get; set; }
		bool InProgress { get; set; }
		char[] Board { get; set; }
		string PlayerA { get; set; }
		string PlayerB { get; set; }
		char RoleA { get; set; }
		char RoleB { get; set; }
		string ActivePlayer { get; set; }
		void AddPlayer(string id);
		void RemovePlayer(string id);
		void UpdateCell(byte i, char role);
		void Start();
		bool CheckWinner();
		string GetWinner();
		bool CheckTie();
		void NextTurn();
	}
}