import { Flex, Spin } from "antd";

export default function PageSpinner() {
	return (
		<Flex justify="center" align="center" className="h-full">
			<Spin size="large" />
		</Flex>
	)
}
