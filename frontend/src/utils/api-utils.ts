import { SERVER_URL } from "../config";
import parseQueryParams from "./parseQueryParams";
import wait from "./wait";


export type UserData = {
	id:  string
	name: string
	username: string
}


export type CompanyBase = {
	name: string
	legalNumber: number
	incorporationCountry: string
	website: string
}

export type Company = CompanyBase & {
	_id: string
	createdAt: string
	updatedAt: string
}


export type ProductBase = {
	name: string
	category: string
	amount: number
	amountUnit: string
	company: Company
}

export type Product = ProductBase & {
	_id: string
	createdAt: string
	updatedAt: string
}



/**
 * Abstraction to easily interface with the API.
 */
export default class EteAPI {
	private static readonly baseUrl = SERVER_URL


	// ***** settings to easily see error and loading states *****
	static protectedRoutes = ["login", "logout", "register", "check-auth"]
	static throwError = false
	static apiDelay = 1000
	static delayEnabled = false
	// ***********************************************************


	// Custom fetch for redundant stuff
	private static customFetch = async <T>(relativePath: string, init?: RequestInit): Promise<T> => {
		// ***** settings to easily see error and loading states *****
		if (this.delayEnabled)
			await wait(this.apiDelay)

		if (this.throwError && !this.protectedRoutes.includes(relativePath))
			throw new Error("Something went wrong ¯\\_(ツ)_/¯")
		// ***********************************************************


		try {
			const res = await fetch(`${this.baseUrl}/${relativePath}`, init)
			const data = await res.json()

			if (data.error)
				throw new Error(data.error)
	
			return data as T

		} catch (err) {
			if (err instanceof Error)
				throw err
			else
				throw new Error("Something went wrong ¯\\_(ツ)_/¯")
		}
	}



	static getCompanyNames = async () => {
		const companyNames = await this.customFetch<{ name: string, _id: string }[]>("company-names", { credentials: "include" })
		return companyNames
	}


	static getCompanies = async (options?: {
		page?: number
		pageSize?: number
		sort?: string
		name?: string | string[]
		legalNumber?: number | number[]
		country?: string | string[]
		createdAt?: string | string[]
		createdAtLt?: string
		createdAtGt?: string
		updatedAt?: string
		updatedAtLt?: string
		updatedAtGt?: string
	}) => {
		const query = parseQueryParams(options)
		const result = await this.customFetch<{ companies: Company[], totalCount: number }>(`companies?${query}`, {
			credentials: "include",
		})
		return result
	}


	static getProducts = async (options: {
		sort?: string
		page?: number
		pageSize?: number
		name?: string | string[]
		companyId?: string | string[]
		category?: string | string[]
		amountUnit?: string | string[]
		amount?: number
		amountLt?: number
		amountGt?: number
		createdAt?: string
		createdAtLt?: string
		createdAtGt?: string
		updatedAt?: string
		updatedAtLt?: string
		updatedAtGt?: string
	}) => {
		const query = parseQueryParams(options)
		const result = await this.customFetch<{ products: Product[], totalCount: number }>(`products?${query}`, {
			credentials: "include",
		})
		return result
	}


	static getCompany = async (id: string) => {
		const company = await this.customFetch<Company>(`companies/${id}`)
		return company
	}


	static getProduct = async (id: string) => {
		const product = await this.customFetch<Product>(`products/${id}`)
		return product
	}


	static getCompanyCount = async () => {
		const { count } = await this.customFetch<{ count: number }>("companies/count", { credentials: "include" })
		return count
	}


	static getProductCount = async () => {
		const { count } = await this.customFetch<{ count: number }>("products/count", { credentials: "include" })
		return count
	}


	static createCompany = async (payload: CompanyBase) => {
		const createdCompany = await this.customFetch("companies", {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload)			
		})
		return createdCompany
	}


	static createProduct = async (payload: Omit<ProductBase, "company"> & { company: string }) => {
		const createdProduct = await this.customFetch("products", {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload)			
		})
		return createdProduct
	}


	static updateCompany = async (companyId: string, update: Partial<CompanyBase>) => {
		const updated = await this.customFetch(`companies/${companyId}`, {
			method: "put",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(update)
		})
		return updated
	}


	static updateProduct = async (productId: string, update: Partial<ProductBase>) => {
		const updated = await this.customFetch(`products/${productId}`, {
			method: "put",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(update)
		})
		return updated
	}



	static deleteCompany = async (id: string) => {
		const { deletedCount } = await this.customFetch<{ deletedCount: number }>("companies", {
			method: "delete",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ids: [id] })
		})

		return deletedCount
	}


	static deleteProduct = async (id: string) => {
		const deleted = await this.customFetch(`products/${id}`, {
			method: "delete",
			credentials: "include",
		})
		return deleted
	}


	static deleteManyCompanies = async (ids: string[]) => {
		const { deletedCount } = await this.customFetch<{ deletedCount: number }>("companies", {
			method: "delete",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ids })
		})
		return deletedCount
	}


	static deleteManyProducts = async (ids: string[]) => {
		const deletedCount = await this.customFetch<number>("products", {
			method: "delete",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ids })
		})
	return deletedCount
	}


	static getCountries = async () => {
		const countries = await this.customFetch<string[]>("companies/countries", {
			credentials: "include",
		})
		return countries
	}
	
	
	static getCategories = async () => {
		const categories = await this.customFetch<string[]>("products/categories", {
			credentials: "include",
		})
		return categories
	}


	static register = async (name: string, username: string, password: string) => {
		const userData = await this.customFetch<UserData>("register", {
			method: "post",
			body: JSON.stringify({ name, username, password }),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
		return userData
	}

	static login = async (username: string, password: string) => {
		const userData = await this.customFetch<UserData>("login", {
			method: "POST",
			body: JSON.stringify({ username, password }),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
		return userData
	}


	static logout = async () => {
		const result = await this.customFetch("logout", { credentials: "include", method: "post" })
		return result
	}


	static checkAuth = async () => {
		const userData = await this.customFetch<UserData>("check-auth", { credentials: "include" })
		return userData
	}
}

