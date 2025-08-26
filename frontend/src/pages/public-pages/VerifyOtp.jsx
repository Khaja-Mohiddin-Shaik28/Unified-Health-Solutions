import React, { useState } from 'react';
import { useVerifyOtpApiMutation } from '../../services/LoginRegisterApi';
import { useSearchParams, useNavigate } from 'react-router-dom';

function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emailId = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifyOtp] = useVerifyOtpApiMutation();

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);

      if (val && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      document.getElementById("otp-5").focus(); // move to last box
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    try {
      await verifyOtp({ emailId, otp: otpValue }).unwrap();
      alert('OTP verified successfully!');
      navigate('/unified-health-tech/login/reset-password?email=' + encodeURIComponent(emailId));
    } catch (err) {
      alert(err?.data?.status || 'OTP verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E2A3A] px-4">
      <div className="bg-white rounded-2xl p-8 sm:p-10 md:p-12 lg:p-16 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[50%] shadow-lg text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Unified Health Tech Solutions</h1>
        <p className="text-gray-600 mb-3 sm:mb-6 text-sm sm:text-base">Enter OTP</p>
        <p className="text-gray-500 text-xs sm:text-sm mb-8">We have sent an OTP to your email id</p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-6" onPaste={handlePaste}>
            {otp.map((val, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-base sm:text-lg md:text-xl"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-300 hover:bg-cyan-400 text-black py-2 sm:py-3 rounded-lg font-medium transition text-sm sm:text-base md:text-lg cursor-pointer"
          >
            Verify
          </button>
        </form>

        <p className="text-gray-500 mt-4 text-xs sm:text-sm md:text-base">
          Didn't receive code?{' '}
          <span className="text-cyan-400 cursor-pointer hover:underline">Resend OTP</span>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;
