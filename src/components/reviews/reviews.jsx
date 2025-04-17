import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { uri } from '../../constants/constants';
import Loader, { Loader2 } from '../../common/loader';
import Toaster from '../../common/toaster';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', description: '', stars: 5, otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [message, setMessage] = useState('');

  const [loading,setLoading]=useState(false)
  const [loading2,setLoading2]=useState(false)
  // Fetch approved reviews

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${uri}/approved-reviews`);
      setReviews(res.data.data);
    } catch (err) {
      Toaster(err.response.data.message,"error")
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

// useEffect(() => {
//     const dummyReviews = [
//         { name: "Alice", description: "Amazing experience!", stars: 5 },
//         { name: "Bob", description: "Pretty good service.", stars: 4 },
//         { name: "Charlie", description: "Could be improved.", stars: 3 },
//         { name: "David", description: "Did not like the service.", stars: 2 },
//         { name: "Eve", description: "Perfect place for peace.", stars: 5 },
//         { name: "Frank", description: "Friendly staff!", stars: 4 },
//         { name: "Grace", description: "Satisfying overall.", stars: 4 },
//         { name: "Heidi", description: "Not up to the mark.", stars: 2 },
//         { name: "Ivan", description: "Great ambiance!", stars: 5 },
//         { name: "Judy", description: "Service was slow.", stars: 3 },
//     ];
//     setReviews(dummyReviews);
// }, []);

  // Handle form input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleStarClick = (star) => setForm({ ...form, stars: star });

  const handleCaptcha = (value) => {
    if (value) setCaptchaVerified(true);
  };

  const handleSendOTP = async () => {
    if (!captchaVerified) return alert("Please verify captcha");
    setLoading2(true)
    try {
      const res=await axios.post(`${uri}/review-initiate`, {
        name: form.name,
        contact: form.contact,
        description: form.description,
        stars: form.stars
      });
      setOtpSent(true);
      setMessage("OTP sent to your email");
      Toaster(res.data.message,"success")
    } catch (err) {
      Toaster(err.response.data.message,"error")
    }
    finally {
      setLoading2(false)
    }
  };

  const handleVerifyOTP = async () => {
    setLoading2(true)
    try {
      const res=await axios.post(`${uri}/review-verify`, {
        contact: form.contact,
        otp: form.otp
      });
      fetchReviews()
      setMessage("Review submitted successfully");
      setShowForm(false);
      setForm({ name: '', contact: '', description: '', stars: 0, otp: '' });
      setOtpSent(false);
      Toaster(res.data.message,"success")
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
      {loading?(<Loader></Loader>):(<>
      <div className="p-6 max-w-3xl mx-auto relative">
        
        {showForm && (
        <form
            className="sticky top-25 p-4 bg-gray-200 rounded-lg shadow-lg mt-12"
            onSubmit={(e) => {
            e.preventDefault(); // prevents browser reload
            if (!otpSent) {
                {loading?<Loader2></Loader2>:(<></>)}
                handleSendOTP(); // calls your OTP function
            } else {
                {loading?<Loader2></Loader2>:(<></>)}
                handleVerifyOTP(); // calls your review submission function
            }
            }}
        >
            <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full p-2 mb-2 border rounded"
            value={form.name}
            onChange={handleChange}
            required
            />

            <input
            type="email"
            name="contact"
            placeholder="Email"
            className="w-full p-2 mb-2 border rounded"
            value={form.contact}
            onChange={handleChange}
            required
            />

            <textarea
            name="description"
            placeholder="Your Review"
            className="w-full p-2 mb-2 border rounded"
            value={form.description}
            onChange={handleChange}
            required
            ></textarea>

            {/* Star Rating */}
            <div className="flex space-x-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                key={star}
                className={`text-2xl cursor-pointer ${form.stars >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                onClick={() => handleStarClick(star)}
                >
                ★
                </span>
            ))}
            </div>

            {/* reCAPTCHA */}
            <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // test key
            onChange={handleCaptcha}
            />

            {/* OTP Input */}
            {otpSent && (
            <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                className="w-full p-2 my-3 border rounded"
                value={form.otp}
                onChange={handleChange}
                required
            />
            )}

            {/* Submit Button */}
            <button
            type="submit"
            className={`px-4 py-2 mt-4 rounded text-white ${
                otpSent ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-green-500 hover:bg-green-600'
            }`}
            >
            {otpSent ? 'Submit Review' : 'Send OTP'}
            </button>

            {/* Feedback */}
            {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
        </form>
        )}

      {/* Approved Reviews List */}
      <div className="mt-10 space-y-4">
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">{review.name}</h3>
            <p>{review.description}</p>
            <div className="text-yellow-500">{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</div>
          </div>
        ))}
      </div>
      <div className="sticky bottom-4 flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
            >
            {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>
    </div></>)}
    </>
  );
};

export default Reviews;
