import React from "react";
import { ErrorCodes } from "../../enums/ErrorCodes";
import "./ErrorDialog.css";

interface IErrorDialogProps {
	errorCode: ErrorCodes;
	handleClickFunction: Function;
}

function ErrorDialog(props: IErrorDialogProps) {
	const handleClick = () => {
		props.handleClickFunction();
	};

	const getDescription = () => {
		switch (props.errorCode) {
			case ErrorCodes.RoomIsFull:
				return "The room is full";
			case ErrorCodes.RoomNotFound:
				return "The room is not found";
			case ErrorCodes.RoomIsFailedToCreate:
				return "Room is failed to create";
			case ErrorCodes.ServerError:
				return "Internal server error";
			case ErrorCodes.ConnectionFailed:
				return "Failed to connect to the websocket";
			case ErrorCodes.ConnectionLost:
				return "Connection to the websocket is lost";
			case ErrorCodes.ServerIsUnavailable:
				return "Server is unavailable";
			default:
				return "";
		}
	};

	return (
		<>
			<div className="error-dialog">
				<div className="error-title">ERROR</div>
				<div className="error-description">{getDescription()}</div>
				<button
					className="btn error-ok-btn"
					onClick={() => handleClick()}
				>
					OK
				</button>
			</div>
			<div className="error-blackout" />
		</>
	);
}

export default ErrorDialog;
