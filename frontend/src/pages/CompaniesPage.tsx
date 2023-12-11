import { useState } from "react"
import { Button, Flex, Popconfirm, Table } from "antd";
import { Company } from "../utils/api-utils";
import { Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditFilled, PlusOutlined } from "@ant-design/icons";
import CreateCompanyDrawer from "../components/CreateCompanyDrawer";
import CompanyEditDrawer from "../components/CompanyEditDrawer";
import sortDirection from "../utils/sort-direction";
import sortQueryString from "../utils/sort-string";
import apiHooks from "../hooks/api-hooks";



export default function CompaniesPage() {
	const [editingItem, setEditingItem] = useState<Company>()
	const [selectedIds, setSelectedIds] = useState<string[]>([])
	const [createDrawerOpen, setCreateDrawerOpen] = useState(false)
	const [editDrawerOpen, setEditDrawerOpen] = useState(false)
	const [{ page, pageSize }, setPageConfig] = useState({ page: 1, pageSize: 20 })
	const [sort, setSort] = useState("")
	const [filters, setFilters] = useState<{ country?: string[] }>({ country: [] })

	const { data: countries } = apiHooks.useCountries()

	const {
		data: companiesData,
		isLoading: isLoadingCompanies,
		isPlaceholderData,
	} = apiHooks.useCompanies({ page, pageSize, sort, ...filters })

	const {
		mutate: deleteCompanies,
		isPending: isDeletingCompanies,
	} = apiHooks.useDeleteCompany({ onSuccess: () => setSelectedIds([]) })



	const columns: ColumnsType<Company> = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			className: "whitespace-nowrap min-w-fit",
			render: (name) => <Link to="#">{name}</Link>,
			sortOrder: sortDirection("name", sort),
			sorter: true,
			fixed: true,
		},
		{
			title: "Country",
			dataIndex: "incorporationCountry",
			key: "incorporationCountry",
			filters: countries?.map((country) => ({ text: country, value: country })),
			sortOrder: sortDirection("incorporationCountry", sort),
			sorter: true,
		},
		{
			title: "Website",
			dataIndex: "website",
			key: "website",
			className: "whitespace-nowrap min-w-fit",
			render: (website) => <Link to="#">{website}</Link>,
		},
		{
			title: "Legal Number",
			dataIndex: "legalNumber",
			key: "legalNumber",
			className: "whitespace-nowrap min-w-fit",
		},
		{
			title: "",
			key: "edit",
			render: (_, company) => (
				<Button
					shape="circle"
					type="default"
					icon={<EditFilled />}
					onClick={() => {
						setEditingItem(company)
						setEditDrawerOpen(true)
					}}
				/>
			),
		},
	]



  return (
    <Flex vertical gap={20} className="p-4">
			<CreateCompanyDrawer
				open={createDrawerOpen}
				onClose={() => setCreateDrawerOpen(false)}
			/>
			<CompanyEditDrawer
				company={editingItem!}
				open={editDrawerOpen}
				onClose={() => {
					setEditingItem(undefined)
					setEditDrawerOpen(false)
				}}
			/>

			<Flex gap={20}>
				<Popconfirm
					title="Delete selected companies"
					description={`Are you sure to delete ${selectedIds.length} companies?`}
					onConfirm={() => deleteCompanies(selectedIds)}
					okText="Yes"
					cancelText="No"
				>
					<Button
						loading={isDeletingCompanies}
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
				loading={isLoadingCompanies || isPlaceholderData}
				dataSource={companiesData?.companies}
				columns={columns}
				rowKey={company => company._id}
				rowClassName={({ _id }) => selectedIds.includes(_id) && isDeletingCompanies ?  "opacity-60" : ""}
				onChange={(_, filters, sorter) => {
					setSort(sortQueryString(sorter))
					setFilters({ country: (filters.incorporationCountry ?? []) as string[] })
				}}
				pagination={{
					pageSize: pageSize,
					pageSizeOptions: [10, 20],
					total: companiesData?.totalCount,
					showTotal: (total, [start, end]) => <span>showing between {start}-{end} from {total} companies</span>,
					showSizeChanger: true,
					onChange: (page, pageSize) => setPageConfig({ page, pageSize }),
				}}
				rowSelection={{
					type: "checkbox",
					selections: ["SELECT_ALL", "SELECT_NONE"],
					getCheckboxProps: () => ({ disabled: isDeletingCompanies }),
					selectedRowKeys: selectedIds,
					onChange: (selectedRowKeys) => setSelectedIds(selectedRowKeys as string[]),
				}}
			/>
    </Flex>
  );
}
