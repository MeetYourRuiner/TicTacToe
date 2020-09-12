import * as signalR from "@microsoft/signalr";
import React from "react";
import "./Gameboard.css";

interface IState {
	hubConnection?: signalR.HubConnection;
	myId: string;
	opponentId: string;
	myRole: string;
	opponentRole: string;
	board: string[];
	isMyTurn: boolean;
	isGameStopped: boolean;
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
			isGameStopped: true,
			status: "Game is not started",
			hubConnection: undefined,
			board: new Array<string>().fill(" "),
		};
	}

	componentDidMount() {
		let hubConnection = new signalR.HubConnectionBuilder()
			.withUrl("http://192.168.0.106:5000/game")
			.configureLogging(signalR.LogLevel.Trace)
			.build();
		this.setState({ hubConnection: hubConnection });

		hubConnection.on("updateBoard", (board: string[]) => {
			this.setState({ board: board });
		});

		hubConnection.on("turn", (playerId: string) => {
			if (playerId === this.state.myId) {
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
				let isPlayerA: boolean = playerAId === this.state.myId;
				this.setState({
					opponentId: isPlayerA ? playerBId : playerAId,
					myRole: isPlayerA ? roleB : roleA,
					opponentRole: isPlayerA ? roleA : roleB,
					status: "Game starts",
					isGameStopped: false,
				});
			}
		);

		hubConnection.on("stop", async () => {
			await this.state.hubConnection?.stop();
			this.setState({ status: "Game ended", isGameStopped: true });
		});

		hubConnection.start().catch((err) => console.log(err));
	}

	async handleClick(i: number) {
		if (this.state.isMyTurn && !this.state.isGameStopped)
			await this.state.hubConnection?.invoke("action", i, this.state.myRole);
	}

	renderBoard() {
		const renderCell = (index: number) => {
			return (
				<td
					onClick={async () => {
						if (this.state.board[index] === " ")
							await this.handleClick(index);
					}}
				>
					<p className="mark">{this.state.board[index]}</p>
				</td>
			);
		};

		return (
			<table className="board">
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
