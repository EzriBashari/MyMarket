import React, { useEffect, useState } from "react";
import styles from "../../seller/seller.module.css";
import axios from "axios";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  useEffect(() => {
    
    const fetchAllSellers = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/fetchSellersEmail"
        );
        console.log(res.data);
        setSellers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllSellers();
  }, []);
  

  const getStatusCellStyle = (orderStatus) => {
    if (orderStatus === "pending") {
      return { backgroundColor: "rgba(255, 50, 50, 0.5)" }; // Light red
    } else if (orderStatus === "confirmed") {
      return { backgroundColor: "rgba(255, 255, 0, 0.5)" }; // Light yellow
    } else if (orderStatus === "shipped") {
      return { backgroundColor: "rgba(50, 255, 50, 0.5)" }; // Light green
    }
    return { backgroundColor: "rgba(255, 255, 255, 0.5)" }; // Default style
  };
  return (
    <div>
      <div className={styles.exportButton}>
        <h2>All Sellers</h2>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button"
          table="sellers"
          filename="all_sellers"
          sheet="sheet 1"
          buttonText="Export to Excel"
        />
      </div>
      <div className={styles.sellerTableContainer}>
        <div className={styles.sellerContainer}>
          <table className={`${styles.sellerTable}`} id="sellers">
            <thead>
              <tr>
                <th>seller ID</th>
                <th>Email</th>
                <th>Full name</th>
                <th>Phone number</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller, index) => (
                <tr key={index} style={getStatusCellStyle(seller.orderStatus)}>
                  <td>{seller.ID}</td>
                  <td>{seller.email}</td>
                  <td>
                    {seller.firstName} {seller.lastName}
                  </td>
                  <td>{seller.phoneNumber}</td>
                  <td>{seller.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sellers;
