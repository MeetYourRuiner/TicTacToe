import * as signalR from "@microsoft/signalr";
import React from "react";
import "./TicTacToe.css";

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
			board: new Array<string>().fill(' '),
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
		const renderCell = (index: number) =>
		{
			return (
				<td onClick={() => this.handleClick(index)}>{this.state.board[index]}</td>
			)
		}

		return (
			<table style={tableStyle} className="board">
				<tbody>
					<tr>
						{renderCell(0)}						
						{renderCell(1)}
						{renderCell(2)}
					</tr>
					<tr>
						{renderCell(3)}
						{renderCell(4)}
						{renderCell(5)}
					</tr>
					<tr>
						{renderCell(6)}
						{renderCell(7)}
						{renderCell(8)}						
					</tr>
				</tbody>
			</table>
		);
	}

	render() {
		return (
			<div className="game">
				<div className="status">{this.state.status}</div>
				{this.renderBoard()}
			</div>
		);
	}
}

export default TicTacToe;
