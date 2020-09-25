import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import CodeLabel from "../../components/CodeLabel/CodeLabel";
import Gameboard from "../../components/Gameboard/Gameboard";
import Status from "../../components/Status/Status";
import * as signalR from "@microsoft/signalr";
import { ErrorCodes } from "../../enums/ErrorCodes";

interface IGamepageState {
	code: string,
	status: string,
	myId: string,
	board: string[],
	isMyTurn: boolean,
	isGameStopped: boolean,
	myRole: string
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
			status: "",
			myId: "",
			myRole: "",
			board: new Array<string>().fill(" "),
			isMyTurn: false,
			isGameStopped: false,
		}
	}
	componentDidMount() {
		this.hub.on("updateBoard", (board: string[]) => {
			this.setState({board:board});
		});

		this.hub.on("turn", (playerId: string) => {
			if (this.state.myId === playerId) {
				this.setState({isMyTurn: true, status:"Your turn"});
			}
			else {
				this.setState({isMyTurn: true, status:"Opponent's turn"});
			}
		});

		this.hub.on("victory", (winnerId: string) => {
			this.setState({status: winnerId + " won"});
		});

		this.hub.on("tie", () => {
			this.setState({status: "Tie"});
		});

		this.hub.on("handshake", (myId: string) => {
			this.setState({myId: myId});
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
					this.setState({myRole: roleA});
				} else {
					this.setState({myRole: roleB});
				}
				this.setState({isGameStopped: false});
			}
		);

		this.hub.on("stop", async () => {
			this.setState({isGameStopped: true});
		});

		this.hub.on("error", (errorCode: ErrorCodes) => {
			this.hub
				?.stop()
				.finally(() => this.props.history.push("/"));
		});

		this.hub
			.start()
			.then(() => {
				let query = this.props.location.search;
				let code: string = query.substring(6);
				this.setState({code: code});
				this.connect(code);
			})
			.catch((err) => console.log(err));
	}
		
	

	async connect(code: string) {
		await this.hub.invoke("connect", code);
	}
	
	async handleClick(i: number) {
		if (this.state.isMyTurn && !this.state.isGameStopped)
		{
			await this.hub.invoke(
				"action",
				i,
				this.state.myRole
			);
		}
	}

	render() {
		return (
			<div className="game-page">
				<Status value={this.state.status}/>
				<Gameboard value={this.state.board} onCellClick={(index: number) => this.handleClick(index)}/>
				<CodeLabel value={this.state.code}/>
			</div>
		)
	} 
}

export default withRouter(GamePage);