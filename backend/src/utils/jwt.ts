import { JWT_KEY } from "../configs/general.config"
import jsonwebtoken from "jsonwebtoken"

export type UserTokenData = {
	id: string
	username: string
	name: string
}

const jwt = {
	sign: (tokenData: UserTokenData) => {
		return jsonwebtoken.sign(tokenData, JWT_KEY, { expiresIn: "1h", algorithm: "RS256" })
	},
	
	verify: (token: string) => {
		return jsonwebtoken.verify(token, JWT_KEY) as UserTokenData
	},
}

export default jwt
