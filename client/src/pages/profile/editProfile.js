import React from "react";
import styles from "./Profile.module.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../components/Button";
import { useState } from "react";
import axios from "axios";
import Error from "../../components/error";

const EditProfile = ({ profile, cancel }) => {
  const { email, firstName, lastName, address, phoneNumber, image } = profile;
  const [error, setError] = useState(false);
  const [content, setContent] = useState("");
  const path = "images/" + profile.image.split("\\").pop();

  const [editedProfile, setEditedProfile] = useState({
    email: email,
    firstName: firstName,
    lastName: lastName,
    address: address,
    phoneNumber: phoneNumber,
    image: image,
  });
  const handleClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", editedProfile.email);
    formData.append("firstName", editedProfile.firstName);
    formData.append("lastName", editedProfile.lastName);
    formData.append("address", editedProfile.address);
    formData.append("phoneNumber", editedProfile.phoneNumber);

    if (editedProfile.image) {
      formData.append("file", editedProfile.image);
    }
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/updateProfile",
        formData
      );
      // console.log(data);
      if (data.Error !== "") {
        setError(true);
        setContent(data.Error);
      }
      if (data.Status === "Success") {
        setError(false);
        setContent("");
        cancel();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const code = (
    <div className={`${styles.container}`}>
      <div className={`${styles.group}`}>
        <img
          src={path}
          className={`${styles.image}`}
          alt="something is not working"
        />
      </div>

      <form
        className={styles.group}
        encType="multipart/form-data" // Add the enctype attribute to the form
      >
        <div className={`${styles.group}`}>
          <div className={`${styles.group}`}>
            <h2 className={`${styles.h2}`}>
              <FontAwesomeIcon icon="envelope" /> {editedProfile.email}
            </h2>
          </div>
          <div className={`${styles.group}`}>
            <FontAwesomeIcon icon="user" />{" "}
            <input
              value={editedProfile.firstName}
              type="text"
              placeholder="first name"
              name="firstName"
              onChange={(e) =>
                setEditedProfile({
                  ...editedProfile,
                  firstName: e.target.value,
                })
              }
            />
          </div>
          <div className={`${styles.group}`}>
            <FontAwesomeIcon icon="user" />{" "}
            <input
              value={editedProfile.lastName}
              type="text"
              placeholder="last name"
              name="lastName"
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, lastName: e.target.value })
              }
            />
          </div>

          <div className={`${styles.group}`}>
            <FontAwesomeIcon icon="phone" />{" "}
            <input
              value={editedProfile.phoneNumber}
              type="text"
              placeholder="phone number"
              name="phoneNumber"
              onChange={(e) => {
                // console.log(parseInt(e.target.value));
                // console.log(isNaN(parseInt(e.target.value)));
                if (!isNaN(parseInt(e.target.value)) || e.target.value === "") {
                  setEditedProfile({
                    ...editedProfile,
                    phoneNumber: e.target.value,
                  });
                } else {
                  setEditedProfile({
                    ...editedProfile,
                    phoneNumber: "",
                  });
                }
              }}
            />
          </div>

          <div className={`${styles.group}`}>
            <FontAwesomeIcon icon="home" />{" "}
            <input
              value={editedProfile.address}
              type="text"
              placeholder="address"
              name="address"
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, address: e.target.value })
              }
            />
          </div>
          <div className={`${styles.group}`}>
            <FontAwesomeIcon icon="image" />{" "}
            <input
              type="file"
              placeholder="image"
              name="file"
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, image: e.target.files[0] })
              }
            />
          </div>
          <div>{error && <Error content={content} />}</div>
          <Button text="Update" onClick={handleClick} type="submit" />
          <Button text="cancel" onClick={cancel} />
        </div>
      </form>
    </div>
  );
  return <div>{code}</div>;
};

export default EditProfile;
