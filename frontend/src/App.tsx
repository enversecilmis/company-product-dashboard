import { Routes, Route } from "react-router-dom"
import LoginPage from './pages/LoginPage.tsx'
import HomePage from './pages/HomePage.tsx'
import CompaniesPage from './pages/CompaniesPage.tsx'
import ProducstPage from './pages/ProductsPage.tsx'
import NotFound from './pages/NotFoundPage.tsx'
import useUser from "./stores/user-store"
import RegisterPage from "./pages/RegisterPage.tsx"
import PageSpinner from "./components/PageSpinner.tsx"
import DevSettingsFloatButton from "./components/DevSettingsFloatButton.tsx"
import LogedInLayout from "./components/LogedInLayout.tsx"




function App() {
	const isCheckingToken = useUser(s => s.isCheckingToken)
	
	if (isCheckingToken)
		return <PageSpinner />

	return (
		<>
			<DevSettingsFloatButton />
			<Routes>
				<Route path="/" element={<LogedInLayout />} >
					<Route index element={<HomePage />} />
					<Route path="companies" element={<CompaniesPage />} />
					<Route path="products" element={<ProducstPage />} />
				</Route>

				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</>
	)
}



export default App
