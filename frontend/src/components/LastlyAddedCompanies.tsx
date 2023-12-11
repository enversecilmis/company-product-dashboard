import { useQuery } from "@tanstack/react-query"
import EteAPI from "../utils/api-utils"
import { Button, Card, Flex, List, Spin, Typography } from "antd"
import dayjs from "dayjs"
import { ReloadOutlined } from "@ant-design/icons"
import apiHooks from "../hooks/api-hooks"



export default function LastlyAddedCompanies() {
	const {
		data,
		isLoading,
		refetch,
		isRefetching,
		error,
	} = apiHooks.useCompanies({ sort: "-createdAt", pageSize: 3 })

	const lastlyAddedCompanies = data?.companies

	return (
		<Card bordered={false}>
			<List
				loading={isLoading}
				dataSource={lastlyAddedCompanies}
				header={(
					<Flex justify="space-between">
						<Flex gap={20} align="center">
							<Typography.Text type="secondary">Lastly Added Companies</Typography.Text>
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
						<span className="text-sky-600 text-sm">{dayjs(item.createdAt).toString()}</span>
					</List.Item>
				)}
			/>
		</Card>
	)
}
