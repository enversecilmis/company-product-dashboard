import { RequestHandler } from "express";
import services from "../services/services";


type GetQueryParams = {
	sort?: string
	page?: string
	pageSize?: string
	name?: string
	companyId?: string | string[]
	category?: string | string[]
	amountUnit?: string | string[]
	amount?: string
	amountLt?: string
	amountGt?: string

	createdAt?: string
	createdAtLt?: string
	createdAtGt?: string
	updatedAt?: string
	updatedAtLt?: string
	updatedAtGt?: string
}




const get: RequestHandler = async (req, res) => {
	const { page, pageSize, sort, name, amount, amountGt, amountLt, amountUnit, category, companyId,  createdAt, createdAtGt, createdAtLt, updatedAt, updatedAtGt, updatedAtLt } = req.query  as GetQueryParams

	const { products, totalCount } = await services.product.getMany({
		page: page ? +page : 1,
		pageSize: pageSize ? parseInt(pageSize) : undefined, 
		sort,
		filters: {
			name,
			amountUnit,
			category,
			company: companyId,
			createdAt: {
				$eq: createdAt ? new Date(createdAt) : undefined,
				$gt: createdAtGt ? new Date(createdAtGt) : undefined,
				$lt: createdAtLt ? new Date(createdAtLt) : undefined,
			},
			updatedAt: {
				$eq: updatedAt ? new Date(updatedAt) : undefined,
				$gt: updatedAtGt ? new Date(updatedAtGt) : undefined,
				$lt: updatedAtLt ? new Date(updatedAtLt) : undefined,
			},
			amount: {
				$eq: amount ? parseInt(amount) : undefined,
				$gt: amountGt ? parseInt(amountGt) : undefined,
				$lt: amountLt ? parseInt(amountLt) : undefined,
			},
		}
	})

	return res.status(200).json({ products, totalCount })
}



const getById: RequestHandler = async (req, res) => {
	const id = req.params.productId
	const product = await services.product.get(id)

	if (!product)
		return res.status(404).json({ error: "Company doesn't exist" })

	return res.status(200).json(product)
}



const getCount: RequestHandler = async (req, res) => {
	const count = await services.product.getCount()
	res.status(200).json({ count })
}



const post: RequestHandler = async (req, res) => {
	const { name, category, amount, amountUnit, companyId } = req.body

	if (!name || !category || !amount || !amountUnit || !companyId)
		return res.status(400).json({ error: "Invalid parameters" })

	const company = await services.company.get(companyId)
	if (!company)
		return res.status(404).json({ error: "Company doesn't exist" })

	const product = await services.product.create({ name, category, amount, amountUnit, company })

	return res.status(200).json(product)
}



const put: RequestHandler = async (req, res) => {
	const { productId } = req.params
	const update = req.body

	const product = await services.product.update(productId, update)

	if (!product)
		return res.status(404).json({ error: "Product doesn't exist" })

	return res.status(200).json(product)
}



const remove: RequestHandler = async (req, res) => {
	const { ids } = req.body

	const deletedCount = await services.product.delete(ids)

	if (deletedCount === 0)
		return res.status(404).json({ error: "No product exists with the given ids" })

	return res.status(200).json(deletedCount)
}






const productsControllers = {
	get,
	getById,
	getCount,
	post,
	put,
	delete: remove,
}


export default productsControllers
