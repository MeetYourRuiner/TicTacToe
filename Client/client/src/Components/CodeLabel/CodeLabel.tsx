import React from "react";

import "./CodeLabel.css";
import copyIcon from "../../img/copy.png";

interface ICodeLabelProps {
	value: string;
}

function CodeLabel(props: ICodeLabelProps) {

	const handleClick = () => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(props.value);
		}
	}

	return (
		<div  onClick={() => handleClick()} className="code-label-wrapper">
			<img className="code-label-icon" src={copyIcon}/>
			<div className="code-label-text">{props.value}</div>
		</div>
	);
}

export default CodeLabel;
