import { LogoutOutlined, MenuOutlined } from "@ant-design/icons"
import { Button, Divider, Dropdown, Flex, Menu, Typography } from "antd"
import { Link, useLocation, useNavigate } from "react-router-dom"
import useUser from "../stores/user-store"
import { useState } from "react"


export default function Header() {
	const { name, logout } = useUser()
	const navigate = useNavigate()
	const location = useLocation()
	const [isLogoutLoading, setIsLogoutLoading] = useState(false)

	const handleLogout = () => {
		setIsLogoutLoading(true)
		logout()
		.then(() => navigate("/login"))
		.finally(() => setIsLogoutLoading(false))
	}


	return (
		<Flex justify="space-between" align="center">
			<Menu
				theme="dark"
				mode="horizontal"
				className="font-medium"
				selectedKeys={[location.pathname]}
				items={[
					{ label: <Link to="/">Home</Link>, key: "/" },
					{ label: <Link to="/companies">Companies</Link>, key: "/companies" },
					{ label: <Link to="/products">Products</Link>, key: "/products" },
				]}
			/>

			<Flex align="center" gap={10} className="hidden md:block">
				<span className="text-sky-600 text-base leading-none">{name.toUpperCase()}</span>
				<Divider type="vertical" className="bg-slate-500" />
				<Button
					loading={isLogoutLoading}
					icon={<LogoutOutlined />}
					type="default"
					onClick={handleLogout}
				>
					Logout
				</Button>
			</Flex>

			<Dropdown
				className="md:hidden"
				trigger={["click"]}
				menu={{
					theme: "dark",
					items: [{ key: 0, label: "logout", onClick: handleLogout }]
				}}
				>
					<MenuOutlined className="text-slate-200 text-lg" />
			</Dropdown>
		</Flex>
	)
}
