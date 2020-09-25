import React from "react";

interface IStatusProps {
	value: string;
}

function Status(props: IStatusProps) {
	return <div className="status">{props.value}</div>;
}

export default Status;
