import React, { useState, useEffect } from "react";
import styles from "./summary.module.css";
import { Button } from "../../components/Button";
import axios from "axios";
import { PayPal } from "../../components/PayPal";

const Summary = ({ items }, props) => {
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [itemsChecked, setItemsChecked] = useState(0);
  const serializedState = sessionStorage.getItem("myStateKey");
  const myState = JSON.parse(serializedState);

  useEffect(() => {
    // Calculate total and itemsChecked using reduce
    const { totalAmount, checkedItemsCount } = items.reduce(
      (accumulator, product) => {
        if (product.checked === 1 && product.status === 0) {
          accumulator.totalAmount += product.cartAmount * product.price;
          accumulator.checkedItemsCount++;
        }
        return accumulator;
      },
      { totalAmount: 0, checkedItemsCount: 0 }
    );

    // Update state once with the calculated values
    setTotal(totalAmount);
    setItemsChecked(checkedItemsCount);

    async function handleChangeTax() {
      try {
        const res = await axios.post("http://localhost:8080/api/importTax");
        setTax(res.data[0].tax_price);
      } catch (err) {
        console.log("Error", err);
      }
    }

    handleChangeTax();
  }, [items]);

  const handlePlaceOrder = async () => {
    // Filter checked items
    const checkedItems = items.filter(
      (item) => item.checked === 1 && item.status === 0
    );

    // Prepare the data for the API request
    const postData = {
      userID: myState.userID,
      checkedItems: checkedItems,
    };

    // Send the checked items to the backend
    try {
      await axios.post("http://localhost:8080/api/  ", postData);

      window.alert("order is made");
      window.location.reload();
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div className={`${styles.container}`}>
      <p>items: {itemsChecked}</p>
      <p>subtotal: ${total}</p>
      <p>tax: ${Number(total * (tax * 0.01)).toFixed(2) + " (" + tax + "%)"}</p>
      <p>price: ${Number((total + total * (tax * 0.01)).toFixed(2))}</p>

      <div>
        {/* <button onClick={createNewOrder}>check out</button> */}
        <Button text="Place Order" onClick={handlePlaceOrder} />
        <div className={styles.paypalContainer}>
          <PayPal total={total} />
        </div>
      </div>
    </div>
  );
};

export default Summary;
