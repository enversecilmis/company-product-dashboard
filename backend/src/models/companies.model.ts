import { InferSchemaType, Schema, model, SchemaTypes as t } from "mongoose";


export type CompanyType = InferSchemaType<typeof companySchema>

export const companySchema = new Schema({
	name: {
		type: t.String,
		required: true,
	},
	legalNumber: {
		type: t.Number,
		required: true,
	},
	incorporationCountry: {
		type: t.String,
		required: true,
	},
	website: {
		type: t.String,
		required: false,
	},

	createdAt: {
		type: t.Date,
		default: Date.now,
		required: true,
	},
	updatedAt: {
		type: t.Date,
		default: Date.now,
		required: true,
	},
})


const Company = model("Company", companySchema)

export default Company
