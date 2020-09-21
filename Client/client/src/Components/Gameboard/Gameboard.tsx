import * as signalR from "@microsoft/signalr";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ErrorCodes } from "../../enums/ErrorCodes";
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
	code: string;
}

interface IPathProps {}

interface IOwnProps extends RouteComponentProps<IPathProps> {}

class Gameboard extends React.Component<IOwnProps, IState> {
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
			code: "",
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
			this.setState({ status: "Game ended", isGameStopped: true });
		});

		hubConnection.on("connectedToRoom", (code: string) => {
			if (this.state.code === "") {
				this.setState({ code: code });
				this.props.history.replace(`/game?code=${code}`);
			}
		});

		hubConnection.on("error", (errorCode: ErrorCodes) => {
			this.state.hubConnection
				?.stop()
				.finally(() => this.props.history.push("/"));
		});

		hubConnection
			.start()
			.then(() => {
				let query = this.props.location.search;
				if (query === "") {
					this.createRoom();
				} else {
					let code: string = query.substring(6);
					this.setState({ code: code });
					this.connectWithCode(code);
				}
			})
			.catch((err) => console.log(err));
	}

	async createRoom() {
		await this.state.hubConnection?.invoke("createRoom");
	}

	async connectWithCode(code: string) {
		await this.state.hubConnection?.invoke("connectWithCode", code);
	}

	async handleClick(i: number) {
		if (this.state.isMyTurn && !this.state.isGameStopped)
			await this.state.hubConnection?.invoke(
				"action",
				i,
				this.state.myRole
			);
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

export default withRouter(Gameboard);
