import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../../components/Button";
import Error from "../../../components/error";
import styles from "./addCategory.module.css";
const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [content, setContent] = useState(false);
  const fetchAllCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/fetchAllCategories"
      );

      setCategories(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);
  const handleDeleteCategory = async (categoryID) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/api/deleteCategory/${categoryID}`
      );
      if (data.Error !== "") {
        setError(true);
        setContent(data.Error);
      } else {
        setError(false);
      } // Refresh the categories after deleting one
      fetchAllCategories();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddCategory = async () => {
    setError(false);
    const categoryName = document.querySelector(
      `.${styles.categoryInput}`
    ).value;
    if (categoryName.trim() === "") return;
    const categoryExists = categories.some(
      (category) => category.Name.toLowerCase() === categoryName.toLowerCase()
    );
    if (categoryExists) {
      console.log("Category already exists.");
      setError(true);
      setContent("Category already exists.");
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/addCategory",
        {
          name: categoryName,
        }
      );
      console.log(data);
      fetchAllCategories(); // Refresh the categories after adding a new one
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>
        {categories.map((category) => (
          <div className={styles.category} key={category.CategoryID}>
            <p>{category.Name}</p>
            <Button
              text="delete"
              onClick={() => handleDeleteCategory(category.CategoryID)}
            />
          </div>
        ))}
      </div>
      <input
        placeholder="Enter category name"
        className={styles.categoryInput}
      />
      {error && <Error content={content} />}
      <Button text="add" onClick={handleAddCategory} />
      <Button text="go back" link="/profile" />
    </div>
  );
};

export default AddCategory;
