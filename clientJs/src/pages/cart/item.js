import React, { useState } from "react";
import styles from "./Item.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
// import { Checkbox } from "@mui/material";

const Item = ({ product }, props) => {
  const {
    image,
    name,
    price,
    status,
    amount,
    productNumber,
    cartAmount,
    checked,
  } = product;
  const [itemAmount, setItemAmount] = useState(cartAmount);
  
  //console.log(typeof itemAmount);
  const handleIncrement = async (req, res) => {
    if (amount === itemAmount) {
      return;
    }
    const values = {
      productNumber: productNumber,
      amount: itemAmount + 1,
    };
    // console.log(itemAmount);
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/increment",
        values
      );
      // console.log(values);
      // console.log(data);
      window.location.reload();
      if (data.Success === "good") {
        // console.log("added");
        setItemAmount(itemAmount + 1);
        // console.log(itemAmount);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleDecrement = async (productNumber) => {
    if (itemAmount === 1 || itemAmount === 0) {
      return;
    }
    const values = {
      productNumber: productNumber,
      amount: itemAmount - 1,
    };
    // console.log(itemAmount);
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/decrement",
        values
      );
      // console.log(values);
      // console.log(data);
      window.location.reload();
      if (data.Success === "good") {
        //console.log("added");
        setItemAmount(itemAmount - 1);
        // console.log(itemAmount);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleDelete = async (productNumber) => {
    try {
      //console.log(productNumber);
      await axios.delete("http://localhost:8080/api/removeFromCart", {
        data: {
          productNumber: productNumber,
        },
      });
      window.location.reload();
    } catch (error) {
      console.log("Error" + error);
    }
  };
if (itemAmount > amount) {
  handleDecrement(productNumber);
}
  const handleChecked = async (e) => {
    const values = {
      productNumber: productNumber,
      status: checked,
    };
    // console.log(checked);
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/checked",
        values
      );
      if (data.Success === "good") {
        // console.log("we tryed to check");
        window.location.reload();
        // setChecked(newChecked); // Update the checked state here
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  // console.log(status);
  const imagePath =
    status === 0
      ? `images/${image.split("\\").pop()}`
      : `images/outOfStock.jpg`;
  return (
    <div className={`${styles.itemContainer} ${styles.border}`}>
      <FontAwesomeIcon
        className={styles.icon}
        icon={faTrash}
        onClick={() => handleDelete(product.productNumber)}
      />
      <div className={`${styles.imageContainer} `}>
        <img src={imagePath} alt="456" className={`${styles.itemImage} `} />
      </div>
      <div className={`${styles.checkItem} `}>
        <input
          className={`${styles.checkItem} `}
          type="checkbox"
          id={product.productNumber}
          onChange={handleChecked}
          checked={checked === 1 && status === 0 && itemAmount !== 0}
          disabled={status !== 0 || itemAmount === 0}
        />
      </div>
      <div className={`${styles.buttonsContainer}`}>
        <h3>{name}</h3>
        {/* <p className={`${styles.description}`}>{description}</p> */}
        {status === 0 && (
          <div>
            <div className={styles.price}>${price * itemAmount}</div>
            <div className={styles.amountContainer}>
              <button
                className={`${styles.amountButton}`}
                onClick={() => handleDecrement(product.productNumber)}
              >
                -
              </button>
              <p>{itemAmount}</p>
              <button
                className={`${styles.amountButton}`}
                onClick={() => handleIncrement(product.productNumber)}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
