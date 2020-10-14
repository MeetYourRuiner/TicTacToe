namespace TicTacToe.GameLogic
{
	public interface IGame
	{
		char[] Board { get; set; }
		char RoleA { get; set; }
		char RoleB { get; set; }
		Game.Players ActivePlayer { get; set; }
		void UpdateCell(byte i, char role);
		void Start();
		bool CheckWinner();
		Game.Players GetWinner();
		bool CheckTie();
		void NextTurn();
	}
}