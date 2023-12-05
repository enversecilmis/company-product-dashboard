import { MAX_PAGE_SIZE } from "../configs/general.config";
import Product, { ProductType } from "../models/products.model";
import clearUndefinedFields from "../utils/clearUndefinedFields";
import { Optional } from "../utils/type-utils"



type GetManyOptions = {
	page: number
	pageSize?: number
	sort?: string
	filters?: {
		name?: string
		company?: string | string[]
		category?: string | string[]
		amountUnit?: string | string[]
		amount?: {
			$eq?: number
			$lt?: number
			$gt?: number
		}
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




const productsService = {
	async get(id: string) {
		const product = await Product.findById(id)
		return product
	},



	async getMany({ page, pageSize, filters, sort }: GetManyOptions) {
		const _filters = clearUndefinedFields({
			...filters,
			name: filters?.name ? { $regex: `^${filters.name}` } : undefined
		})
		const _page = page > 0 ? page : 1
		const _pageSize = pageSize && pageSize > 0 ? pageSize : MAX_PAGE_SIZE
		const skip = (_page - 1) * _pageSize
		const query = Product.find(_filters)
		
		if (sort) {
			query.sort(sort)
		}
		
		const [products, totalCount] = await Promise.all([
			query.limit(_pageSize).skip(skip).exec(),
			Product.find(_filters).countDocuments(),
		])

		return { products, totalCount }
	},


	async getCount() {
		const count = await Product.countDocuments()
		return count
	},


	async create(productData: Optional<ProductType, "createdAt" | "updatedAt">) {
		const createdProduct = await Product.create(productData)
		return createdProduct
	},



	async update(id: string, updatedData: Partial<ProductType>) {
		const updatedProduct = await Product.findByIdAndUpdate(id, updatedData)
		return updatedProduct
	},



	async delete(ids: string | string[]) {
		const { deletedCount } = await Product.deleteMany({ _id: ids })
		return deletedCount
	},
}



export default productsService
