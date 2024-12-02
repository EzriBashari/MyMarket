import React, { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Error from "../../../components/error";
import { Button } from "../../../components/Button";
const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [content, setContent] = useState("");
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  //const [email, setEmail] = useState("");

  const handleRestorePassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/sendRandomPassword",
        { email: values.email }
      );
      if (response.data.Error !== "") {
        setError(true);
        setContent(response.data.Error);
      } else {
        setError(false);
        setContent("");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/login",
        values
      );

      if (data.Error !== "") {
        setError(true);
        setContent(data.Error);
      }
      if (data.Status === "Success") {
        // Update the userContext value here
        const userInfo = {
          userID: data.userID, // Assuming the response contains the userID
          isAdmin: data.isAdmin, // Assuming the response contains isAdmin status
          role: data.role,
        };
        console.log(userInfo);
        const serializedState = JSON.stringify(userInfo);
        sessionStorage.setItem("myStateKey", serializedState);
        // Navigate to the desired route

        console.log(data);
        console.log(userInfo);
        setError(false);
        if (data.role === "buyer") navigate("/");
        else if (data.isAdmin === 1) {
          navigate("/admin");
        } else {
          navigate("/seller");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`${styles.main}`}>
      <form className={`${styles.form}`} onSubmit={handleClick}>
        <div className={`${styles.formGroup}`}>
          <label>Email</label>
          <input
            className={styles.input}
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label className="">password</label>
          <input
            className={styles.input}
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
        </div>
        <div className={`${styles.formGroup}`}>
          don't have an account?
          <Link to="/register" className={`${styles.registerlink}`}>
            sign up now!
          </Link>
        </div>
        <div className={`${styles.formGroup}`}>
          <Button text="login" onClick={handleClick} />
          <Button text="forgot password" onClick={handleRestorePassword} />
          {/* <button text="login" className={styles.registerButton}>
            login
          </button> */}
          {/* <button text="login" className={styles.registerButton}></button> */}
        </div>
        <div>{error && <Error content={content} />}</div>
      </form>
    </div>
  );
};

export default Login;
