import React, { useState } from "react";
import styles from "./Profile.module.css";
import axios from "axios";
import { Button } from "../../components/Button";
import Error from "../../components/error";
const ChangePassword = (props) => {
  const serializedState = sessionStorage.getItem("myStateKey");

  const user = JSON.parse(serializedState);
  const setEdit = props.setEdit;
  const [values, setValues] = useState({
    firstPassword: "",
    secondPassword: "",
    newPassword: "",
    userID: user.userID,
  });

  const [error, setError] = useState(false);
  const [content, setContent] = useState("");
  const hndleChangePassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/changePassword",
        values
      );

      if (response.data.Error !== "") {
        setError(true);
        setContent(response.data.Error);
      }
      if (response.data.Status === "Success") {
        setEdit(false);
        window.alert("password changed");
      }
      // console.log(response.data); // Optional: Handle the response from the server
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <input
          className={styles.input}
          type="password"
          placeholder="Enter your password"
          onChange={(e) =>
            setValues({ ...values, firstPassword: e.target.value })
          }
        />
      </div>
      <div>
        <input
          className={styles.input}
          type="password"
          placeholder="Enter password again"
          onChange={(e) =>
            setValues({ ...values, secondPassword: e.target.value })
          }
        />
      </div>
      <div>
        <input
          className={styles.input}
          type="password"
          placeholder="Enter new password"
          onChange={(e) =>
            setValues({ ...values, newPassword: e.target.value })
          }
        />
      </div>
      {error && <Error content={content} />}
      <Button text="save changes" onClick={hndleChangePassword} />
    </div>
  );
};

export default ChangePassword;
