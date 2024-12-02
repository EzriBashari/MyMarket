import React from "react";
import styles from "./Button.module.css";
import { Link } from "react-router-dom";

const Button = (props) => {
  const { text, link, onClick, type } = props;

  return (
    <button className={styles.button} onClick={onClick} type={type} >
      <Link className={`${styles.link}`} to={`${link||""}`}>
        {text}
      </Link>
    </button>
  );
};

export { Button };
