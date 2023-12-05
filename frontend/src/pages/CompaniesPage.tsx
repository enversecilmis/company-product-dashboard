import { useMemo } from "react"
import { App, Button, Flex, Popconfirm, Table } from "antd";
import EteAPI, { Company } from "../utils/api-utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditFilled, PlusOutlined } from "@ant-design/icons";
import { create } from "zustand";
import { queryClient } from "../main";
import CreateCompanyDrawer from "../components/CreateCompanyDrawer";
import CompanyEditDrawer from "../components/CompanyEditDrawer";



type CompanyTableState = {
	isDeleting: boolean
	selectedIds: string[]
	createDrawerOpen: boolean
	editDrawerOpen: boolean
	editingItem?: Company
	setIsDeleting: (isDeleting: boolean) => void
	setSelectedIds: (selectedIds: string[]) => void
	setCreateDrawerOpen: (createDrawerOpen: boolean) => void
	setEditDrawerOpen: (editDrawerOpen: boolean) => void
	setEditingItem: (editingItem?: Company) => void
}
const useCompanyTableState = create<CompanyTableState>((set) => ({
	isDeleting: false,
	selectedIds: [],
	createDrawerOpen: false,
	editDrawerOpen: false,
	editingItem: undefined,
	setEditDrawerOpen: (editDrawerOpen: boolean) => set({ editDrawerOpen }),
	setIsDeleting: (isDeleting: boolean) => set({ isDeleting }),
	setSelectedIds: (selectedIds: string[]) => set({ selectedIds }),
	setCreateDrawerOpen: (createDrawerOpen: boolean) => set({ createDrawerOpen }),
	setEditingItem: (editingItem?: Company) => set({ editingItem }),
}))





export default function CompaniesPage() {
	const { message } = App.useApp()
	const {
		isDeleting, setIsDeleting,
		selectedIds, setSelectedIds,
		createDrawerOpen, setCreateDrawerOpen,
		editDrawerOpen, setEditDrawerOpen,
		editingItem, setEditingItem,
	} = useCompanyTableState()

	const { data, isLoading } = useQuery({
		queryKey: ["companies"],
		queryFn: () => EteAPI.getCompanies({  })
	})

	const companies = data?.companies


	const countryFilters = useMemo(() => {
		return companies?.
			map(company => company.incorporationCountry)
			.filter((name, index, arr) => index === arr.indexOf(name))
			.map(name => ({ text: name, value: name }))
	}, [companies])


	const columns: ColumnsType<Company> = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			render: (name) => <Link to="#">{name}</Link>,
			sorter: (a, b) => a.name < b.name ? -1 : 1,
		},
		{
			title: "Country",
			dataIndex: "incorporationCountry",
			key: "incorporationCountry",
			sorter: (a, b) => a.incorporationCountry < b.incorporationCountry ? -1 : 1,
			filters: countryFilters,
			onFilter: (val, record) => record.incorporationCountry === val
		},
		{
			title: "Website",
			dataIndex: "website",
			key: "website",
			render: (website) => <Link to="#">{website}</Link>,
		},
		{
			title: "Legal Number",
			dataIndex: "legalNumber",
			key: "legalNumber",
		},
		{
			title: "",
			key: "edit",
			render: (_, company) => <Button shape="circle" type="default" icon={<EditFilled />} onClick={() => editHandler(company)} />,
		},
	]


	const deleteHandler = async () => {
		setIsDeleting(true)

		try {
			const deletedCount = await EteAPI.deleteManyCompanies(selectedIds)
			message.success(`Successfully deleted ${deletedCount} company`)
			await queryClient.invalidateQueries({ queryKey: ["companies"] })
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


	const editHandler = (company: Company) => {
		setEditingItem(company)
		setEditDrawerOpen(true)
	}


	const onEditDrawerClose = () => {
		setEditingItem(undefined)
		setEditDrawerOpen(false)
	}

  return (
    <Flex vertical gap={20} className="p-4">
			<CreateCompanyDrawer open={createDrawerOpen} onClose={() => setCreateDrawerOpen(false)} />
			<CompanyEditDrawer company={editingItem!} open={editDrawerOpen} onClose={onEditDrawerClose} />

			<Flex gap={20}>
				<Popconfirm
					title="Delete selected companies"
					description={`Are you sure to delete ${selectedIds.length} companies?`}
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
				scroll={{ x: "100vw" }}
				loading={isLoading}
				dataSource={companies}
				columns={columns}
				rowKey={company => company._id}
				rowClassName={({ _id }) => selectedIds.includes(_id) && isDeleting ?  "opacity-60" : ""}
				rowSelection={{
					type: "checkbox",
					selections: ["SELECT_ALL", "SELECT_NONE"],
					getCheckboxProps: () => ({ disabled: isDeleting }),
					selectedRowKeys: selectedIds,
					onChange: (selectedRowKeys) => setSelectedIds(selectedRowKeys as string[]),
				}}
			/>
    </Flex>
  );
}
