import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { Button, Result } from "antd"


type Props = {
	redirectTo?: string
	delay?: number
}


export default function NotFound({ redirectTo, delay }: Props) {
	const navigate = useNavigate()

	useEffect(() => {
		if (!redirectTo)
			return

		const to = redirectTo
		const timeout = setTimeout(() => navigate(to, { replace: true }), delay);

		return () => clearTimeout(timeout)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])


	const backHome = () => {
		navigate("/")
	}
	
	return (
		<Result
			status="404"
			title="404"
			subTitle="Sorry, we couldn't find what you're looking for."
			extra={<Button onClick={backHome} type="primary">Back Home</Button>}
		/>
	)
}
