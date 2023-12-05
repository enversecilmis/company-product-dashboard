import { Alert, Button, Flex, Form, Input } from "antd"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useUser from "../stores/user-store"
import { LockOutlined, UserOutlined } from "@ant-design/icons"


type FieldType = {
	name: string
  username: string
  password: string
}


export default function RegisterPage() {
	const register = useUser(s => s.register)
	const navigate = useNavigate()

	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")


	const handleRegister = ({ name, username, password }: FieldType) => {
		setIsLoading(true)

		register(name, username, password)
		.then(() => navigate("/", { replace: true }))
		.catch(err => setErrorMessage(err.message))
		.finally(() => setIsLoading(false))
	}


	return (
		<Flex justify="center" align="center" className="h-full">
			<Flex vertical gap={24} className="w-80">
				{errorMessage && <Alert type="error" message={errorMessage} />}
				<Form
					name="basic"
					style={{ maxWidth: 600 }}
					onFinish={handleRegister}
					autoComplete="off"
					validateTrigger="onBlur"
					onValuesChange={() => setErrorMessage("")}
				>
					<Form.Item<FieldType>
						name="name"
						rules={[{ required: true, min: 2, message: 'Name should be at least 2 characters' }]}
					>
						<Input placeholder="Name" prefix={<UserOutlined className="site-form-item-icon" />} />
					</Form.Item>
					<Form.Item<FieldType>
						name="username"
						rules={[{ required: true, message: 'Please input your username!' }]}
					>
						<Input placeholder="Username" prefix={<UserOutlined className="site-form-item-icon" />} />
					</Form.Item>

					<Form.Item<FieldType>
						name="password"
						rules={[{ required: true, message: 'Please input your password!' }]}
					>
						<Input.Password placeholder="Password" prefix={<LockOutlined className="site-form-item-icon" />} />
					</Form.Item>

					<Form.Item>
						<Button loading={isLoading} className="w-full" type="primary" htmlType="submit">
							Register
						</Button>
						<div>or <Link to="/login">Login</Link></div>
					</Form.Item>
				</Form>
			</Flex>
		</Flex>
	)
}
