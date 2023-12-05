import { Alert, Button, Flex, Form, Input } from "antd"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useUser from "../stores/user-store"
import { LockOutlined, UserOutlined } from "@ant-design/icons";

type FieldType = {
  username: string;
  password: string;
};


export default function LoginPage() {
	const login = useUser(s => s.login)
	const navigate = useNavigate()
	const [form] = Form.useForm()

	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")


	const handleLogin = async ({ username, password }: FieldType) => {
		setIsLoading(true)
		setErrorMessage("")

		login(username, password)
		.then(() => navigate("/", { replace: true }))
		.catch(err => setErrorMessage(err.message))
		.finally(() => setIsLoading(false))
	}


	return (
		<Flex justify="center" align="center" className="h-full">
			<Flex vertical gap={24} className="w-80">
				{errorMessage && <Alert type="error" message={errorMessage} />}
				<Form
					form={form}
					name="basic"
					style={{ maxWidth: 600 }}
					onFinish={handleLogin}
					onValuesChange={() => setErrorMessage("")}
					autoComplete="off"
				>
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
							Login
						</Button>
						<div>or <Link to="/register">Create an account</Link></div>
					</Form.Item>
				</Form>
			</Flex>
		</Flex>
	)
}
