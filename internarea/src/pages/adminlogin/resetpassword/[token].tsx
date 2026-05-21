import { useRouter } from "next/router";
import { useState } from "react";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const handleReset = async () => {
    const res = await fetch("http://localhost:5000/api/admin/resetpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });
    const data = await res.json();
    alert(data);
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={handleReset}>
        Reset Password
      </button>
    </div>
  );
}