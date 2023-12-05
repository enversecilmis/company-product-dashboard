import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import bodyParser from "body-parser"
import argon2 from "argon2"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { mockCompanies, mockProductsWithoutCompany } from "./mock/mock"
import routes from "./routes"
import Company from "./models/companies.model"
import Product from "./models/products.model"
import User from "./models/users.model"
import { CLIENT_URL, PORT } from "./configs/general.config"
import randomInt from "./utils/randomInt"



// Create in memory Mongo DB and populate it with mock data
MongoMemoryServer.create()
.then(async (inMemoryMongoDB) => {
	console.log("Connecting to database..")
	await mongoose.connect(inMemoryMongoDB.getUri())

	console.log("Inserting mock companies..")
	await Company.insertMany(mockCompanies)

	const companies = await Company.find()
	const randomCompany = () => companies[randomInt(0, companies.length)]

	console.log("Inserting mock products..")
	const mockProducts = mockProductsWithoutCompany.map(p => ({ ...p, company: randomCompany() }))
	await Product.insertMany(mockProducts)

	console.log("Inserting a user =>  username: admin, password: admin")
	await User.create({
		name: "admin",
		username: "admin",
		passwordHash: await argon2.hash("admin"),
	})
	console.log("Database successfully populated")
})



const app = express()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors({
	origin: CLIENT_URL,
	credentials: true,
}))

routes(app)

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})
