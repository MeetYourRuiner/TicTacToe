import { ErrorCodes } from "../enums/ErrorCodes";
import { HttpStatusCodes } from "../enums/HttpStatusCodes";
import RoomError from "../errors/RoomError";

const API_ENDPOINT: string = "http://192.168.0.106:5000/api";

class APIService {
	public static CreateRoom = async () => {
		let response: Response;
		try {
			response = await fetch(API_ENDPOINT + "/room/create");
		} catch (error) {
			throw new RoomError(ErrorCodes.ServerIsUnavailable);
		}
		if (response.ok) {
			let roomCode = await response.text();
			return roomCode;
		} else {
			throw new RoomError(ErrorCodes.RoomIsFailedToCreate);
		}
	};

	public static GetRoomState = async (code: string) => {
		let response: Response;
		try {
			response = await fetch(
				API_ENDPOINT +
					"/room?" +
					new URLSearchParams({
						code: code,
					})
			);
		} catch (error) {
			throw new RoomError(ErrorCodes.ServerIsUnavailable);
		}
		if (response.ok) {
			return true;
		} else {
			if (response.status === HttpStatusCodes.NOT_FOUND) {
				let errorCode: number = await response.json();
				switch (errorCode) {
					case 0: {
						// RoomIsFull
						throw new RoomError(ErrorCodes.RoomIsFull);
					}
					case 1: {
						// RoomNotFound,
						throw new RoomError(ErrorCodes.RoomNotFound);
					}
				}
			}
			throw new RoomError(ErrorCodes.ServerError);
		}
	};
}

export default APIService;
