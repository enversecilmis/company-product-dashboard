import { Layout } from 'antd'
import Header from './Header'
import { Navigate, Outlet } from 'react-router-dom'
import useUser from '../stores/user-store'



export default function LogedInLayout() {
	const isLogedIn = useUser(s => s.isLogedIn)

	if (!isLogedIn)
		return <Navigate to="/login" replace />

	return (
		<Layout className="h-full">
			<Layout.Header className="">
				<Header />
			</Layout.Header>
			<Layout.Content>
				<Outlet />
			</Layout.Content>
		</Layout>
	)
}
