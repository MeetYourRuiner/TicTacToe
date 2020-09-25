import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import "./App.css";
import Home from "./pages/HomePage/HomePage";
import GamePage from "./pages/GamePage/GamePage";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/room" component={GamePage} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
