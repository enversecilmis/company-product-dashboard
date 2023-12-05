import { Col, Row } from "antd";
import CompanyCountCard from "../components/CompanyCountCard";
import ProductCountCard from "../components/ProductCountCard";
import LastlyAddedCompanies from "../components/LastlyAddedCompanies";
import LastlyAddedProductsCard from "../components/LastlyAddedProductsCard";


export default function HomePage() {
	return (
		<div className="p-8">
			<Row gutter={[32, 32]}>
				<Col span={24} md={{ span: 12 }}>
					<CompanyCountCard />
				</Col>
				<Col span={24} md={{ span: 12 }}>
					<ProductCountCard />
				</Col>
				<Col span={24} md={{ span: 12 }}>
					<LastlyAddedCompanies />
				</Col>
				<Col span={24} md={{ span: 12 }}>
					<LastlyAddedProductsCard />
				</Col>
			</Row>
		</div>
	)
}
