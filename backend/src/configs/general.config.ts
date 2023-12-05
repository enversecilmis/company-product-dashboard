import { readFileSync } from "fs"

export const MAX_PAGE_SIZE = 20
export const PORT = 3001
export const CLIENT_URL = "http://localhost:5173"
export const JWT_KEY = readFileSync("./private.key")