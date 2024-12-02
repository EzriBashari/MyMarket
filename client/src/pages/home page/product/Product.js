import React from "react";

import styles from "./Product.module.css";

import BasicModal from "../product modal/modal";

const Product = ({ product, id }) => {
  const { image, name, description, price } = product;
  const path = "images/" + image.split("\\").pop();

  return (
    <div
      key={product.productNumber}
      className={`${styles.border} ${styles.container}`}
      //onClick={handleClick}
    >
      <BasicModal
        product={product}
        image={product.image}
        name={product.name}
        description={product.description}
        price={product.price}
      />
      <div className={styles.imageContainer}>
        <img src={path} alt="" className={styles.image} />
      </div>
      <h3 className={`${styles.h3}`}>{name}</h3>
      <p className={`${styles.description}`}>{description}</p>
      <p>${price}</p>
    </div>
  );
};

export default Product;
