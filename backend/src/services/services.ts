import companiesService from "./companies.service";
import productsService from "./products.service";
import usersService from "./users.service";

const services = {
	user: usersService,
	product: productsService,
	company: companiesService,
}


export default services