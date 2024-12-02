import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./seller.module.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
// import Product from "../home page/product/Product";
import BasicModal from "../home page/product modal/modal";

import Sales from "./mySales/sales";
import { Button } from "../../components/Button";
import AddProduct from "../profile/product/addProduct";
const Seller = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [products, setProducts] = useState([]);
  const getRowStyle = (amount, isHovered) => {
    let backgroundColor;
    let lineHeight = "1"; // Default line height

    if (amount < 5) {
      backgroundColor = "rgba(255, 50, 50, 0.5)";
    } else {
      backgroundColor = "rgba(50, 255, 50, 0.5)";
      lineHeight = "2.0"; // Adjust the line height value as needed
    }

    if (isHovered) {
      backgroundColor = "rgb(0, 0, 0, 0.1)"; // New background color for hover
    }

    return { backgroundColor, lineHeight };
  };

  useEffect(() => {
    const serializedState = sessionStorage.getItem("myStateKey");
    const myState = JSON.parse(serializedState);
    let sellerId = myState?.userID || 207324280;
    const fetchSellerProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/fetchSellerProducts:" + sellerId
        );
        const sortedProducts = res.data.sort((a, b) => a.amount - b.amount);
        setProducts(sortedProducts);

        // console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSellerProducts();
  }, []);

  function handleAddProduct() {
    setIsAdding(true);
  }
  function handlecancel() {
    setIsAdding(false);
  }
  const [filteredProducts, setFilteredProducts] = useState([]);
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    // Filter products based on the search input
    const productsSearch = products.filter(
      (product) =>
        product.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        product.productNumber.toString() === inputValue
    );
    if (productsSearch.length === 0) {
      setError("No product found");
      setFilteredProducts([]);
    } else {
      setError("");
      setFilteredProducts(productsSearch);
    }
  };

  const handleRowHover = (index, isHovered) => {
    const updatedProducts = [...products];
    updatedProducts[index].isHovered = isHovered;
    setProducts(updatedProducts);
  };

  return (
    <div>
      <div className={styles.sellerContainer}>
        <div>
          <div className={styles.exportButton}>
            <h2>Products table</h2>
            <div>
              <form className={`${styles.form}`} onSubmit={handleSearch}>
                <input
                  className={`${styles.input} `}
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <Button text="Search" onClick={handleSearch} />
              </form>
              {error !== "" && <p>{error}</p>}
            </div>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="seller-table"
              filename="seller_data"
              sheet="sheet 1"
              buttonText="Export to Excel"
            />
          </div>
          <div>
            <div className={styles.sellerTableContainer}>
              {/* <button onClick={handleExportToPDF}>Export to PDF</button> */}
              <table className={`${styles.sellerTable}`} id="seller-table">
                <thead>
                  <tr>
                    <th>Product Number</th>
                    <th>Price</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Category ID</th>
                    <th>Sold</th>

                    {/* Add more table headers if there are more fields in the product object */}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0
                    ? products.map((product, index) => (
                        <tr
                          key={index}
                          style={getRowStyle(product.amount, product.isHovered)}
                          onMouseEnter={() => handleRowHover(index, true)}
                          onMouseLeave={() => handleRowHover(index, false)}
                        >
                          <td>
                            <div className={styles.modalContainer}>
                              {product.productNumber}
                              <BasicModal
                                product={product}
                                image={product.image}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                              />
                            </div>
                          </td>
                          <td>{product.price}</td>
                          <td>{product.name}</td>
                          <td>{product.amount}</td>
                          <td>{product.CategoryID}</td>
                          <td>{product.orderedItemCount}</td>
                        </tr>
                      ))
                    : filteredProducts.map((product, index) => (
                        <tr key={index} style={getRowStyle(product.amount)}>
                          <td>
                            <div className={styles.modalContainer}>
                              {product.productNumber}
                              <BasicModal
                                product={product}
                                image={product.image}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                              />
                            </div>
                          </td>
                          <td>{product.price}</td>
                          <td className={`${styles.tdName}`}>
                            {product.name}
                          </td>
                          <td>{product.amount}</td>
                          <td>{product.CategoryID}</td>
                          <td>{product.orderedItemCount}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.scrollableContainer}>
          <Sales />
        </div>
      </div>
      <div className={styles.addProductButton}>
        {!isAdding && <Button text="new product" onClick={handleAddProduct} />}
        {isAdding && <AddProduct cancel={handlecancel} />}
      </div>
    </div>
  );
};

export default Seller;
