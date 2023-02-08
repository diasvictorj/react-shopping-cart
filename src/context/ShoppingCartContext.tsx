import { createContext, useContext, ReactNode, useState } from "react";
import ShoppingCart from "../components/ShoppingCart";
import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect } from "react";
import axios from "axios";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: string) => number;
  increaseCartQuantity: (id: string) => void;
  decreaseCartQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  cartQuantity: number;
  cartItems: CartItem[];
  data: dataProps[];
};
type CartItem = {
  id: string;
  quantity: number;
};

type dataProps = {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [data, setData] = useState<dataProps[]>([]);

  /*  const client = axios.create({
    baseURL: "https://api.mercadolibre.com/sites/MLB/search?q=computador",
  }); */

  useEffect(() => {
    axios
      .get("https://api.mercadolibre.com/sites/MLB/search?q=computador")
      .then((res) => {
        const toState = res.data.results.map(
          (e: {
            id: string;
            title: string;
            price: number;
            thumbnail: string;
          }) => {
            return {
              id: e.id,
              name: e.title,
              price: e.price,
              imgUrl: e.thumbnail,
            };
          }
        );
        setData(toState);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

  function getItemQuantity(id: string) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }
  function increaseCartQuantity(id: string) {
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
  function decreaseCartQuantity(id: string) {
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

  function removeFromCart(id: string) {
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
        data,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
