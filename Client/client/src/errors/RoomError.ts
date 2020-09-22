import { ErrorCodes } from "../enums/ErrorCodes";

class RoomError extends Error {
	private code: ErrorCodes;
	public get Code() {
		return this.code;
	}
	constructor(errorCode:ErrorCodes, m?: string) {
		super(m);
		this.code = errorCode;
		Object.setPrototypeOf(this, RoomError.prototype);
	}
}

export default RoomError;