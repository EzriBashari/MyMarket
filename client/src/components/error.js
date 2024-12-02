import React from 'react'
import styles from './error.module.css'
const Error = ({ content }) => {

  return <p className={styles.error}>{content}</p>;
};

export default Error;