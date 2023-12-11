import { SorterResult } from "antd/es/table/interface"
import { Company } from "./api-utils"

const sortQueryString = (sorter: SorterResult<Company> | SorterResult<Company>[]) => {
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
