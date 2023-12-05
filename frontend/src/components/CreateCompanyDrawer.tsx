import { useState } from "react"
import { App, Button, Drawer, Form, Input, InputNumber, Space } from "antd";
import EteAPI from "../utils/api-utils";
import { queryClient } from "../main";


type Props = {
	open: boolean
	onClose: () => void
}

export default function CreateCompanyDrawer({ open, onClose }: Props) {
	const [form] = Form.useForm()
	const { message } = App.useApp()
	const [isAdding, setIsAdding] = useState(false)


	const addNewCompany = async () => {
		const values = form.getFieldsValue()
		setIsAdding(true)

		try {
			await EteAPI.createCompany(values)
			message.success("Company successfully added")
			form.resetFields()
			queryClient.invalidateQueries({ queryKey: ["companies"] })
			onClose()
		}
		catch (err) {
			if (err instanceof Error)
				message.error(err.message)
		}
		finally {
			setIsAdding(false)
		}
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
            <Button loading={isAdding} onClick={addNewCompany} type="primary">
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
						rules={[{ required: true, message: "Please enter company legal number" }]}
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
