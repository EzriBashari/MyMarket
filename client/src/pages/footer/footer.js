import React from "react";
import styles from "./Footer.module.css";


export default function App() {
  return (
    <footer className={`${styles.footer}`}>
      <div className={`${styles.text}`}>
        <p className={`${styles.p}`}>
          &copy; {new Date().getFullYear()} Copyright: Ezri Bashari
        </p>
      </div>
    </footer>
  );
}
