namespace TicTacToe.CustomExceptions
{
	[System.Serializable]
	public class RoomException : System.Exception
	{
		public ErrorCodes ErrorCode { get; set; }
		public RoomException() { }
		public RoomException(string message, ErrorCodes errorCode) : base(message) 
		{ 
			ErrorCode = errorCode;
		}
		public RoomException(string message, ErrorCodes errorCode, System.Exception inner) : base(message, inner) 
		{
			ErrorCode = errorCode;
		}
		protected RoomException(
			System.Runtime.Serialization.SerializationInfo info,
			System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
	}
}