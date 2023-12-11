import { RequestHandler } from "express"
import z, { ZodSchema } from "zod"



type ValidationMiddleware = (schema: {
	body?: ZodSchema,
	params?: ZodSchema,
	query?: ZodSchema,
}) => RequestHandler



const validation: ValidationMiddleware = (schema) => (req, res, next) => {
	const fullSchema = z.object({
    body: schema.body ?? z.undefined(),
    query: schema.query ?? z.undefined(),
    params: schema.params ?? z.undefined(),
  })
	
	const { body, params, query } = req
	const validation = fullSchema.safeParse({ body, params, query })

	if (!validation.success)
		return res.status(400).json({ error: validation.error.message })
	
	return next()
}




export default validation
