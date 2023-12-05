import { useQuery } from "@tanstack/react-query"
import EteAPI from "../utils/api-utils"
import { Button, Card, Flex, List, Spin, Typography } from "antd"
import dayjs from "dayjs"
import { ReloadOutlined } from "@ant-design/icons"



export default function LastlyAddedProductsCard() {
	const { data, isLoading, refetch, isRefetching, error } = useQuery({
		queryKey: ["lastly added products"],
		queryFn: () => EteAPI.getProducts({ sort: "-createdAt", pageSize: 3 }),
	})

	const lastlyAddedProducts = data?.products

	return (
		<Card bordered={false}>
			<List
				loading={isLoading}
				dataSource={lastlyAddedProducts}
				header={(
					<Flex justify="space-between">
						<Flex gap={20} align="center">
							<Typography.Text type="secondary">Lastly Added Products</Typography.Text>
							{error && <Typography.Text type="danger">{error.message}</Typography.Text>}
						</Flex>
						<Flex justify="center" align="center" className="w-8 h-8">
							{(isLoading || isRefetching) && <Spin />}
							{(!isLoading && !isRefetching) && <Button shape="circle" icon={<ReloadOutlined />} onClick={() => refetch()} />}
						</Flex>
					</Flex>
				)}
				renderItem={item => (
					<List.Item>
						<span className="text-sky-600 text-base">{item.name}</span>
						<span className="text-sky-600 text-sm">{item.category}</span>
					</List.Item>
				)}
			/>
		</Card>
	)
}
