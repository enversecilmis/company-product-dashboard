import authControllers from "./auth.controller";
import companyControllers from "./companies.controller";
import productsControllers from "./products.controller";
import userControllers from "./users.controller";


const controllers = {
	auth: authControllers,
	company: companyControllers,
	product: productsControllers,
	user: userControllers,
}


export default controllers
