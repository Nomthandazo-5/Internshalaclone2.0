import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "https://internshalaclone2-0-1.onrender.com/api/admin/forgotpassword",
        { username }
      );
      alert("Reset token: " + res.data.token);
      // Optional redirect
      window.location.href = `/resetpassword/${res.data.token}`;
    } catch (err) {
      alert("Admin not found");
    }
  };
  return (
    <div>
      <h2>Forgot Password</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSubmit}>
        Send Reset Link
      </button>
    </div>
  );
}