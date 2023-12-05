import { RequestHandler } from "express";
import services from "../services/services";
import jwt, { UserTokenData } from "../utils/jwt";


type RegisterBody = {
	name?: string
	username?: string
	password?: string
}




const register: RequestHandler = async (req, res) => {
	// Validate inputs
	const { name, username, password } = req.body as RegisterBody
	if (!username || !password || !name)
		return res.status(400).json({ error: "name, username and password are required" })

	const existingUser = await services.user.exists(username)
	if (existingUser)
		return res.status(409).send({ error: "username already exists" })

	const user = await services.user.create({ name, username, password })

	const userTokenData: UserTokenData = {
		id: user.id,
		name: user.name,
		username: user.username,
	}

	res.cookie("token", jwt.sign(userTokenData), {
		httpOnly: true,
	})

	return res.status(200).json({ name: user.name, username: user.username })
}




const login: RequestHandler = async (req, res) => {
	const { username, password } = req.body
	if (!username || !password)
		return res.status(400).json({ error: "username and password are required" })

	const user = await services.user.verify(username, password)
	if (!user)
		return res.status(409).json({ error: "invalid credentials" })

	const userTokenData: UserTokenData = {
		id: user.id,
		name: user.name,
		username: user.username,
	}

	res.cookie("token", jwt.sign(userTokenData), {
		httpOnly: true,
	})
	
	return res.status(200).json({ name: user.name, username: user.username })
}



// It will be checked in the middleware
const checkAuth: RequestHandler = async (req, res) => {
	const { name, username } = req.userTokenData
	return res.status(200).json({ name, username })
}



const logout: RequestHandler = async (req, res) => {
	res.clearCookie("token")
	return res.status(200).json({ message: "Logout successfull" })
}




const authControllers = {
	register,
	login,
	checkAuth,
	logout,
}

export default authControllers
