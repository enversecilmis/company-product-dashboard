import missingFieldMockProducts from "./mock-products.json"
import mockCompanies from "./mock-companies.json"
import randomInt from "../utils/randomInt"

const units = ["kilograms", "grams", "meters", "pieces", "liters"]
const randomUnit = () => units[randomInt(0, units.length)]

const mockProductsWithoutCompany = missingFieldMockProducts.map(p => ({ ...p, amountUnit: randomUnit() }))

export {
	mockProductsWithoutCompany,
	mockCompanies,
}
