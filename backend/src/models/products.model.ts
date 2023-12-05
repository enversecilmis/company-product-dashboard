import { InferSchemaType, Schema, model, SchemaTypes as t } from "mongoose";
import { companySchema } from "./companies.model";

export type ProductType = InferSchemaType<typeof productSchema>

export const productSchema = new Schema({
	name: {
		type: t.String,
		required: true,
	},
	category: {
		type: t.String,
		required: true,
	},
	amount: {
		type: t.Number,
		required: true,
	},
	amountUnit: {
		type: t.String,
		required: true,
	},
	company: {
		type: companySchema,
		required: true,
	},

	createdAt: {
		type: t.Date,
		default: Date.now,
		immutable: true,
		required: true,
	},
	updatedAt: {
		type: t.Date,
		default: Date.now,
		required: true,
	},
})


const Product = model("Product", productSchema)

export default Product
