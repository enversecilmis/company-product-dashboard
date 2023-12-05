import { Routes, Route } from "react-router-dom"
import LoginPage from './pages/LoginPage.tsx'
import HomePage from './pages/HomePage.tsx'
import CompaniesPage from './pages/CompaniesPage.tsx'
import ProducstPage from './pages/ProductsPage.tsx'
import NotFound from './pages/NotFoundPage.tsx'
import useUser from "./stores/user-store"
import Header from "./components/Header.tsx"
import RegisterPage from "./pages/RegisterPage.tsx"
import { Layout } from "antd"
import PageSpinner from "./components/PageSpinner.tsx"
import DevSettingsFloatButton from "./components/DevSettingsFloatButton.tsx"


const LogedInRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/companies" element={<CompaniesPage />} />
			<Route path="/products" element={<ProducstPage />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	)
}


const LogedOutRoutes = () => {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="*" element={<NotFound redirectTo="/login" />} />
		</Routes>
	)
}



export default function App() {
	const isLogedIn = useUser(s => s.isLogedIn)
	const isCheckingToken = useUser(s => s.isCheckingToken)

	// if (isCheckingToken)
	// 	return <PageSpinner />
	
	// if (!isLogedIn)
	// 	return <LogedOutRoutes />


	return (
		<>
			<DevSettingsFloatButton />
		{
			isCheckingToken ? <PageSpinner /> :
			!isLogedIn ? <LogedOutRoutes /> :

			<Layout className="h-full">
				<Layout.Header className="">
					<Header />
				</Layout.Header>
				<Layout.Content>
					<LogedInRoutes />
				</Layout.Content>
			</Layout>
		}
		</>
	)
}
