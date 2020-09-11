namespace TicTacToe.Games
{
	public interface IGame
	{
		char[] Board { get; set; }
		string PlayerA { get; set; }
		string PlayerB { get; set; }
		void UpdateBoard(byte i, char role);
		void NewBoard();
		bool CheckWinner();
		string GetWinner();
		bool CheckTie();
	}
}