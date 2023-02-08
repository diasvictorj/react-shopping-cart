import { Col, Row } from "react-bootstrap";
import { StoreItem } from "../components/StoreItem";
import dataFetch from "../hooks/dataFetch";

type dataProps = {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
};

export function Store() {
  const data: dataProps[] = dataFetch();
  console.log(data);

  return (
    <>
      <h1>Store</h1>
      <Row md={2} xs={1} lg={3} className="g-3">
        {data.map((item) => (
          <Col key={item.id}>
            <StoreItem {...item} />
          </Col>
        ))}
      </Row>
    </>
  );
}
