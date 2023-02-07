import { Col, Row } from "react-bootstrap";
import storeItems from "../data/items.json";
import { StoreItem } from "../components/StoreItem";
import dataFetch from "../hooks/dataFetch";
import { useEffect } from "react";

type dataProps = {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
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
