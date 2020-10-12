import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import CodeLabel from "../../components/CodeLabel/CodeLabel";
import Gameboard from "../../components/Gameboard/Gameboard";
import Status from "../../components/Status/Status";
import * as signalR from "@microsoft/signalr";
import { ErrorCodes } from "../../enums/ErrorCodes";

import "./GamePage.css";
import ErrorDialog from "../../components/ErrorDialog/ErrorDialog";

interface IGamepageState {
	code: string;
	status: string;
	myId: string;
	board: string[];
	isMyTurn: boolean;
	isGameStopped: boolean;
	myRole: string;
	isWaitingForReadiness: boolean;
	isReadyPressed: boolean;
	error: ErrorCodes | undefined;
}

interface IPathProps {}

interface IOwnProps extends RouteComponentProps<IPathProps> {}

class GamePage extends React.Component<IOwnProps, IGamepageState> {
	hub: signalR.HubConnection = new signalR.HubConnectionBuilder()
		.withUrl("http://192.168.0.106:5000/game")
		.configureLogging(signalR.LogLevel.Trace)
		.build();
	constructor(props: any) {
		super(props);
		this.state = {
			code: "",
			status: "Connecting...",
			myId: "",
			myRole: "",
			board: new Array<string>().fill(" "),
			isMyTurn: false,
			isGameStopped: true,
			isWaitingForReadiness: false,
			isReadyPressed: false,
			error: undefined,
		};
	}
	componentDidMount() {
		this.hub.on("updateBoard", (board: string[]) => {
			this.setState({ board: board });
		});

		this.hub.on("turn", (playerId: string) => {
			if (this.state.myId === playerId) {
				this.setState({ isMyTurn: true, status: "Your turn" });
			} else {
				this.setState({ isMyTurn: false, status: "Opponent's turn" });
			}
		});

		this.hub.on("victory", (winnerId: string) => {
			let winner: string =
				winnerId === this.state.myId ? "You" : "Opponent";
			this.setState({ status: winner + " won" });
		});

		this.hub.on("tie", () => {
			this.setState({ status: "Tie" });
		});

		this.hub.on("handshake", (myId: string) => {
			this.setState({ myId: myId });
		});

		this.hub.on(
			"start",
			(
				playerAId: string,
				roleA: string,
				playerBId: string,
				roleB: string
			) => {
				if (playerAId === this.state.myId) {
					this.setState({ myRole: roleA });
				} else {
					this.setState({ myRole: roleB });
				}
				this.setState({
					isGameStopped: false,
					isWaitingForReadiness: false,
				});
			}
		);

		this.hub.on("connected", () => {
			this.setState({ status: "Waiting for opponent" });
		});

		this.hub.on("opponentDisconnected", () => {
			this.setState({ status: "Waiting for opponent" });
		});

		this.hub.on("stop", async () => {
			this.setState({
				isGameStopped: true,
				isWaitingForReadiness: false,
			});
		});

		this.hub.on("error", (errorCode: ErrorCodes) => {
			this.setState({error: errorCode});
		});

		this.hub.on("readyCheck", () => {
			this.setState({
				isWaitingForReadiness: true,
				isReadyPressed: false,
			});
		});

		this.hub.onclose((error) => {
			if (error) {
				if (
					error instanceof signalR.TimeoutError ||
					error instanceof signalR.AbortError
				)
				this.setState({error: ErrorCodes.ConnectionLost});
			}
		});

		this.hub
			.start()
			.then(() => {
				let query = this.props.location.search;
				let code: string = query.substring(6);
				this.setState({ code: code });
				this.connect(code);
			})
			.catch(() => this.setState({error: ErrorCodes.ConnectionFailed}));
	}

	componentWillUnmount() {
		this.hub.stop().catch((err) => console.log(err));
	}

	async connect(code: string) {
		await this.hub.invoke("connect", code);
	}

	async ready() {
		await this.hub
			.invoke("ready")
			.then(() => this.setState({ isReadyPressed: true }));
	}

	async handleClick(i: number) {
		if (this.state.isMyTurn && !this.state.isGameStopped) {
			await this.hub.invoke("action", i, this.state.myRole);
		}
	}

	handleClickLeaveRoom() {
		this.pushToHomePage();
	}

	private pushToHomePage(errorCode: ErrorCodes | undefined = undefined) {
		this.props.history.push("/");
	}

	render() {
		return (
			<div className="game-page">
				<button
					className="btn leave-room"
					onClick={() => this.handleClickLeaveRoom()}
				>
					{/* 🡠 */}
					&#129120;
				</button>
				<Status value={this.state.status} />
				<Gameboard
					value={this.state.board}
					onCellClick={(index: number) => this.handleClick(index)}
				/>
				<CodeLabel value={this.state.code} />
				{this.state.isWaitingForReadiness && (
					<button
						onClick={() => this.ready()}
						className="btn ready"
						disabled={this.state.isReadyPressed}
					>
						Ready
					</button>
				)}
				{(this.state.isGameStopped ||
					this.state.isWaitingForReadiness) && (
					<div className="blackout" />
				)}
				{this.state.error && (
					<ErrorDialog
						errorCode={this.state.error}
						handleClickFunction={() => {
							this.setState({ error: undefined });
							this.pushToHomePage();
						}}
					/>
				)}
			</div>
		);
	}
}

export default withRouter(GamePage);
