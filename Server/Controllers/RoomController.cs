using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TicTacToe;
using TicTacToe.GameLogic;
using TicTacToe.CustomExceptions;

namespace TicTacToe.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RoomController : ControllerBase
	{
		private IRoomRepository _roomRepository;
		public RoomController(IRoomRepository roomRepository)
		{
			_roomRepository = roomRepository;
		}

		// GET: api/room
		[HttpGet]
		public ActionResult<string> CreateRoom()
		{
			try
			{
				var room = _roomRepository.Create();
				return Ok(room.Code);
			}
			catch
			{
				return new StatusCodeResult(500);
			}
		}

		// GET: api/room?code=AAAAA
		[HttpGet]
		public ActionResult ConnectWithCode(string code)
		{
			try
			{
				var room = _roomRepository.FindByCode(code);
				if (!room.IsFull())
					return Ok();
				else
					throw new RoomException(ErrorCodes.RoomIsFull.ToString(), ErrorCodes.RoomIsFull);
			}
			catch
			{
				return new NotFoundResult();
			}
		}
	}
}