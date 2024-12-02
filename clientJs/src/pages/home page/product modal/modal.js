import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import styles from "./modal.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import UpdateProduct from "../../profile/product/updateProduct";
import {
  faShoppingCart,
  faTrash,
  faRefresh,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
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

axios.defaults.withCredentials = true;

const handleDelete = async (productNumber) => {
  try {
    await axios.put(
      "http://localhost:8080/api/products/disable/" + productNumber
    );
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};
export default function BasicModal(props) {
  const [amount, setAmount] = useState(1);
  const handleAddToCart = async (productNumber, userID) => {
    const values = {
      productNumber: productNumber,
      userID: userID,
      amount: amount,
    };
    try {
      await axios.post(" http://localhost:8080/api/addToCart", values);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.log("Error", error.message);
      }
      console.log(error.config);
    }
  };

  const navigate = useNavigate();
  function handleGoToStore(productNumber) {
    const productInfo = { productId: productNumber };
    const serializedState = JSON.stringify(productInfo);
    sessionStorage.setItem("storeProduct", serializedState);
    navigate("/store");
  }
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const serializedState = sessionStorage.getItem("myStateKey");
  const myState = JSON.parse(serializedState);
  let isMyProduct, isAdmin;
  if (myState == null) {
    isMyProduct = false;
    isAdmin = false;
  } else {
    isMyProduct = myState.userID === props.product.ID;
    isAdmin = myState.isAdmin === 1;
  }
  const [isEdit, setIsEdit] = React.useState(false);
  function handleUpdate() {
    setIsEdit(true);
  }
  function cancelUpdate() {
    setIsEdit(false);
  }
  const path = "images/" + props.image.split("\\").pop();
  // console.log(props.product);
  return (
    <div>
      <Button
        onClick={handleOpen}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          right: "0",
          top: "0",
          borderRadius: "20px",
        }}
      ></Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
          ></Typography>
          {!isEdit ? (
            <div id="modal-modal-description" sx={{ mt: 2 }}>
              <img className={`${styles.image}`} src={path} alt={props.image} />
              <h2>{props.name}</h2>
              <p>{props.description}</p>
              <p>${props.price}</p>
              <p>available: {props.product.amount}</p>
              {!isMyProduct && myState !== null && (
                <div className={styles.amountContainer}>
                  <button
                    className={`${styles.amountButton}`}
                    onClick={() => {
                      if (amount > 1) {
                        setAmount(amount - 1);
                      }
                    }}
                  >
                    -
                  </button>

                  <p>{amount}</p>
                  <button
                    className={`${styles.amountButton}`}
                    onClick={() => {
                      if (amount < props.product.amount) {
                        setAmount(amount + 1);
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              )}
              <div className={`${styles.container}`}>
                {!isMyProduct && myState !== null && (
                  <div
                    className={`${styles.buttonsContainer}`}
                    onClick={() =>
                      handleAddToCart(
                        props.product.productNumber,
                        myState.userID
                      )
                    }
                  >
                    <FontAwesomeIcon
                      className={styles.icon}
                      icon={faShoppingCart}
                    />
                  </div>
                )}
                {!isMyProduct && myState !== null && (
                  <div
                    className={`${styles.buttonsContainer}`}
                    onClick={() => handleGoToStore(props.product.productNumber)}
                  >
                    <FontAwesomeIcon className={styles.icon} icon={faHome} />
                  </div>
                )}
                {(isMyProduct || isAdmin) && (
                  <div
                    className={`${styles.buttonsContainer}`}
                    onClick={() => handleDelete(props.product.productNumber)}
                  >
                    <FontAwesomeIcon className={styles.icon} icon={faTrash} />
                  </div>
                )}
                {isMyProduct && (
                  <div
                    onClick={handleUpdate}
                    className={`${styles.buttonsContainer}`}
                  >
                    <div>
                      <FontAwesomeIcon
                        className={styles.icon}
                        icon={faRefresh}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <UpdateProduct cancel={cancelUpdate} product={props.product} />
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
