import React, { useState } from "react";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [error, setError] = useState("");
  const [showtoast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.put(
        `${BASE_URL}/profile/edit`,
        { firstName, lastName, photoUrl, age, gender, about },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      setError(error?.response?.data || "Something went wrong.");
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 px-4 py-10">
        {/* Edit Form */}
        <div className="card bg-base-300 w-full max-w-md shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center text-white text-2xl mb-4">
              Edit Profile
            </h2>
            <div>
              {[
                { label: "First Name", value: firstName, setValue: setFirstName },
                { label: "Last Name", value: lastName, setValue: setLastName },
                { label: "Photo Url", value: photoUrl, setValue: setPhotoUrl },
                { label: "Age", value: age, setValue: setAge },
                { label: "Gender", value: gender, setValue: setGender },
                { label: "About", value: about, setValue: setAbout },
              ].map((field, index) => (
                <label key={index} className="form-control w-full my-2 text-white">
                  <div className="label">
                    <span className="label-text text-white">{field.label}</span>
                  </div>
                  <input
                    type="text"
                    value={field.value}
                    className="input input-bordered w-full"
                    onChange={(e) => field.setValue(e.target.value)}
                  />
                </label>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-primary w-full" onClick={saveProfile}>
                Save Profile
              </button>
            </div>
          </div>
        </div>

        {/* User Preview Card */}
        <div className="w-full max-w-sm">
          <UserCard
            user={{ firstName, lastName, photoUrl, age, gender, about }}
            hideActions={true}
          />
        </div>
      </div>

      {/* Toast Notification */}
      {showtoast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
