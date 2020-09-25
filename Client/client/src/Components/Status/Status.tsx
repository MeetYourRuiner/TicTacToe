import React from "react";

import "./Status.css";

interface IStatusProps {
	value: string;
}

function Status(props: IStatusProps) {
	return (
		<div className="status-wrapper">
			<div className="status-text">
				{props.value}
			</div>
		</div>
	);
}

export default Status;
