import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      dispatch(addConnections(res.data.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

if (connections.length === 0)
  return <h1 className="text-center my-10 text-white">No Connections Found</h1>;

return (
  <div className="my-10 px-4 pb-40 min-h-screen">
    <h1 className="text-center font-bold text-white text-3xl mb-6">
      Connections
    </h1>
    <div className="flex flex-col gap-6 items-center">
      {connections.map((connection) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;
        return (
          <div
            key={_id}
            className="flex flex-col sm:flex-row items-center bg-base-300 p-4 rounded-lg w-full max-w-2xl shadow-md"
          >
            <img
              className="w-24 h-24 rounded-full object-cover mb-4 sm:mb-0 sm:mr-6"
              alt="photo"
              src={photoUrl}
            />
            <div className="text-center sm:text-left">
              <h2 className="font-bold text-xl text-white">
                {firstName + " " + lastName}
              </h2>
              {age && gender && (
                <p className="text-gray-300">{age + ", " + gender}</p>
              )}
              <p className="text-gray-400 mb-2">{about}</p>
              <Link to={`/chat/${_id}`}>
                <button className="btn btn-primary">Chat</button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
};

export default Connections;
