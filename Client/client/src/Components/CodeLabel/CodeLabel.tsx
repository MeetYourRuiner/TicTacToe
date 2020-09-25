import React from "react";

import "./CodeLabel.css";

interface ICodeLabelProps {
	value: string;
}

function CodeLabel(props: ICodeLabelProps) {
	return (
		<div className="code-label-wrapper">
			<div className="code-label-text">{props.value}</div>
		</div>
	);
}

export default CodeLabel;
