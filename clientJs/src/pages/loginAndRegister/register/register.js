import React, { useState } from "react";
import styles from "./register.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Error from "../../../components/error";

const Register = () => {
  const [error, setError] = useState(false);
  const [content, setContent] = useState("");
  const [values, setValues] = useState({
    ID: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    role: "buyer",
    image: "",
    isAdmin: "",
    phoneNumber: "",
    status: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("address", values.address);
    formData.append("role", values.role);
    formData.append("isAdmin", 0);
    formData.append("status", 0);
    formData.append("ID", "");
    formData.append("password", values.password);
    formData.append("file", values.image);
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/register",
        formData
      );
      e.preventDefault();
      // console.log(data.error);
      if (data.Error !== "") {
        setError(true);
        setContent(data.Error);
        // console.log(data);
      } else {
        navigate("/login");
        e.preventDefault();
        console.log(data);
        setError(false);
      }
      e.preventDefault();
    } catch (error) {
      console.log("THIS an error " + error);
    }
  };

  return (
    <div className={styles.main}>
      <form className={styles.form} encType="multipart/form-data">
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            className={styles.input}
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label>First name</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter your first name"
            onChange={(e) =>
              setValues({ ...values, firstName: e.target.value })
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label>Last name</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter your last name"
            onChange={(e) => setValues({ ...values, lastName: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Phone number</label>
          <input
            value={values.phoneNumber}
            className={styles.input}
            type="text"
            placeholder="Enter your phone number"
            onChange={(e) => {
              if (!isNaN(parseInt(e.target.value)) || e.target.value === "") {
                setValues({
                  ...values,
                  phoneNumber: e.target.value,
                });
              } else {
                setValues({
                  ...values,
                  phoneNumber: "",
                });
              }
            }}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Address</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter your address"
            onChange={(e) => setValues({ ...values, address: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label>image</label>
          <input
            className={styles.input}
            type="file"
            placeholder="Upload your image"
            name="file"
            onChange={(e) => setValues({ ...values, image: e.target.files[0] })}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            className={styles.input}
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
        </div>

        <label className={`${styles.radioGroup}`}>I am a:</label>
        <div className={`${styles.radioGroup} ${styles.radioButtons}`}>
          <input
            type="radio"
            name="radioGroup"
            id="radioBuyer"
            value="buyer"
            defaultChecked
            onChange={(e) => setValues({ ...values, role: "buyer" })}
          />
          <label className={styles.radioLabel} htmlFor="radioBuyer">
            Buyer
          </label>
        </div>
        <div className={`${styles.radioGroup} ${styles.radioButtons}`}>
          <input
            type="radio"
            name="radioGroup"
            id="radioSeller"
            value="seller"
            onChange={(e) => setValues({ ...values, role: "seller" })}
          />
          <label className={styles.radioLabel} htmlFor="radioSeller">
            Seller
          </label>
        </div>

        <div className={styles.formGroup}>
          <button
            onClick={handleSubmit}
            type="submit"
            text="register"
            className={styles.registerButton}
          >
            Register
          </button>
        </div>
        <div>{error && <Error content={content} />}</div>
      </form>
    </div>
  );
};

export default Register;
