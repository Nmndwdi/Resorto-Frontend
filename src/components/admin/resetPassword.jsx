import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { uri } from "../../constants/constants";
import { Loader2 } from "../../common/loader";
import Toaster from "../../common/toaster";

function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [loading2,setLoading2]=useState(false)

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading2(true)
    try {
      const res = await axios.post(`${uri}/api/v1/admin/reset-password`, { email }, {withCredentials: true });
      if (res.status === 200) {
        Toaster(res.data.message,"success")
        setStep(2);
      }
    } catch (err) {
      Toaster(err.response.data.message,"error")
    }
    finally {
      setLoading2(false)
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading2(true)
    try {
      const res = await axios.post(`${uri}/api/v1/admin/reset-password-part-2`, {
        email,
        otp,
        password: newPassword,
      }, {withCredentials: true });
      if (res.status === 200) {
        Toaster(res.data.message,"success")
        navigate("/admin/login");
      }
    } catch (err) {
      Toaster(err.response.data.message,"error")
    }
    finally {
      setLoading2(false)
    }
  };

  return (
    <>
    {loading2?(<Loader2></Loader2>):(<></>)}
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={step === 1 ? handleSendOTP : handleReset}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled={step === 2}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />
          </>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {step === 1 ? "Send OTP" : "Reset Password"}
        </button>
      </form>
    </div>
    </>
  );
}

export default ResetPassword;
