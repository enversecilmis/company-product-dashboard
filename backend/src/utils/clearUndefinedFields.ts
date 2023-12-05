
/**
 * Deep clears undefined fields.
 * 
 * Object fields that have undefined fields are also cleared.
 */
function clearUndefinedFields(obj: Record<string, any>) {
	const filteredObj = Object.fromEntries(
		Object.entries(obj).filter(([key, value]) => {
			if (typeof value === "object") {
				const clearedObj = clearUndefinedFields(value)
				if (Object.keys(clearedObj).length === 0)
					return false
				else
					return true
			}

			return value !== undefined && value !== null
		})
	)

	return filteredObj
}


export default clearUndefinedFields
