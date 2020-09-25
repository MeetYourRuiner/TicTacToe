import React from "react";
import "./Gameboard.css";

interface IGameboardProps {
	value: string[];
	onCellClick: Function;
}

function Gameboard(props: IGameboardProps) {
	const renderBoard = () => {
		const renderCell = (index: number) => {
			return (
				<td
					onClick={async () => {
						if (props.value[index] === " ")
							await props.onCellClick(index);
					}}
				>
					<p className="mark">{props.value[index]}</p>
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

	return (
		<div className="gameboard">
			{renderBoard()}
		</div>
	);
}

export default Gameboard;
