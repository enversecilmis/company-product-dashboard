const sortDirection = (
	fieldName: string,
	sort: string,
) =>
sort === `${fieldName}` ? "ascend" :
sort === `-${fieldName}` ? "descend" :
undefined


export default sortDirection
