import * as signalR from "@microsoft/signalr";
import React from "react";

interface IState {
	hubConnection?: signalR.HubConnection;
	myId: string;
	opponentId: string;
	myRole: string;
	opponentRole: string;
	board: string[];
	isMyTurn: boolean;
	status: string;
}

class TicTacToe extends React.Component<{}, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			myId: "",
			opponentId: "",
			myRole: "",
			opponentRole: "",
			isMyTurn: false,
			status: "Game is not started",
			hubConnection: undefined,
			board: [],
		};
	}

	componentDidMount() {
		let hubConnection = new signalR.HubConnectionBuilder()
			.withUrl("http://localhost:5000/game")
			.configureLogging(signalR.LogLevel.Trace)
			.build();
		this.setState({ hubConnection: hubConnection });

		hubConnection.on("updateBoard", (board: string[]) => {
			this.setState({ board: board });
		});

		hubConnection.on("turn", (role: string) => {
			if (role === this.state.myRole) {
				this.setState({
					isMyTurn: true,
					status: "Your turn",
				});
			} else {
				this.setState({
					isMyTurn: false,
					status: "Opponent's turn",
				});
			}
		});

		hubConnection.on("victory", (winnerId: string) => {
			this.setState({ status: winnerId + " won" });
		});

		hubConnection.on("tie", () => {
			this.setState({ status: "Tie" });
		});

		hubConnection.on("handshake", (myId: string) => {
			this.setState({ myId: myId });
		});

		hubConnection.on(
			"start",
			(
				playerAId: string,
				roleA: string,
				playerBId: string,
				roleB: string
			) => {
				this.setState({
					opponentId:
						playerAId === this.state.myId ? playerBId : playerAId,
					myRole: playerAId === this.state.myId ? "x" : "o",
					opponentRole: playerAId === this.state.myId ? "o" : "x",
					status: "Game starts",
				});
			}
		);

		hubConnection.on("stop", () => {
			this.state.hubConnection?.stop();
			this.setState({ status: "Game ended" });
		});

		hubConnection.start().catch((err) => console.log(err));
	}

	handleClick(i: number) {
		if (this.state.isMyTurn)
			this.state.hubConnection?.invoke("action", i, this.state.myRole);
	}

	renderBoard() {
		const tableStyle = {
			border: "1px solid black",
		};
		return (
			<table style={tableStyle} className="board">
				<tbody>
					<tr>
						<td onClick={() => this.handleClick(0)}>{this.state.board[0]}</td>
						<td onClick={() => this.handleClick(1)}>{this.state.board[1]}</td>
						<td onClick={() => this.handleClick(2)}>{this.state.board[2]}</td>
					</tr>
					<tr>
						<td onClick={() => this.handleClick(3)}>{this.state.board[3]}</td>
						<td onClick={() => this.handleClick(4)}>{this.state.board[4]}</td>
						<td onClick={() => this.handleClick(5)}>{this.state.board[5]}</td>
					</tr>
					<tr>
						<td onClick={() => this.handleClick(6)}>{this.state.board[6]}</td>
						<td onClick={() => this.handleClick(7)}>{this.state.board[7]}</td>
						<td onClick={() => this.handleClick(8)}>{this.state.board[8]}</td>
					</tr>
				</tbody>
			</table>
		);
	}

	render() {
		return (
			<div>
				<div className="status">{this.state.status}</div>
				{this.renderBoard()}
			</div>
		);
	}
}

export default TicTacToe;
