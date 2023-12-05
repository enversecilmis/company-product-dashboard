import { RequestHandler } from "express";

// TODO
type BodyValidator = (schema: any) => RequestHandler

const bodyValidator: BodyValidator = (schema) => (req, res, next) => {
	
	
}


export default bodyValidator