import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import Gameboard from "./components/Gameboard/Gameboard";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/room" component={Gameboard} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
