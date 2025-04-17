import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { uri } from "../../constants/constants";
import { Loader2 } from "../../common/loader";
import Toaster from "../../common/toaster";

function AdminLogin() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const [loading2,setLoading2]=useState(false)

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading2(true)
    try {
      const res = await axios.post(`${uri}/api/v1/admin/login`, { email, password }, {withCredentials: true });
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

  const handleOTPLogin = async (e) => {
    e.preventDefault();
    setLoading2(true)
    try {
      const res = await axios.post(`${uri}/api/v1/admin/login-part-2`, { email, otp },{withCredentials: true});
      if (res.status === 200) {
        Toaster(res.data.message,"success")
        navigate("/admin");
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
        onSubmit={step === 1 ? handleLogin : handleOTPLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled={step === 2}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        {step === 1 ? (
          <>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Send OTP
            </button>
            <div
              onClick={() => navigate("/admin/reset-password")}
              className="mt-2 text-sm text-blue-500 hover:underline cursor-pointer text-center"
            >
              Forgot password?
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Verify OTP & Login
            </button>
          </>
        )}
      </form>
    </div>
    </>
  );
}

export default AdminLogin;
