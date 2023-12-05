import { RequestHandler } from "express";
import jwt from "../utils/jwt";


const cookieJwtAuth: RequestHandler = (req, res, next) => {
	const token = req.cookies.token
	try {
		const userTokenData = jwt.verify(token)
		req.userTokenData = userTokenData
		next()
	}
	catch (err) {
		res.clearCookie("token")
		return res.status(401).json({ error: "Unauthorized" })
	}
}


export default cookieJwtAuth