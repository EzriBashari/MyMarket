import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import styles from "./buyerOrders.module.css";
import { Button as MyButton } from "../../../components/Button"; // Import your custom Button component here

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "20px",
  p: 4,
};

const OrderModal = ({ orderNumber }) => {
  const [product, setProducts] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/fetchProductsInOrder",
        { orderNumber: orderNumber }
      );
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOrderCompleted = async (orderId, productNumber) => {
    const values = {
      productNumber: productNumber,
      orderId: orderId,
    };
    try {
      await axios.post("http://localhost:8080/api/orderCompleted", values);

      const updatedIndex = product.findIndex(
        (p) => p.productNumber === productNumber
      );

      if (updatedIndex !== -1) {
        const updatedProducts = [...product];
        updatedProducts[updatedIndex].orderStatus = "completed";
        setProducts(updatedProducts);
      }
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

  return (
    <div>
      <Button onClick={handleOpen}>{orderNumber}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Order Details for Order Number: {orderNumber}
          </Typography>
          {/* Additional content here */}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>product name</th>
                <th>amount</th>
                <th>price</th>
                <th>total</th>
                <th>from</th>
                <th className={styles.status}>status</th>
                <th className={styles.status}>confirm</th>
              </tr>
            </thead>
            <tbody>
              {product.sort(sortSales).map((p) => (
                <tr
                  key={p.productNumber}
                  style={{
                    backgroundColor:
                      p.orderStatus === "pending"
                        ? "rgba(255, 50, 50, 0.5)"
                        : p.orderStatus === "confirmed"
                        ? "rgba(255, 255, 0, 0.5)"
                        : p.orderStatus === "shipped"
                        ? "rgba(50, 255, 50, 0.5)"
                        : "white",
                  }}
                >
                  <td>{p.name}</td>
                  <td>{p.buyAmount}</td>
                  <td>${p.price}</td>
                  <td>${p.price * p.buyAmount}</td>
                  <td>{p.sellerName}</td>
                  <td>{p.orderStatus}</td>
                  <td>
                    {p.orderStatus === "shipped" && (
                      <MyButton
                        text="Confirm Order"
                        onClick={() =>
                          handleOrderCompleted(orderNumber, p.productNumber)
                        }
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Modal>
    </div>
  );
};

export default OrderModal;
