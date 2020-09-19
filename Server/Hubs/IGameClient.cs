using System.Threading.Tasks;

namespace TicTacToe.Hubs
{
	public interface IGameClient
	{
		Task UpdateBoard(char[] board);
		Task Turn(string playerId);
		Task Victory(string id);
		Task Tie();
		Task Start(string playerAid, char markA, string playerBid, char markB);
		Task Stop();
		Task Handshake(string clientId);
		Task ConnectedToRoom(string code);
	}
}