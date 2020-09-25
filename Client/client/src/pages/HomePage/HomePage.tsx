import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import APIService from "../../api/api";
import RoomError from "../../errors/RoomError";
import "./HomePage.css";

function HomePage() {
	const [code, setCode] = useState<string>("");
	let history = useHistory();

	const handleClickCreateRoom = async () => {
		try {
			let roomCode: string = await APIService.CreateRoom();
			history.push(`/room?code=${roomCode}`);
		} catch (err) {
			if (err instanceof RoomError) {
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
				console.log(err.Code);
			}
		}
	};

	return (
		<div className="Home">
			<button
				className="btn create-room"
				onClick={() => handleClickCreateRoom()}
			>
				Create room
			</button>
			<br />
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
	);
}

export default HomePage;
