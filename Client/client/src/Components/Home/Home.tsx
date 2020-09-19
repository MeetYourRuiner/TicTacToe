import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
	const [code, setCode] = useState<string>();
	return (
		<div className="Home">
			<Link to="/game">
				<button className="btn create-room">Create room</button>
				<br />
			</Link>
			<input
				onChange={(e) => {
					setCode(e.target.value);
				}}
				maxLength={5}
				className="textbox code"
				type="text"
				name="code"
			/>
			<Link to={`/game?code=${code}`}>
				<button className="btn enter-room">Enter the room</button>
			</Link>
		</div>
	);
}

export default Home;
