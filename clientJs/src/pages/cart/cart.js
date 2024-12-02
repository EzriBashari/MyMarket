import React, { useState, useEffect } from "react";
import Item from "./item";
import styles from "./Cart.module.css";
import axios from "axios";


import Summary from "./summary";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../../components/Button";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(7);
  const serializedState = sessionStorage.getItem("myStateKey");
  const myState = JSON.parse(serializedState);

  useEffect(() => {
    const serializedState = sessionStorage.getItem("myStateKey");
    const myState = JSON.parse(serializedState);
    const fetchAllItems = async () => {
      try {
        // console.log(myState.userID);
        const res = await axios.get(
          "http://localhost:8080/api/displayCart/:" + myState.userID
        );
        setItems(res.data);
        // console.log(res.data);
      } catch (err) {
        console.log("Error" + err);
      }
    };

    if (myState !== null) {
      fetchAllItems();
    }
  }, []);

  return (
    <div className={`${styles.main}`}>
      {myState !== null ? (
        <div className={styles.cartContainer}>
          <div className={styles.products}>
            {items.map((product) => (
              <Item
                key={uuidv4()}
                product={product}
                total={total}
                setTotal={setTotal}
              />
            ))}
          </div>
          <div>
            <Summary total={total} items={items} />
      
            <div className={`${styles.button}`}></div>
          </div>
        </div>
      ) : (
        <div className={`${styles.warning}`}>
          <h2>NO user logged in</h2>
          <div className={`${styles.button}`}>
            <Button text="Login" link="/login" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
