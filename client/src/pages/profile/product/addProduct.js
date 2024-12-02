import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateOrUpdate.module.css";
import Error from "../../../components/error";
// import { Button } from "../../../components/Button";

//import { v4 as uuidv4 } from "uuid";

const AddProduct = ({cancel}) => {
  const [error, setError] = useState(false);
  const [content, setContent] = useState("");
  const [product, setProduct] = useState({
    name: "",
    description: "",
    productNumber: "",
    amount: null,
    CategoryID: null,
    SellerID: null,
    price: null,
    image: "",
  });
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("productNumber", product.productNumber);
    formData.append("amount", product.amount);
    formData.append("CategoryID", product.CategoryID);
    formData.append("SellerID", product.SellerID);
    formData.append("price", product.price);

    if (product.image) {
      formData.append("file", product.image);
    }

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/addProduct",
        formData
      );
      if (data.Error !== "") {
        setError(true);
        setContent(data.Error);
      }
      if (data.Status === "Success") {
        navigate("/seller");
        setError(false);
        setContent("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const serializedState = sessionStorage.getItem("myStateKey");
    const user = JSON.parse(serializedState);
    if (user && user.userID) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        SellerID: user.userID,
      }));
    }
    const fetchAllCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/fetchAllCategories"
        );

        setCategories(res.data);
        //console.log(res.data);
        // Update the state or perform any other necessary actions with the fetched data
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllCategories();
  }, []);

  return (
    <div className={`${styles.main}`}>
      <div className={`${styles.form}`}>
        <h2 className={`${styles.h2}`}>Add Product</h2>
        <input
          className={`${styles.input}`}
          type="text"
          placeholder="name"
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          name="name"
        />
        <input
          className={`${styles.input}`}
          type="text"
          placeholder="description"
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          name="description"
        />
        <input
          className={`${styles.input}`}
          type="number"
          placeholder="price"
          value={product.price}
          onChange={(e) => {
            const inputText = parseFloat(e.target.value);
            if (typeof inputText === "number" && inputText > 0) {
              setProduct({ ...product, price: inputText });
            }
          }}
          name="price"
        />
        <input
          className={styles.input}
          type="file"
          placeholder="Upload your image"
          onChange={(e) => setProduct({ ...product, image: e.target.files[0] })} // Update the image value
        />
        <input
          className={`${styles.input}`}
          type="number"
          placeholder="amount"
          value={product.amount}
          onChange={(e) => {
            const inputText = parseInt(e.target.value);
            if (typeof inputText === "number" && inputText > 0) {
              setProduct({ ...product, amount: inputText });
            }
          }}
          name="amount"
        />
        <select
          className={`${styles.input}`}
          value={product.CategoryID} // Set the selected value using the product.CategoryID
          onChange={(e) => {
            const selectedCategoryId = e.target.value;
            console.log("Selected value:", selectedCategoryId);
            setProduct({ ...product, CategoryID: selectedCategoryId });
          }}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.CategoryID} value={category.CategoryID}>
              {category.Name}
            </option>
          ))}
        </select>
        {error && <Error content={content} />}
        <button className={`${styles.button}`} onClick={handleClick}>
          Add
        </button>
        <button className={`${styles.button}`} onClick={cancel}>
          Cancel
        </button>
        
      </div>
    </div>
  );
};

export default AddProduct;
