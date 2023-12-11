
type Param = string | number | boolean

type Params = Record<string, Param | Param[]>


const parseQueryParams = (params?: Params) => {
	if (!params)
		return ""
	const keys = Object.entries(params)

	const queries = keys.map(([key, value]) => {
		const query = Array.isArray(value) ?
			value.map(val => `${key}=${val}`).join("&") :
			`${key}=${value}`

		return query
	})

	return queries.join("&")
}

export default parseQueryParams
