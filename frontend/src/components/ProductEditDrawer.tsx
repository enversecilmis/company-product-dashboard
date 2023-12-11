import { useEffect } from "react"
import { Button, Col, Drawer, Form, Input, InputNumber, Row, Select, Space } from "antd"
import { Product } from "../utils/api-utils"
import apiHooks from "../hooks/api-hooks"


type Props = {
	open: boolean
	onClose: () => void
	product?: Product
}

export default function ProductEditDrawer({ open, onClose, product }: Props) {
	const [form] = Form.useForm()

	const {
		mutate: updateProduct,
		isPending: isUpdating,
	} = apiHooks.useUpdateProduct(product?._id ?? "", {
		onSuccess: () => {
			form.resetFields()
			onClose()
		},
	})
	
	const { data: companyNames, isLoading: isLoadingCompanyNames } = apiHooks.useAllCompanyNames()

	useEffect(() => {
		if (!product)
			return

		const { company, ...rest } = product
		form.setFieldsValue({ company: company._id, ...rest })
	}, [product, form])
	
	
	const update = () => {
		updateProduct(form.getFieldsValue())
	}


	return (
		<Drawer
        title="Edit product"
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
            <Button
							type="primary"
							loading={isUpdating}
							onClick={update}
						>
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
								rules={[{ required: true, message: "Please enter the amount", type: "number" }]}
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
						<Select loading={isLoadingCompanyNames} placeholder="Please select company">
							{companyNames?.map(({ name, _id }) => (
								<Select.Option key={_id} value={_id}>{name}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
				
				
			</Drawer>
	)
}


