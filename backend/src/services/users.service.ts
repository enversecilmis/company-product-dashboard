import argon2 from "argon2";
import { MAX_PAGE_SIZE } from "../configs/general.config";
import User, { UserType } from "../models/users.model";
import { Optional } from "../utils/type-utils"



type GetManyOptions = {
	page: number
	pageSize?: number
	filters?: {
		name?: string
		username?: string
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
	sort?: string
}




const usersService = {
	async get(id: string) {
		const user = await User.findById(id)
		return user
	},

	async getByUsername(username: string) {
		const user = await User.findOne({ username })
		return user
	},


	async getMany({ page, pageSize, filters, sort }: GetManyOptions) {
		const _filters = {
			...filters,
			name: filters?.name ? { $regex: `^${filters.name}` } : undefined,
			username: filters?.username ? { $regex: `^${filters.username}` } : undefined,
		}
		const _page = page > 0 ? page : 1
		const _pageSize = pageSize && pageSize > 0 ? pageSize : MAX_PAGE_SIZE
		const skip = (_page - 1) * _pageSize

		const query = User.find(_filters)
		
		if (sort) {
			query.sort(sort)
		}
		
		const [users, totalCount] = await Promise.all([
			query.limit(_pageSize).skip(skip).exec(),
			User.find(_filters).countDocuments(),
		])

		return { users, totalCount }
	},


	async getCount() {
		const count = await User.countDocuments()
		return count
	},


	async create(userData: Omit<Optional<UserType, "createdAt" | "updatedAt">, "passwordHash"> & { password: string }) {
		const { name, username, password } = userData
		const passwordHash = await argon2.hash(password)
		const createdUser = await User.create({ name, username, passwordHash })
		return createdUser
	},



	async update(id: string, updatedData: Partial<UserType>) {
		const updatedUser = await User.findByIdAndUpdate(id, updatedData)
		return updatedUser
	},



	async delete(id: string) {
		const deletedUser = await User.findByIdAndDelete(id)
		return deletedUser
	},



	async exists(username: string) {
		const user = await User.findOne({ username })
		return user ? true : false
	},


	async verify(username: string, password: string) {
		const user = await User.findOne({ username })
		if (!user)
			return

		const verified = await argon2.verify(user.passwordHash, password)
		if (!verified)
			return

		return user
	}
}



export default usersService
