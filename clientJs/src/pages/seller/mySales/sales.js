import React, { useEffect, useState } from "react";
import styles from "../seller.module.css";
import axios from "axios";
import { Button } from "../../../components/Button";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const Sales = () => {
  const [sales, setSales] = useState([]);
  useEffect(() => {
    const serializedState = sessionStorage.getItem("myStateKey");
    const myState = JSON.parse(serializedState);
    let sellerId = myState?.userID || 207324280;

    const fetchMySales = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/fetchMySales:" + sellerId
        );
        // console.log(res.data);
        setSales(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMySales();
  }, []);
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0]; // Extract only the date part
  };

  const [seed, setSeed] = useState(1);
  const reset = () => {
    setSeed(Math.random());
    console.log(seed);
  };
  const handleConfirmOrder = async (orderId, productNumber) => {
    const values = {
      productNumber: productNumber,
      orderId: orderId,
    };
    try {
      await axios.post("http://localhost:8080/api/confirmOrder", values);

      const updatedIndex = sales.findIndex(
        (sale) =>
          sale.orderNumber === orderId && sale.productNumber === productNumber
      );

      if (updatedIndex !== -1) {
        const updatedSales = [...sales];
        // Update the orderStatus to "confirmed"
        updatedSales[updatedIndex].orderStatus = "confirmed";
        setSales(updatedSales);
        reset();
      }
      // console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSentOrder = async (orderId, productNumber) => {
    const values = {
      productNumber: productNumber,
      orderId: orderId,
    };
    try {
      await axios.post("http://localhost:8080/api/orderSent", values);

      const updatedIndex = sales.findIndex(
        (sale) =>
          sale.orderNumber === orderId && sale.productNumber === productNumber
      );

      if (updatedIndex !== -1) {
        const updatedSales = [...sales];
        // Update the orderStatus to "shipped"
        updatedSales[updatedIndex].orderStatus = "shipped";
        setSales(updatedSales);
      }

      // console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const sortSales = (a, b) => {
    const orderStatusOrder = {
      pending: 1,
      confirmed: 2,
      shipped: 3,
      completed: 4,
    };

    return orderStatusOrder[a.orderStatus] - orderStatusOrder[b.orderStatus];
  };

  const getStatusCellStyle = (orderStatus) => {
    if (orderStatus === "pending") {
      return { backgroundColor: "rgba(255, 50, 50, 0.5)" }; // Light red
    } else if (orderStatus === "confirmed") {
      return { backgroundColor: "rgba(255, 255, 0, 0.5)" }; // Light yellow
    } else if (orderStatus === "shipped") {
      return { backgroundColor: "rgba(50, 255, 50, 0.5)" }; // Light green
    }
    return { backgroundColor: "rgba(255, 255, 255, 0.5)" }; // Default style
  };
  return (
    <div>
      {sales.length > 0 ? (
        <div>
          <div className={styles.exportButton}>
            <h2>Orders</h2>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="sales"
              filename="seller_sales"
              sheet="sheet 1"
              buttonText="Export to Excel"
            />
          </div>
          <div className={styles.sellerTableContainerSales}>
            <div className={styles.sellerContainer}>
              <table className={`${styles.sellerTable}`} id="sales">
                <thead>
                  <tr>
                    <th>Product Number</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>send to</th>
                    <th>status</th>
                    <th>confirm</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.sort(sortSales).map((sale, index) => (
                    <tr
                      key={index}
                      style={getStatusCellStyle(sale.orderStatus)}
                    >
                      <td>{sale.productNumber}</td>
                      <td>{sale.amount}</td>
                      <td>{formatDate(sale.dateOfOrder)}</td>
                      <td>{sale.address}</td>
                      <td>{sale.orderStatus}</td>
                      <div>
                        {sale.orderStatus === "pending" && (
                          <Button
                            text="Confirm Order"
                            link="/seller"
                            onClick={() =>
                              handleConfirmOrder(
                                sale.orderNumber,
                                sale.productNumber
                              )
                            }
                          />
                        )}

                        {sale.orderStatus === "confirmed" && (
                          <Button
                            text="product shipped"
                            onClick={() =>
                              handleSentOrder(
                                sale.orderNumber,
                                sale.productNumber
                              )
                            }
                          />
                        )}
                      </div>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.NoSales}>
          {" "}
          <h2>No sales yet</h2>
        </div>
      )}
    </div>
  );
};

export default Sales;
