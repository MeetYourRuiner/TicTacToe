namespace TicTacToe.GameLogic
{
	public interface IGame
	{
		char[] Board { get; set; }
		string PlayerA { get; set; }
		string PlayerB { get; set; }
		char RoleA { get; set; }
		char RoleB { get; set; }
		string ActivePlayer { get; set; }
		void UpdateCell(byte i, char role);
		void Start();
		bool CheckWinner();
		string GetWinner();
		bool CheckTie();
		void NextTurn();
	}
}