import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./buyerOrders.module.css";
import OrderModal from "./orderModal";
const BuyerOrders = () => {
  // const serializedState = sessionStorage.getItem("myStateKey");
  // const myState = JSON.parse(serializedState);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const serializedState = sessionStorage.getItem("myStateKey");
    const myState = JSON.parse(serializedState);
    if (myState !== undefined) {
      const fetchOrders = async () => {
        try {
          const urlPath =
            "http://localhost:8080/api/myOrders/" + myState.userID;
          //console.log(urlPath);
          const res = await axios.get(urlPath);
          console.log(res.data);
          setOrders(res.data);
          // Check if res.data exists and is an array with at least one element
        } catch (err) {
          console.log(err);
        }
      };
      fetchOrders();
    }
  }, []);
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <div className={styles.main}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order number</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              // onDoubleClick={() => console.log(order.orderNumber)}
              key={order.orderNumber}
            >
              <td>
                <OrderModal orderNumber={order.orderNumber} />
              </td>

              <td> ${order.price}</td>
              <td> {formatDate(order.dateOfOrder)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BuyerOrders;
