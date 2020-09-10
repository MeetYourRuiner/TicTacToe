import React, { Component } from "react";
import * as signalR from "@microsoft/signalr";
import "./App.css";

interface IState {
	message: string,
	messageHistory: string[],
	hubConnection?: signalR.HubConnection
}

class App extends Component<{}, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			message: "",
			messageHistory: [],
			hubConnection: undefined
		}
	}

	componentDidMount() {
		let hubConnection = new signalR.HubConnectionBuilder()
			.withUrl("http://localhost:5000/chat")
			.build();
		this.setState({hubConnection: hubConnection});
		hubConnection.on("Send", (data: string) => {
			let messageArray = this.state.messageHistory;
			messageArray.push(data);
			this.setState({messageHistory: messageArray});
		});
		hubConnection.start().catch((err) => console.log(err));
	}

	render() {
		return (
		<div className="App">
			<div id="inputForm">
				<input type="text" id="message" onChange={(e) => this.setState({message: e.target.value})}/>
				<input type="button" id="sendBtn" value="Отправить" onClick={() => this.state.hubConnection && this.state.hubConnection.invoke("Send", this.state.message)}/>
			</div>
			<div>
				{
					this.state.messageHistory
						.map(
							(m: string) => {
								return <div>{m}</div>
							}
						)
				}
			</div>
		</div>
		)
	}
}

export default App;
