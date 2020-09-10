using System.Threading.Tasks;

namespace TicTacToe.Hubs
{
	public interface IGameClient
	{
		Task UpdateBoard(char[][] board);
		Task Turn(char role);
		Task Victory(string id);
		Task Tie();
		Task Start(string playerAid, char roleA ,string playerBid, char roleB);
		Task Stop();
	}
}