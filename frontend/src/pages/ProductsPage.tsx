import { App, Button, Flex, Popconfirm, Table } from "antd";
import EteAPI, { Product } from "../utils/api-utils";
import { useQuery } from "@tanstack/react-query";
import CreateProductDrawer from "../components/CreateProductDrawer";
import { create } from "zustand";
import { DeleteOutlined, EditFilled, PlusOutlined } from "@ant-design/icons";
import { queryClient } from "../main";
import ProductEditDrawer from "../components/ProductEditDrawer";


type ProductTableState = {
	isDeleting: boolean
	selectedIds: string[]
	createDrawerOpen: boolean
	editDrawerOpen: boolean
	editingItem?: Product
	setIsDeleting: (isDeleting: boolean) => void
	setSelectedIds: (selectedIds: string[]) => void
	setCreateDrawerOpen: (createDrawerOpen: boolean) => void
	setEditDrawerOpen: (editDrawerOpen: boolean) => void
	setEditingItem: (editingItem?: Product) => void
}

const useProductTableState = create<ProductTableState>((set) => ({
	isDeleting: false,
	selectedIds: [],
	createDrawerOpen: false,
	editDrawerOpen: false,
	editingItem: undefined,
	setEditDrawerOpen: (editDrawerOpen: boolean) => set({ editDrawerOpen }),
	setIsDeleting: (isDeleting: boolean) => set({ isDeleting }),
	setSelectedIds: (selectedIds: string[]) => set({ selectedIds }),
	setCreateDrawerOpen: (createDrawerOpen: boolean) => set({ createDrawerOpen }),
	setEditingItem: (editingItem?: Product) => set({ editingItem }),
}))




export default function ProducstPage() {
	const { message } = App.useApp()
	const {
		isDeleting, setIsDeleting,
		selectedIds, setSelectedIds,
		createDrawerOpen, setCreateDrawerOpen,
		editDrawerOpen, setEditDrawerOpen,
		editingItem, setEditingItem,
	} = useProductTableState()


	const { data, isLoading } = useQuery({
		queryKey: ["products"],
		queryFn: () => EteAPI.getProducts({  })
	})

	const products = data?.products


	const deleteHandler = async () => {
		setIsDeleting(true)

		try {
			const deletedCount = await EteAPI.deleteManyProducts(selectedIds)
			message.success(`Successfully deleted ${deletedCount} product`)
			await queryClient.invalidateQueries({ queryKey: ["products"] })
			setSelectedIds([])
		}
		catch (err) {
			if (err instanceof Error)
				message.error(err.message)
		}
		finally {
			setIsDeleting(false)
		}
	}


	const editHandler = (company: Product) => {
		setEditingItem(company)
		setEditDrawerOpen(true)
	}

	const onEditDrawerClose = () => {
		setEditingItem(undefined)
		setEditDrawerOpen(false)
	}



	return (
		<Flex vertical gap={20} className="p-4">
			<CreateProductDrawer open={createDrawerOpen} onClose={() => setCreateDrawerOpen(false)} />
			<ProductEditDrawer product={editingItem} open={editDrawerOpen} onClose={onEditDrawerClose} />

			<Flex gap={20}>
				<Popconfirm
					title="Delete selected products"
					description={`Are you sure to delete ${selectedIds.length} products?`}
					onConfirm={deleteHandler}
					okText="Yes"
					cancelText="No"
				>
					<Button
						loading={isDeleting}
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
				loading={isLoading}
				scroll={{ x: "90vw" }}
				dataSource={products}
				rowKey={product => product._id}
				rowClassName={({ _id }) => selectedIds.includes(_id) && isDeleting ?  "opacity-60" : ""}
				columns={[
					{ title: "Name", dataIndex: "name", key: "name", sorter: (a, b) => a.name < b.name ? -1 : 1, },
					{ title: "Amount", dataIndex: "amount", key: "amount", sorter: (a, b) => a.amount < b.amount ? -1 : 1, },
					{ title: "Unit", dataIndex: "amountUnit", key: "amountUnit" },
					{ title: "Category", dataIndex: "category", key: "category" },
					{ title: "Company", dataIndex: "company", key: "company", render: (company) => company.name },
					{ title: "", key: "edit", render: (product) => <Button shape="circle" type="default" icon={<EditFilled />} onClick={() => editHandler(product)} /> }
				]}
				rowSelection={{
					type: "checkbox",
					selections: ["SELECT_ALL", "SELECT_NONE"],
					getCheckboxProps: () => ({ disabled: isDeleting }),
					selectedRowKeys: selectedIds,
					onChange: (selectedRowKeys) => setSelectedIds(selectedRowKeys as string[]),
				}}
			/>
    </Flex>
	)
}
