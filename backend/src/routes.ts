import { Express } from "express"
import cookieJwtAuth from "./middlewares/cookieJwtAuth"
import controllers from "./controllers/controllers"


function routes(app: Express) {
	app.get("/companies", cookieJwtAuth, controllers.company.get)
	app.get("/companies/count", cookieJwtAuth, controllers.company.getCount)
	app.get("/companies/countries", cookieJwtAuth, controllers.company.getCountries)
	app.get("/companies/:companyId", cookieJwtAuth, controllers.company.getById)
	app.post("/companies", cookieJwtAuth, controllers.company.post)
	app.put("/companies/:companyId", cookieJwtAuth, controllers.company.put)
	app.delete("/companies", cookieJwtAuth, controllers.company.delete)
	app.get("/company-names", cookieJwtAuth, controllers.company.getAllNames)
	
	app.get("/products", cookieJwtAuth, controllers.product.get)
	app.get("/products/count", cookieJwtAuth, controllers.product.getCount)
	app.get("/products/categories", cookieJwtAuth, controllers.product.getCategories)
	app.get("/products/:productId", cookieJwtAuth, controllers.product.getById)
	app.post("/products", cookieJwtAuth, controllers.product.post)
	app.put("/products/:productId", cookieJwtAuth, controllers.product.put)
	app.delete("/products", cookieJwtAuth, controllers.product.delete)
	
	app.get("/users", cookieJwtAuth, controllers.user.get)
	app.get("/users/count", cookieJwtAuth, controllers.user.getCount)
	app.get("/users/:productId", cookieJwtAuth, controllers.user.getById)
	app.post("/users", cookieJwtAuth, controllers.user.post)
	app.put("/users", cookieJwtAuth, controllers.user.put)
	app.delete("/users", cookieJwtAuth, controllers.user.delete)

	app.post("/register", controllers.auth.register)
	app.post("/login", controllers.auth.login)
	app.get("/check-auth", cookieJwtAuth, controllers.auth.checkAuth)
	app.post("/logout", controllers.auth.logout)
}


export default routes
