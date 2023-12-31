import { useState } from "react"
import { App, Button, Col, Drawer, Form, Input, InputNumber, Row, Select, Space } from "antd";
import EteAPI from "../utils/api-utils";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../main";


type Props = {
	open: boolean
	onClose: () => void
}

export default function CreateProductDrawer({ open, onClose }: Props) {
	const [form] = Form.useForm()
	const { message } = App.useApp()
	const [isAdding, setIsAdding] = useState(false)

	const { data, isLoading } = useQuery({
		queryKey: ["companies"],
		queryFn: () => EteAPI.getCompanies({}),
	})

	const companies = data?.companies



	const addNewProduct = async () => {
		const values = form.getFieldsValue()
		setIsAdding(true)

		try {
			await EteAPI.createProduct(values)
			message.success("Product successfully added")
			form.resetFields()
			queryClient.invalidateQueries({ queryKey: ["products"] })
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
        title="Add new product"
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
            <Button loading={isAdding} onClick={addNewProduct} type="primary">
              Submit
            </Button>
          </Space>
        }
      >
				<Form layout="vertical" form={form}>
					<Form.Item
						name="name"
						label="Product Name"
						rules={[{ required: true, message: "Please enter product name" }]}
					>
						<Input placeholder="Product Name" />
					</Form.Item>

					<Form.Item
						name="category"
						label="Category"
						rules={[{ required: true, message: "Please enter product category" }]}
					>
						<Input placeholder="Category" />
					</Form.Item>


					<Row gutter={40}>
						<Col span={12}>
							<Form.Item
								name="amount"
								label="Amount"
								rules={[{ required: true, message: "Please enter the amount" }]}
							>
								<InputNumber className="w-full" placeholder="Amount" />
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item
								name="amountUnit"
								label="Amount Unit"
								rules={[{ required: true, message: "Please enter amount unit" }]}
							>
								<Input placeholder="e.g: kilograms, meters" />
							</Form.Item>
						</Col>
					</Row>

					
					<Form.Item
						name="company"
						label="Company"
						rules={[{ required: true, message: "Please select a company" }]}
					>
						<Select loading={isLoading} placeholder="Please select company">
							{companies?.map(company => (
								<Select.Option key={company._id} value={company._id}>{company.name}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Drawer>
	)
}
