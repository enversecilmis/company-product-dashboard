import { MAX_PAGE_SIZE } from "../configs/general.config";
import Company, { CompanyType } from "../models/companies.model";
import clearUndefinedFields from "../utils/clearUndefinedFields";
import { Optional } from "../utils/type-utils"
import services from "./services";



type GetManyOptions = {
	page: number
	pageSize?: number
	sort?: string
	filters?: {
		name?: string | string[]
		incorporationCountry?: string | string[]
		legalNumber?: number | number[]
		createdAt?: {
			$eq?: Date
			$gt?: Date
			$lt?: Date
		}
		updatedAt?: {
			$eq?: Date
			$gt?: Date
			$lt?: Date
		}
	}
}



const companiesService = {
	async get(id: string) {
		const company = await Company.findById(id)
		return company
	},


	async getMany({ page, pageSize, filters, sort }: GetManyOptions) {
		const _filters = clearUndefinedFields({
			...filters,
			name: filters?.name ? { $regex: `^${filters.name}` } : undefined,
		})
		const _page = page > 0 ? page : 1
		const _pageSize = pageSize && pageSize > 0 ? pageSize : MAX_PAGE_SIZE
		const skip = (_page - 1) * _pageSize

		const query = Company.find(_filters)
		
		if (sort) {
			query.sort(sort)
		}
		
		const [companies, totalCount] = await Promise.all([
			query.limit(_pageSize).skip(skip).exec(),
			Company.find(_filters).countDocuments(),
		])

		return { companies, totalCount }
	},


	async getAllNames() {
		const names = await Company.find().select("name")
		return names
	},


	async getCount() {
		const count = await Company.countDocuments()
		return count
	},


	async create(companyData: Optional<CompanyType, "createdAt" | "updatedAt">) {
		const createdCompany = await Company.create(companyData)
		return createdCompany
	},



	async update(id: string, updatedData: Partial<CompanyType>) {
		const updatedCompany = await Company.findByIdAndUpdate(id, updatedData)
		return updatedCompany
	},


	async delete(ids: string[]) {
		const [{ deletedCount: deletedCompanies }, deletedProducts] = await Promise.all([
			Company.deleteMany({ _id: ids }),
			services.product.deleteByCompany(ids),
		])

		return deletedCompanies
	},


	async getAllCountries() {
		const result = await Company.find().sort("incorporationCountry").select("incorporationCountry")
		const countries = result.map(c => c.incorporationCountry).filter((c, i, arr) => arr.indexOf(c) === i)
		return countries
	},
}


export default companiesService
