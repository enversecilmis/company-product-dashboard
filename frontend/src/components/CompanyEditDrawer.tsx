import { useState, useEffect } from "react"
import { App, Button, Drawer, Form, Input, InputNumber, Space } from "antd"
import EteAPI, { Company } from "../utils/api-utils"
import { queryClient } from "../main"


type Props = {
	open: boolean
	onClose: () => void
	company?: Company
}

export default function CompanyEditDrawer({ open, onClose, company }: Props) {
	const [form] = Form.useForm()
	const { message } = App.useApp()
	const [isEditing, setIsEditing] = useState(false)

	
	useEffect(() => {
		if (!company)
			return
		const { name, incorporationCountry, legalNumber, website } = company
		form.setFieldsValue({ name, incorporationCountry, legalNumber, website })
	}, [company, form])

	const editCompany = async () => {
		if (!company)
			return

		const values = form.getFieldsValue()
		setIsEditing(true)

		try {
			await EteAPI.updateCompany(company._id, values)
			message.success("Company successfully edited")
			queryClient.invalidateQueries({ queryKey: ["companies"] })
			onClose()
		}
		catch (err) {
			if (err instanceof Error)
				message.error(err.message)
		}
		finally {
			setIsEditing(false)
		}
	}


	const cancel = () => {
		onClose()
	}


	return (
		<Drawer
        title="Edit company"
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
            <Button loading={isEditing} onClick={editCompany} type="primary">
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


