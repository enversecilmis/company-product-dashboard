import { Button, Flex, Popconfirm, Table } from "antd";
import { Product } from "../utils/api-utils";
import CreateProductDrawer from "../components/CreateProductDrawer";
import { DeleteOutlined, EditFilled, PlusOutlined } from "@ant-design/icons";
import ProductEditDrawer from "../components/ProductEditDrawer";
import { useState } from "react";
import apiHooks from "../hooks/api-hooks";
import { ColumnsType } from "antd/es/table";
import sortQueryString from "../utils/sort-string";
import sortDirection from "../utils/sort-direction";



export default function ProducstPage() {
	const [editingItem, setEditingItem] = useState<Product>()
	const [selectedIds, setSelectedIds] = useState<string[]>([])
	const [createDrawerOpen, setCreateDrawerOpen] = useState(false)
	const [editDrawerOpen, setEditDrawerOpen] = useState(false)
	const [{ page, pageSize }, setPageConfig] = useState({ page: 1, pageSize: 20 })
	const [sort, setSort] = useState("")
	const [filters, setFilters] = useState<{ category?: string[] }>({ category: [] })


	const {
		data: productsData,
		isLoading: isLoadingProducts,
		isPlaceholderData,
	} = apiHooks.useProducts({ page, pageSize, sort, ...filters })
	const { data: categories } = apiHooks.useCategories()

	const {
		mutate: deleteProducts,
		isPending: isDeletingProducts,
	} = apiHooks.useDeleteProducts({ onSuccess: () => setSelectedIds([]) })


	const editHandler = (product: Product) => {
		setEditingItem(product)
		setEditDrawerOpen(true)
	}

	const onEditDrawerClose = () => {
		setEditingItem(undefined)
		setEditDrawerOpen(false)
	}


	const columns: ColumnsType<Product> = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			sortOrder: sortDirection("name", sort),
			sorter: true,
			fixed: true,
		},
		{
			title: "Amount",
			dataIndex: "amount",
			key: "amount",
			sorter: true,
			sortOrder: sortDirection("amount", sort),
		},
		{
			title: "Unit",
			dataIndex: "amountUnit",
			key: "amountUnit",
			sorter: true,
			sortOrder: sortDirection("amountUnit", sort),
		},
		{
			title: "Category",
			dataIndex: "category",
			key: "category",
			sorter: true,
			sortOrder: sortDirection("category", sort),
			filters: categories?.map(c => ({ text: c, value: c })),
		},
		{
			title: "Company",
			dataIndex: "company",
			key: "company",
			render: (company) => company.name,
		},
		{
			title: "",
			key: "edit",
			render: (product) => (
				<Button
					shape="circle"
					type="default"
					icon={<EditFilled />}
					onClick={() => editHandler(product)}
				/>
			),
		}
	]


	return (
		<Flex vertical gap={20} className="p-4">
			<CreateProductDrawer
				open={createDrawerOpen}
				onClose={() => setCreateDrawerOpen(false)}
			/>
			<ProductEditDrawer
				product={editingItem}
				open={editDrawerOpen}
				onClose={onEditDrawerClose}
			/>

			<Flex gap={20}>
				<Popconfirm
					title="Delete selected products"
					description={`Are you sure to delete ${selectedIds.length} products?`}
					onConfirm={() => deleteProducts(selectedIds)}
					okText="Yes"
					cancelText="No"
				>
					<Button
						loading={isDeletingProducts}
						disabled={selectedIds.length === 0}
						icon={<DeleteOutlined />}
					>
						Delete
					</Button>
				</Popconfirm>

				<Button
					loading={false}
					icon={<PlusOutlined />}
					onClick={() => setCreateDrawerOpen(true)}
				>
					New
				</Button>
			</Flex>


			<Table
				scroll={{ x: true, y: "60vh" }}
				loading={isLoadingProducts || isPlaceholderData}
				dataSource={productsData?.products}
				columns={columns}
				rowKey={product => product._id}
				rowClassName={({ _id }) => selectedIds.includes(_id) && isDeletingProducts ?  "opacity-60" : ""}
				onChange={(_, filters, sorter) => {
					setSort(sortQueryString(sorter))
					setFilters({ category: (filters.category ?? []) as string[] })
				}}
				pagination={{
					pageSize: pageSize,
					pageSizeOptions: [10, 20],
					total: productsData?.totalCount,
					showTotal: (total, [start, end]) => <span>showing between {start}-{end} from {total} products</span>,
					showSizeChanger: true,
					onChange: (page, pageSize) => setPageConfig({ page, pageSize }),
				}}
				rowSelection={{
					type: "checkbox",
					selections: ["SELECT_ALL", "SELECT_NONE"],
					getCheckboxProps: () => ({ disabled: isDeletingProducts }),
					selectedRowKeys: selectedIds,
					onChange: (selectedRowKeys) => setSelectedIds(selectedRowKeys as string[]),
				}}
			/>
    </Flex>
	)
}
