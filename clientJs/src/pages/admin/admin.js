import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import styles from "./admin.module.css";
import axios from "axios";
import Sellers from "./charts/sellers";
import { Button } from "../../components/Button";

const Admin = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [enterysData, setEnterysData] = useState([]);
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [sellersEmails, setSellersEmails] = useState([]);
  const [tax, setTax] = useState(0);
  const [oldTax, setOldTax] = useState(0);
  const [emailInfo, setEmailInfo] = useState({
    email: "",
    subject: "",
    text: "",
  });

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/sellersRevenue"
        );
        setRevenueData(response.data); // Update state with fetched data
      } catch (err) {
        console.log("Error", err);
      }
    };
    const fetchEnterys = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/usersEnterys"
        );
        console.log(response.data.users);
        setUsers(response.data.users);
        setSellers(response.data.sellers);
        setEnterysData(response.data.data);
        // console.log(enterysData);
      } catch (err) {
        console.log("Error", err);
      }
    };
    const fetchSellersEmail = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/fetchSellersEmail"
        );
        setSellersEmails(response.data);
        console.log(response.data);
      } catch (err) {
        console.log("Error", err);
      }
    };
    async function handleChangeTax() {
      try {
        const res = await axios.post("http://localhost:8080/api/importTax");
        setOldTax(res.data[0].tax_price);
      } catch (err) {
        console.log("Error", err);
      }
    }

    handleChangeTax();
    fetchSellersEmail();
    fetchEnterys();
    fetchRevenue();
  }, []);
  async function handleChangeTax() {
    setOldTax(tax);
    try {
      await axios.post("http://localhost:8080/api/setTax", { tax: tax });
      setTax(0);
    } catch (err) {
      console.log("Error", err);
    }
  }
  async function handleSendMail() {
    try {
      await axios.post("http://localhost:8080/api/sendMail", emailInfo);
    } catch (err) {
      console.log("Error", err);
    }
  }

  return (
    <div className={styles}>
      <div className={styles.allBox}>
        <div className={styles.managementBox}>
          <h2>Users</h2>
          <div className={styles.data}>
            <p>Number of users in the website: {users}</p>
            <p>Number of sellers in the website: {sellers}</p>
          </div>
        </div>
        <div className={styles.managementBox}>
          <h2>Change Tax</h2>
          <div className={styles.data}>
            <p>Current tax: {oldTax}%</p>
          
            <input
              placeholder="Enter tax"
              value={tax > 0 ? tax : ""}
              onChange={(e) => {
                if (!isNaN(parseInt(e.target.value)) && e.target.value >= 0)
                  setTax(e.target.value);
                else setTax(0);
              }}
            />
            <Button text="Set Tax" onClick={handleChangeTax} />
          </div>
        </div>
        <div className={styles.managementBox}>
          <h2>E-mail to sellers</h2>
          <select
            onChange={(e) =>
              setEmailInfo({ ...emailInfo, email: e.target.value })
            }
          >
            {sellersEmails.map((email) => (
              <option key={email.ID}>{email.email}</option>
            ))}
            <option>ezbishari@gmail.com</option>
          </select>
          <input className={styles.input}
            placeholder="Enter Subject"
            type="text"
            onChange={(e) =>
              setEmailInfo({ ...emailInfo, subject: e.target.value })
            }
          />
          <input
            placeholder="Enter email content"
            type="text"
            onChange={(e) =>
              setEmailInfo({ ...emailInfo, text: e.target.value })
            }
          />
          <Button text="Send Mail" onClick={handleSendMail} />
        </div>
      </div>
      <div className={styles.managementBox}>
        <div className="row">
          <div className="col-md-12">
            <h2>Enterys</h2>
          </div>

          <div className="section col-md-6">
            <h3 className="section-title">Line Chart</h3>
            <div className="section-content">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={enterysData}
                  margin={{ top: 15, right: 0, bottom: 15, left: 0 }}
                >
                  <Tooltip />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="login_count"
                    stroke="#FB8833"
                  />
                  <Line
                    type="monotone"
                    dataKey="order_count"
                    stroke="#17A8F5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="section col-md-6">
            <h3 className="section-title">Top 5 sellers</h3>
            <div className="section-content">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={revenueData}
                  margin={{ top: 15, right: 0, bottom: 15, left: 0 }}
                >
                  <XAxis dataKey="seller_firstName" />
                  <YAxis />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total_revenue" fill="#388C00" />
                  <Bar dataKey="total_products" fill="#17A8F5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.managementBox}`}>
        <Sellers />
      </div>
    </div>
  );
};

export default Admin;
