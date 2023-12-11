import { Button, Card, Flex, Spin, Statistic, Typography } from "antd"
import { ReloadOutlined } from "@ant-design/icons"
import apiHooks from "../hooks/api-hooks"



export default function ProductCountCard() {
	const {
		data: productCount,
		isLoading,
		refetch,
		isRefetching,
		error,
	} = apiHooks.useProductCount()

	return (
		<Card bordered={false}>
			<Statistic
				title={(
					<Flex justify="space-between">
						<Flex align="center" gap={20}>
							<Typography.Text type="secondary">Total Products</Typography.Text>
							{error && <Typography.Text type="danger">{error.message}</Typography.Text>}
						</Flex>
						<Flex justify="center" align="center" className="w-8 h-8">
							{(isLoading || isRefetching) && <Spin />}
							{(!isLoading && !isRefetching) && <Button shape="circle" icon={<ReloadOutlined />} onClick={() => refetch()} />}
						</Flex>
					</Flex>
				)}
				value={productCount}
				valueStyle={{ color: "#0284c7" }}
				loading={isLoading}
			/>
		</Card>
	)
}
