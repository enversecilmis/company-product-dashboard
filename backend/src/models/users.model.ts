import { Schema, SchemaTypes as t, model, InferSchemaType } from "mongoose";


export type UserType = InferSchemaType<typeof userSchema>

export const userSchema = new Schema({
	username: {
		type: t.String,
		required: true,
	},
	name: {
		type: t.String,
		required: true,
	},
	passwordHash: {
		type: t.String,
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


const User = model("User", userSchema)

export default User
