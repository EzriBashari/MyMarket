import styles from "./update.module.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Error from "../../../components/error";
// import { useLocation, useNavigate } from "react-router-dom";

const UpdateProduct = (props) => {
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: props.product.name,
    description: props.product.description,
    productNumber: props.product.productNumber,
    amount: props.product.amount,
    CategoryID: props.product.CategoryID,
    SellerID: props.product.CategoryIDID,
    price: props.product.price,
    image: props.product.image,
  });
  const [error, setError] = useState(false);
  const [content, setContent] = useState("");
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/fetchAllCategories"
        );
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllCategories();
  }, []);

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
        "http://localhost:8080/api/updateProduct",
        formData
      );
      console.log(data);
      if (data.Error !== undefined) {
        setError(true);
        setContent(data.Error);
      } else {
        setError(false);
        setContent("");
        window.location.reload();
      }
      //  props.cancel();
    } catch (error) {
      console.log(error);
    }
  };

  const path = "images/" + props.product.image.split("\\").pop();

  return (
    <div className={`${styles.main}`}>
      <form className={`${styles.form}`} encType="multipart/form-data">
        <img
          src={path}
          className={`${styles.image}`}
          alt="something is not working"
        />

        <input
          value={product.name}
          className={`${styles.input}`}
          type="text"
          placeholder="name"
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          name="name"
          required
        />
        <input
          value={product.description}
          className={`${styles.input}`}
          type="text"
          placeholder="description"
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          name="description"
        />
        <input
          value={product.price}
          className={`${styles.input}`}
          type="number"
          placeholder="price"
          onChange={(e) => {
            if (e.target.value > 0)
              setProduct({ ...product, price: e.target.value });
          }}
          name="price"
        />

        <input
          value={product.amount}
          className={`${styles.input}`}
          type="number"
          placeholder="amount"
          onChange={(e) => {
            if (e.target.value > 0)
              setProduct({ ...product, amount: e.target.value });
          }}
          name="amount"
        />
        <select
          onChange={(e) => {
            const selectedCategoryId = e.target.value;
            console.log("Selected value:", selectedCategoryId);
            setProduct({ ...product, CategoryID: selectedCategoryId });
          }}
          className={`${styles.input}`}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option
              key={category.CategoryID}
              value={category.CategoryID} // Use the correct value (CategoryID) here
            >
              {category.Name}
            </option>
          ))}
        </select>

        <input
          type="file"
          placeholder="image"
          name="file"
          onChange={(e) => setProduct({ ...product, image: e.target.files[0] })}
        />
        {error && (
          <div className={styles.error}>
            <Error content={content} />
          </div>
        )}
        <button
          type="submit"
          className={`${styles.button}`}
          onClick={handleClick}
        >
          update
        </button>
        <button className={`${styles.button}`} onClick={props.cancel}>
          cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
