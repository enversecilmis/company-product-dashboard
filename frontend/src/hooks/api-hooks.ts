import { useMutation, useQuery } from "@tanstack/react-query"
import EteAPI, { CompanyBase, ProductBase } from "../utils/api-utils"
import { queryClient } from "../main"
import { App } from "antd"



const apiHooks = {
	useCompanies: (options:  Parameters<typeof EteAPI.getCompanies>[0]) => {
		return useQuery({
			queryKey: ["companies", options],
			queryFn: () => EteAPI.getCompanies(options),
		})
	},


	useUpdatecompany: (id: string, options?: {
		onSuccess?: () => void
		onError?: (error: Error) => void
	}) => {
		const { message } = App.useApp()
		return useMutation({
			mutationFn: (options: Partial<CompanyBase>) => EteAPI.updateCompany(id, options),
			mutationKey: ["update-company", id],
			onError: (error) => {
				message.error(error.message)
				options?.onError?.(error)
			},
			onSuccess: async () => {
				message.success("Update Successful")
				options?.onSuccess?.()
				queryClient.invalidateQueries({ queryKey: ["companies", "products"] })
			},
		})
	},


	useCreateCompany: (options?: {
		onSuccess?: () => void
		onError?: (error: Error) => void
	}) => {
		const { message } = App.useApp()
		return useMutation({
			mutationFn: EteAPI.createCompany,
			mutationKey: ["create-company"],
			onError: (error) => {
				message.error(error.message)
				options?.onError?.(error)
			},
			onSuccess: () => {
				message.success("Company is created successfully")
				options?.onSuccess?.()
				queryClient.invalidateQueries({ queryKey: ["companies"] })
			},
		})
	},


	useDeleteCompany: (ids: string | string[], options?: {
		onSuccess?: (deletedCount: number) => void
		onError?: (error: Error) => void
	}) => {
		const { message } = App.useApp()
		const result = useMutation({
			mutationFn: EteAPI.deleteManyCompanies,
			mutationKey: ["delete-companies", ids],
			onError: (error) => {
				message.error(error.message)
				options?.onError?.(error)
			},
			onSuccess: (deletedCount) => {
				message.success(`Deleted ${deletedCount} companies`)
				options?.onSuccess?.(deletedCount)
				queryClient.invalidateQueries({ queryKey: ["companies"] })
			},
		})
		return result
	},



	useProducts: (options: Parameters<typeof EteAPI.getProducts>[0]) => {
		return useQuery({
			queryKey: ["products", options],
			queryFn: () => EteAPI.getProducts(options),
		})
	},



	useUpdateProduct: (id: string, options?: {
		onSuccess?: () => void
		onError?: (error: Error) => void
	}) => {
		const { message } = App.useApp()
		const result = useMutation({
			mutationFn: (update: Partial<ProductBase>) => EteAPI.updateProduct(id, update),
			mutationKey: ["update-company", id],
			onError: (error) => {
				message.error(error.message)
				options?.onError?.(error)
			},
			onSuccess: () => {
				message.success("Update Successful")
				options?.onSuccess?.()
				queryClient.invalidateQueries({ queryKey: ["products"] })
			},
		})
		return result
	},


	useCreateProduct: (options?: {
		onSuccess: () => void
		onError: (error: Error) => void
	}) => {
		const { message } = App.useApp()
		return useMutation({
			mutationFn: EteAPI.createProduct,
			mutationKey: ["create-product"],
			onError: (error) => {
				message.error(error.message)
				options?.onError?.(error)
			},
			onSuccess: () => {
				message.success("Product is created successfully")
				options?.onSuccess?.()
				queryClient.invalidateQueries({ queryKey: ["products"] })
			},
		})
	},


	useDeleteProducts: (options?: {
		onSuccess?: (deletedCount: number) => void
		onError?: (error: Error) => void
	}) => {
		const { message } = App.useApp()
		const result = useMutation({
			mutationFn: EteAPI.deleteManyProducts,
			mutationKey: ["delete-products"],
			onError: (error) => {
				message.error(error.message)
				options?.onError?.(error)
			},
			onSuccess: (deletedCount) => {
				message.success("Product is created successfully")
				options?.onSuccess?.(deletedCount)
				queryClient.invalidateQueries({ queryKey: ["products"] })
			},
		})
		return result
	},


	useCompanyCount() {
		return useQuery({
			queryKey: ["company-count"],
			queryFn: EteAPI.getCompanyCount,
		})
	},
	
	
	useProductCount() {
		return useQuery({
			queryKey: ["product-count"],
			queryFn: EteAPI.getProductCount,
		})
	},


	useAllCompanyNames: () => {
		const result = useQuery({
			queryKey: ["company-names"],
			queryFn: EteAPI.getCompanyNames,
		})
		return result
	},


	useCountries: () => {
		return useQuery({
			queryKey: ["countries"],
			queryFn: EteAPI.getCountries,
		})
	}
}





export default apiHooks
