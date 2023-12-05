import { UserTokenData } from "../utils/jwt"

declare global {
	namespace Express {
		interface Request {
			userTokenData: UserTokenData
			cookies: {
				token?: string
			}
		}
	}
}