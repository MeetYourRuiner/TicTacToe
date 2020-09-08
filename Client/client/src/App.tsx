import React, { useState } from "react";
import signalR from "@microsoft/signalr";
import logo from "./logo.svg";
import "./App.css";

function App() {
	const hubConnection = new signalR.HubConnectionBuilder()
		.withUrl("/chat")
		.build();

	hubConnection.on("Send", function (data) {
		let elem = document.createElement("p");
		elem.appendChild(document.createTextNode(data));
		let firstElem = document.getElementById("chatroom").firstChild;
		document.getElementById("chatroom").insertBefore(elem, firstElem);
	});
	document.getElementById("sendBtn").addEventListener("click", function (e) {
		let message = document.getElementById("message").value;
		hubConnection.invoke("Send", message);
	});

	hubConnection.start();
	return (
		<div className="App">
			<div id="inputForm">
				<input type="text" id="message" />
				<input type="button" id="sendBtn" value="Отправить" />
			</div>
			<div id="chatroom"></div>
		</div>
	);
}

export default App;
