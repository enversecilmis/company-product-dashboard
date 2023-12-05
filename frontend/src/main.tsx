import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { App as AntApp } from "antd"


export const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<AntApp className="h-full">
					<App />
				</AntApp>
			</QueryClientProvider>
		</BrowserRouter>
  </React.StrictMode>,
)
