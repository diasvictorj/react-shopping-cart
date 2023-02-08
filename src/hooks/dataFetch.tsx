import { useState, useEffect } from "react";
import axios from "axios";

function dataFetch() {
  const [data, setData] = useState([]);

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
  return data;
}

export default dataFetch;

// effect functions can't be async, so declare the
// async function inside the effect, then call it
/* useEffect(() => {
    fetchData();
  });

  async function fetchData() {
    // Call fetch as usual
    const res = await fetch(
      "https://api.mercadolibre.com/sites/MLB/search?q=computador"
    );

    // Pull out the data as usual
    const json = await res.json();

    // Save the posts into state
    // (look at the Network tab to see why the path is like this)
    
    );
  } */
