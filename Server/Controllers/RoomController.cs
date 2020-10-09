using Microsoft.AspNetCore.Mvc;
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

		// GET: api/room/create
		[HttpGet]
		[Route("create")]
		public ActionResult<string> CreateRoom()
		{
			try
			{
				var room = _roomRepository.Create();
				return Ok(room.Code);
			}
			catch
			{
				return new StatusCodeResult(500); // Internal Error
			}
		}

		// GET: api/room?code=AAAAA
		[HttpGet]
		public ActionResult GetRoomState(string code)
		{
			try
			{
				if (code == null || code.Length != 5)
					throw new RoomException(ErrorCodes.IncorrectCodeFormat.ToString(), ErrorCodes.IncorrectCodeFormat);
				code = code.ToUpper();
				var room = _roomRepository.FindByCode(code);
				if (!room.IsFull())
					return Ok();
				else
					throw new RoomException(ErrorCodes.RoomIsFull.ToString(), ErrorCodes.RoomIsFull);
			}
			catch (RoomException ex)
			{
				switch(ex.ErrorCode)
				{
					case ErrorCodes.RoomIsFull:
					{
						return new NotFoundObjectResult(ErrorCodes.RoomIsFull);
					}
					case ErrorCodes.RoomNotFound:
					{
						return new NotFoundObjectResult(ErrorCodes.RoomNotFound);
					}
					case ErrorCodes.IncorrectCodeFormat:
					{
						return new NotFoundObjectResult(ErrorCodes.IncorrectCodeFormat);
					}
					default:
					{
						return new StatusCodeResult(500);
					}
				}
			}
		}
	}
}