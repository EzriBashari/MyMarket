/**********************************
 ************* IMPORT REACT ************
 ************************************/
import React, { useState, useEffect } from "react";
import Product from "../product/Product";

/**********************************
 ************* IMPORT DESIGN ************
 ************************************/
import { Button } from "../../../components/Button";
import styles from "../HomePage.module.css";
import axios from "axios";
const Store = (props) => {
  /**********************************
   ************* USE STATE ************
   ************************************/
  const [inputValue, setInputValue] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  // axios.defaults.withCredentials = true;

  useEffect(() => {
    const serializedState = sessionStorage.getItem("storeProduct");
    const product = JSON.parse(serializedState);
    
    const productId = product.productId
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/fetchStorProduct/" + productId
        );

        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllProducts();
  },[]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const handleSearch = (e) => {
    e.preventDefault();
    // Filter products based on the search input
    const productsSearch = products.filter((product) =>
      product.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    if (productsSearch.length === 0) {
      setError("No product found");
      setFilteredProducts([]);
    } else {
      setError("");
      setFilteredProducts(productsSearch);
    }
  };

  return (
    <div className={styles.main}>
      <div>
        <div className={`${styles.inputGroup} `}>
          <div className=""></div>
          <form className={`${styles.form}`} onSubmit={handleSearch}>
            <input
              className={`${styles.input} `}
              type="text"
              placeholder="Search"
              aria-label="Search"
              value={inputValue}
              onChange={handleInputChange}
            />
            <Button text="Search" link="/" onClick={handleSearch} />
          </form>
        </div>
        {error !== "" && <p className={`${styles.error}`}>{error}</p>}
      </div>
      <div
        className={`${styles.border}  ${styles.flexWrap} ${styles.justifyContent} ${styles.alignItems} ${styles.container}`}
      >
        {filteredProducts.length === 0
          ? products.map((product) => (
              <Product key={product.productNumber} product={product} />
            ))
          : filteredProducts.map((product) => (
              <Product key={product.productNumber} product={product} />
            ))}
      </div>
    </div>
  );
};

export default Store;
