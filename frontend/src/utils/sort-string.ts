import { SorterResult } from "antd/es/table/interface"
import { Company, Product } from "./api-utils"

const sortQueryString = <T extends Company | Product>(sorter: SorterResult<T> | SorterResult<T>[]) => {
	if (Array.isArray(sorter))
		return ""

	// yikes
	const order =
		sorter.order === "ascend" ? "" :
		sorter.order === "descend" ? "-" :
		undefined

	const sortString = order !== undefined ? `${order}${sorter.field!.toString()}` : ""
	return sortString
}


export default sortQueryString
