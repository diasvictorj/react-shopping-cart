import { Col, Row } from "react-bootstrap";
import { StoreItem } from "../components/StoreItem";
import { useShoppingCart } from "../context/ShoppingCartContext";
import Loading from "./Loading";

export function Store() {
  const { data, isLoading } = useShoppingCart();

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
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
      )}
    </>
  );
}
