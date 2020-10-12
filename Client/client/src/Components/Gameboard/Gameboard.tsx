import React, { useState } from "react";
import "./Gameboard.css";

interface IGameboardProps {
	value: string[];
	onCellClick: Function;
	myRole: string;
	isMyTurn: boolean;
}

interface ICellProps {
	value: string;
	onCellClick: Function;
	myRole: string;
	isMyTurn: boolean;
}

function Cell(props: ICellProps) {
	const [isMouseOver, changeIsMouseOverState] = useState<boolean>(
		false
	);
	let highlightOnHover: boolean = props.value === " " && props.isMyTurn;
	let classNames: string = highlightOnHover ? "highlightable" : "";
	const getValue = () => {
		if (props.value !== " ") {
			return props.value;
		}
		else if (isMouseOver && highlightOnHover) {
			return props.myRole;
		}
		else {
			return " ";
		}
	};
	return (
		<td
			className={classNames}
			onClick={async () => {
				if (props.value === " ") await props.onCellClick();
			}}
			onMouseEnter={() => changeIsMouseOverState(true)}
			onMouseLeave={() => changeIsMouseOverState(false)}
		>
			<p className="mark">{getValue()}</p>
		</td>
	);
}

function Gameboard(props: IGameboardProps) {
	const renderBoard = () => {
		const renderCell = (index: number) => {
			return (
				<Cell
					isMyTurn={props.isMyTurn}
					myRole={props.myRole}
					onCellClick={async () => {
						if (props.value[index] === " ")
							await props.onCellClick(index);
					}}
					value={props.value[index]}
				/>
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
	};

	return <div className="gameboard">{renderBoard()}</div>;
}

export default Gameboard;
