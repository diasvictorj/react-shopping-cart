import { Offcanvas, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { formateCurrency } from "../utilities/formatCurrency";
import CartItem from "./CartItem";
import dataFetch from "../hooks/dataFetch";

type ShoppingCartProps = {
  isOpen: boolean;
};

type dataProps = {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
};

export default function ShoppingCart({ isOpen }: ShoppingCartProps) {
  const { closeCart, cartItems } = useShoppingCart();

  /*   useEffect(() => {
    const totalValue: number = cartItems.reduce((total, cartItem) => {
      const item = data.find((item) => item.id === cartItem.id);
      return total + (item?.price || 0) * cartItem.quantity;
    }, 0);
    console.log("Dibre", totalValue);
  }, [cartItems]); */

  const data: dataProps[] = dataFetch();

  return (
    <Offcanvas show={isOpen} onHide={closeCart} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cart</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <Stack gap={3}>
          {cartItems.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}
          <div className="ms-auto fw-bold fs-5">
            Total: {""}
            {formateCurrency(
              cartItems.reduce((total, cartItem) => {
                const item = data.find((item) => item.id === cartItem.id);
                return total + (item?.price || 0) * cartItem.quantity;
              }, 0)
            )}
          </div>
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
