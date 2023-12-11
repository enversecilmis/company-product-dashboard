import { useEffect } from "react"
import { Button, Drawer, Form, Input, InputNumber, Space } from "antd"
import { Company } from "../utils/api-utils"
import apiHooks from "../hooks/api-hooks"


type Props = {
	open: boolean
	onClose: () => void
	company?: Company
}

export default function CompanyEditDrawer({ open, onClose, company }: Props) {
	const [form] = Form.useForm()

	const {
		mutate: updateCompany,
		isPending: isUpdating,
	} = apiHooks.useUpdatecompany(company?._id ?? "", {
		onSuccess: () => {
			form.resetFields()
			onClose()
		},
	})

	
	useEffect(() => {
		if (!company)
			return

		form.setFieldsValue(company)
	}, [company, form])
	

	const update = async () => {
		updateCompany(form.getFieldsValue())
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
            <Button onClick={onClose}>Cancel</Button>
            <Button loading={isUpdating} onClick={update} type="primary">
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


