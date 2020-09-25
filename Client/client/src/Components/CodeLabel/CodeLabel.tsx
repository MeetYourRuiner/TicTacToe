import React from "react";

interface ICodeLabelProps {
	value: string;
}

function CodeLabel(props: ICodeLabelProps) {
	return <div className="code-label">{props.value}</div>;
}

export default CodeLabel;
