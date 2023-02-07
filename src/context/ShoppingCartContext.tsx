import { createContext, useContext, ReactNode, useState } from "react";
import ShoppingCart from "../components/ShoppingCart";
import useLocalStorage from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
};
type CartItem = {
  id: number;
  quantity: number;
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );
  const [isOpen, setIsOpen] = useState(false);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }
  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      //adcionando o elemento ao carrinho caso não exista
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      }
      //caso exista, incrementando a quantidade
      return currItems.map((item) => {
        //percorrendo o array de elementos do carrinho, procurando o elemento correto para atualizar a quantidade
        if (item.id === id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    });
  }
  function decreaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      //checando se o elemento será removido do carrinho ou se a quantidade será atualizada
      if (currItems.find((item) => item.id === id)?.quantity == 1) {
        return currItems.filter((item) => item.id !== id);
      }
      // decrementando a quantidade
      return currItems.map((item) => {
        //percorrendo o array de elementos do carrinho, procurando o elemento correto para atualizar a quantidade
        if (item.id === id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
    });
  }

  function removeFromCart(id: number) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }
  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartItems,
        cartQuantity,
        openCart,
        closeCart,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
