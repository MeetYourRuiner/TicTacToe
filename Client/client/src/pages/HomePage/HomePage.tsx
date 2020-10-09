import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import APIService from "../../api/api";
import ErrorDialog from "../../components/ErrorDialog/ErrorDialog";
import { ErrorCodes } from "../../enums/ErrorCodes";
import RoomError from "../../errors/RoomError";
import "./HomePage.css";

function HomePage() {
	const [code, setCode] = useState<string>("");
	const [error, setError] = useState<ErrorCodes>();
	let history = useHistory();

	const handleClickCreateRoom = async () => {
		try {
			let roomCode: string = await APIService.CreateRoom();
			history.push(`/room?code=${roomCode}`);
		} catch (err) {
			if (err instanceof RoomError) {
				setError(err.Code);
				console.log(err.Code);
			}
		}
	};

	const handleClickEnterRoom = async () => {
		try {
			let isAllowedToEnter: boolean = await APIService.GetRoomState(code);
			if (isAllowedToEnter) {
				history.push(`/room?code=${code}`);
			}
		} catch (err) {
			if (err instanceof RoomError) {
				setError(err.Code);
				console.log(err.Code);
			}
		}
	};

	return (
		<div className="home-page">
			<div className="title">Tic-Tac-Toe</div>
			<button
				className="btn create-room"
				onClick={() => handleClickCreateRoom()}
			>
				Create room
			</button>
			<div className="code-wrapper">
				<input
					onChange={(e) => {
						setCode(e.target.value);
					}}
					maxLength={5}
					className="textbox code"
					type="text"
					name="code"
					placeholder="CODE"
				/>
				<button
					className="btn enter-room"
					onClick={() => handleClickEnterRoom()}
				>
					Enter the room
				</button>
			</div>
			{error && (
				<ErrorDialog
					handleClickFunction={() => setError(undefined)}
					errorCode={error}
				/>
			)}
		</div>
	);
}

export default HomePage;
