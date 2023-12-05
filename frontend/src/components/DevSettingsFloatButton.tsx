import { ClockCircleOutlined, CommentOutlined, CustomerServiceOutlined, SettingFilled, SettingOutlined, StopOutlined } from "@ant-design/icons";
import { Badge, FloatButton } from "antd";
import { useState } from "react";
import EteAPI from "../utils/api-utils";



export default function DevSettingsFloatButton() {
	const [delayEnabled, setDelayEnabled] = useState(EteAPI.delayEnabled)
	const [errorEnabled, setErrorEnabled] = useState(EteAPI.throwError)

	return (
		<FloatButton.Group
			type="primary"
			trigger="click"
			style={{ right: 24 }}
			icon={<SettingFilled />}
			badge={{ dot: delayEnabled || errorEnabled }}
		>
			<FloatButton
				type={delayEnabled ? "primary" : "default"}
				icon={<ClockCircleOutlined />}
				tooltip={delayEnabled ? "Disable API delay" : "Enable API delay"}
				onClick={() => {
					setDelayEnabled(!delayEnabled)
					EteAPI.delayEnabled = !delayEnabled
				}}
			/>
			
			<FloatButton
				type={errorEnabled ? "primary" : "default"}
				icon={<StopOutlined />}
				tooltip={errorEnabled ? "Disable throw API error" : "Enable throw API error (auth related endpoints are excluded)"}
				onClick={() => {
					setErrorEnabled(!errorEnabled)
					EteAPI.throwError = !errorEnabled
				}}
			/>
		</FloatButton.Group>
	)
}
