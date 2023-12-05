import { RequestHandler } from "express";

// TODO
type QueryParamValidator = (schema: any) => RequestHandler

const queryParamValidator: QueryParamValidator = (schema) => (req, res, next) => {

	
}


export default queryParamValidator