import { RequestHandler } from "express";
import services from "../services/services";


type GetQuery = {
	page?: string
	pageSize?: string
	sort?: string
	name?: string | string[]
	legalNumber?: string
	country?: string | string[]
	createdAt?: string
	createdAtLt?: string
	createdAtGt?: string
	updatedAt?: string
	updatedAtLt?: string
	updatedAtGt?: string
}




const get: RequestHandler = async (req, res) => {
	const { page, pageSize, sort, name, legalNumber, country, createdAt, createdAtGt, createdAtLt, updatedAt, updatedAtGt, updatedAtLt } = req.query  as GetQuery

	const { companies, totalCount } = await services.company.getMany({
		page: page ? +page : 1,
		pageSize: pageSize ? parseInt(pageSize) : undefined, 
		sort,

		filters: {
			name: name,
			incorporationCountry: country, 
			legalNumber: legalNumber ? parseInt(legalNumber) : undefined,
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
		}
	})

	return res.status(200).json({ companies, totalCount })
}



const getById: RequestHandler = async (req, res) => {
	const id = req.params.companyId
	const company = await services.company.get(id)

	if (!company)
		return res.status(404).json({ error: "Company doesn't exist" })

	return res.status(200).json(company)
}



const getCount: RequestHandler = async (req, res) => {
	const count = await services.company.getCount()
	res.status(200).json({ count })
}



const post: RequestHandler = async (req, res) => {
	const { name, legalNumber, incorporationCountry, website } = req.body

	if (!name || !legalNumber || !incorporationCountry || !website)
		return res.status(400).json({ error: "Invalid parameters" })

	const company = await services.company.create({ name, legalNumber, incorporationCountry, website })
	return res.status(200).json(company)
}



const put: RequestHandler = async (req, res) => {
	const { companyId } = req.params
	const update = req.body

	const company = await services.company.update(companyId, update)

	if (!company)
		return res.status(404).json({ error: "Company doesn't exist" })

	return res.status(200).json(company)
}



const remove: RequestHandler = async (req, res) => {
	const { ids } = req.body

	const deletedCount = await services.company.delete(ids)
	if (deletedCount === 0)
		return res.status(404).json({ error: "No company exists with the given ids" })

	return res.status(200).json({ deletedCount })
}




const companyControllers = {
	get,
	getById,
	getCount,
	post,
	put,
	delete: remove,
}


export default companyControllers
