import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home/Home";
import Gameboard from "./Components/Gameboard/Gameboard";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/game" component={Gameboard} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
