// eslint-disable-next-line no-unused-vars
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
   
  useEffect(() => {
    verifyPremiumUser();
  },[])
   const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });

    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };

  const handleBuyClick = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      {
        membershipType: type,
      },
      {
        withCredentials: true,
      }
    );

    const { amount, keyId, currency, notes, orderId } = order.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "We Tinder",
      description: "Connect to other developers",
      order_id: orderId,
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.emailId,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
      handler: verifyPremiumUser,
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return isUserPremium ? (
  <div className="text-center text-white font-semibold text-lg my-10">
    You are already a premium member..!
  </div>
) : (
  <div className="px-4 py-8">
    <h1 className="text-white text-2xl font-bold text-center mb-6">
      Choose Your Membership
    </h1>

    <div className="flex flex-col items-center gap-6">
      {/* Silver Plan */}
      <div className="bg-base-300 rounded-xl w-full max-w-sm p-6 shadow-lg space-y-4">
        <h2 className="text-white text-xl font-bold text-center">Silver Membership</h2>
        <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
          <li>Chat with other people</li>
          <li>100 connection requests per day</li>
          <li>Blue Tick</li>
          <li>3 months</li>
        </ul>
        <button
          onClick={() => handleBuyClick("silver")}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded transition"
        >
          Buy Silver
        </button>
      </div>

      {/* Gold Plan */}
      <div className="bg-base-300 rounded-xl w-full max-w-sm p-6 shadow-lg space-y-4">
        <h2 className="text-white text-xl font-bold text-center">Gold Membership</h2>
        <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
          <li>Chat with other people</li>
          <li>Unlimited connection requests per day</li>
          <li>Blue Tick</li>
          <li>6 months</li>
        </ul>
        <button
          onClick={() => handleBuyClick("gold")}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded transition"
        >
          Buy Gold
        </button>
      </div>
    </div>
  </div>
);


};

export default Premium;
