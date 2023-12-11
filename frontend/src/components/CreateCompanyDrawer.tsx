import { Button, Drawer, Form, Input, InputNumber, Space } from "antd";
import apiHooks from "../hooks/api-hooks";


type Props = {
	open: boolean
	onClose: () => void
}


export default function CreateCompanyDrawer({ open, onClose }: Props) {
	const [form] = Form.useForm()

	const {
		mutate: createCompany,
		isPending: isCreating,
	} = apiHooks.useCreateCompany({ onSuccess: onClose })


	const addNewCompany = () => {
		createCompany(form.getFieldsValue())
		form.resetFields()
	}

	const cancel = () => {
		form.resetFields()
		onClose()
	}


	return (
		<Drawer
			title="Add new company"
			width={720}
			onClose={onClose}
			open={open}
			styles={{
				body: {
					paddingBottom: 80,
				},
			}}
			extra={
				<Space>
					<Button onClick={cancel}>Cancel</Button>
					<Button loading={isCreating} onClick={addNewCompany} type="primary">
						Submit
					</Button>
				</Space>
			}
		>
			<Form layout="vertical" form={form}>
				<Form.Item
					name="name"
					label="Company Name"
					rules={[{ required: true, message: "Please enter company name" }]}
				>
					<Input placeholder="Company Name" />
				</Form.Item>

				<Form.Item
					name="legalNumber"
					label="Legal Number"
					rules={[{ required: true, message: "Please enter company legal number", type: "number" }]}
				>
					<InputNumber placeholder="legal number" />
				</Form.Item>

				<Form.Item
					name="incorporationCountry"
					label="Incorporation Country"
					rules={[{ required: true, message: "Please enter company Incorporation country" }]}
				>
					<Input placeholder="Incorporation country" />
				</Form.Item>

				<Form.Item
					name="website"
					label="Website"
					rules={[{ required: true, message: "Please enter company website", type: "string", }]}
				>
					<Input placeholder="example.com" />
				</Form.Item>
			</Form>
		</Drawer>
	)
}
