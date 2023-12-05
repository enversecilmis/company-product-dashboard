import { RequestHandler } from "express";
import services from "../services/services";


type GetQueryParams = {
	sort?: string
	page?: string
	pageSize?: string
	name?: string
	username?: string

	createdAt?: string
	createdAtLt?: string
	createdAtGt?: string
	updatedAt?: string
	updatedAtLt?: string
	updatedAtGt?: string
}




const get: RequestHandler = async (req, res) => {
	const { page, pageSize, sort, name, username, createdAt, createdAtGt, createdAtLt, updatedAt, updatedAtGt, updatedAtLt } = req.query  as GetQueryParams

	const { users, totalCount } = await services.user.getMany({
		page: page ? +page : 1,
		pageSize: pageSize ? parseInt(pageSize) : undefined, 
		sort,
		filters: {
			name,
			username,
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

	return res.status(200).json({ users, totalCount })
}



const getById: RequestHandler = async (req, res) => {
	const id = req.params.userId
	const user = await services.user.get(id)

	if (!user)
		return res.status(404).json({ error: "User doesn't exist" })

	return res.status(200).json(user)
}



const getCount: RequestHandler = async (req, res) => {
	const count = await services.user.getCount()
	res.status(200).json({ count })
}



const post: RequestHandler = async (req, res) => {
	const { name, username, password } = req.body

	if (!username || !password || !name)
		return res.status(400).json({ error: "name, username and password are required" })

	const userExists = await services.user.exists(username)
	if (userExists)
		return res.status(409).send({ error: "username already exists" })

	const user = await services.user.create({ name, username, password })
	
	return res.status(200).json(user)
}



const put: RequestHandler = async (req, res) => {
	const { userId } = req.params
	const update = req.body

	const user = await services.user.update(userId, update)

	if (!user)
		return res.status(404).json({ error: "User doesn't exist" })

	return res.status(200).json(user)
}



const remove: RequestHandler = async (req, res) => {
	const { userId } = req.params

	const deleted = await services.user.delete(userId)

	if (!deleted)
		return res.status(404).json({ error: "User doesn't exist" })

	res.status(200).json(deleted)
}






const userControllers = {
	get,
	getById,
	getCount,
	post,
	put,
	delete: remove,
}


export default userControllers


