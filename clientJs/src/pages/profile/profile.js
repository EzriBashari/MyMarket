import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../components/Button";
import axios from "axios";
import ChangePassword from "./changePassword";
import EditProfile from "./editProfile";

library.add(fas);

const Profile = () => {
  const serializedState = sessionStorage.getItem("myStateKey");
  const myState = JSON.parse(serializedState);
  const [profile, setProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    role: "",
    isAdmin: "",
    phoneNumber: "",
    image: "",
  });

  const [edit, setEdit] = useState(false);
  
  function editPasswordClick() {
    setEdit(true);
  }
  function handleCancel() {
    setEdit(false);
  }

  const [editProfile, setEditProfile] = useState(false);
  function editProfileClick() {
    setEditProfile(true);
  }
  function handleCancelEditProfile() {
    setEditProfile(false);
  }

  useEffect(() => {
    if (myState !== undefined) {
      const fetchProfile = async () => {
        const serializedState = sessionStorage.getItem("myStateKey");
        const user = JSON.parse(serializedState);
        try {
          if (user === null) {
            console.log(" no user ");
            return;
          }
          const urlPath = "http://localhost:8080/api/profile/:" + user.userID;
          //console.log(urlPath);
          const res = await axios.get(urlPath);

          // Check if res.data exists and is an array with at least one element
          if (Array.isArray(res.data) && res.data.length > 0) {
            setProfile({
              email: res.data[0].email,
              firstName: res.data[0].firstName,
              lastName: res.data[0].lastName,
              address: res.data[0].address,
              role: res.data[0].role,
              isAdmin: res.data[0].isAdmin,
              phoneNumber: res.data[0].phoneNumber,
              image: res.data[0].image,
            });
          } else {
            // Handle the case when data is empty or not in the expected format
            console.error("Invalid response data:", res.data);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchProfile();
    }
  }, [myState]);

  //console.log(myState.role);
  const path = "images/" + profile.image.split("\\").pop();
  //console.log(profile);
  return (
    <div className={`${styles.main}`}>
      {myState !== null ? (
        <div className={`${styles.parent}`}>
          {!editProfile ? (
            <div className={`${styles.container}`}>
              <div className={`${styles.group}`}>
                <img
                  src={path}
                  className={`${styles.image}`}
                  alt="something is not working"
                />
              </div>
              <div className={`${styles.group}`}>
                <h2 className={`${styles.h2}`}>
                  <FontAwesomeIcon icon="user" /> {profile.firstName}{" "}
                  {profile.lastName}
                </h2>
                <p>
                  <FontAwesomeIcon icon="envelope" /> {profile.email}
                </p>
                <p>
                  <FontAwesomeIcon icon="phone" /> {profile.phoneNumber}
                </p>
                <p>
                  <FontAwesomeIcon icon="home" /> {profile.address}
                </p>
                {edit && (
                  <div>
                    <ChangePassword setEdit={setEdit} />
                    <Button text="cancel" onClick={handleCancel} />
                  </div>
                )}
              </div>
              <div className={`${styles.group}`}>
                <Button text="my orders" link="/orders" />
                <Button text="Edit profile" onClick={editProfileClick} />
                {!edit && (
                  <Button text="change password" onClick={editPasswordClick} />
                )}
                
                {myState.isAdmin === 1 && (
                  <Button text="edit categories" link="/addCategory" />
                )}
              </div>
            </div>
          ) : (
            <div>
              <EditProfile profile={profile} cancel={handleCancelEditProfile} />
            </div>
          )}
        </div>
      ) : (
        <div className={`${styles.warning}`}>
          <h2>NO user logged in</h2>
          <div className={`${styles.button}`}>
            <Button text="login" link="/login" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
