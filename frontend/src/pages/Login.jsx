import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useLoginApiMutation } from '../services/LoginRegisterApi';

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: 'onChange' });
  const [loginApi, {isLoading}] = useLoginApiMutation();
  const [userData, setUserData] = useState();
  const [passwordErrorResponse, setPasswordErrorResponse] = useState();
  const [userErrorResponse, setUserErrorResponse] = useState();
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");

  const onSubmit = async (data) => {
    const response = await loginApi(data);
    if(response.error && response.error.data.status === "User does not exist"){
      setPasswordErrorResponse("")
      setUserErrorResponse(response.error.data.status);
    } else if(response.error && response.error.data.status === "Invalid Password") {
      setUserErrorResponse("");
      setPasswordErrorResponse(response.error.data.status);
    }
    else{
      // Data initialization immediately to avoid asynchronous initialization and avoid double click for login
      const {role, userId} = response.data.status;
      setRole(role);
      setUserId(userId);
      if(role === "user"){
        navigate(`/unified-health-tech/user/dashboard/${userId}`)
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center 
      bg-[#273953]
      px-4 sm:px-6 md:px-8">

      {/* Title Section */}
      <div className="text-center mb-8 text-white drop-shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-semibold">Welcome Back</h1>
        <p className="mt-1 text-sm sm:text-base opacity-90">Login to continue and manage your account</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-xl rounded-lg p-5 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md space-y-5 drop-shadow-2xl"
      >
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('emailId', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address'
              }
            })}
            className="w-full border border-purple-300 rounded-lg px-3 py-2 
              focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm sm:text-base"
            placeholder="you@example.com"
          />
          {errors.emailId && <p className="text-xs sm:text-sm text-red-500">{errors.emailId.message}</p>}
          {userErrorResponse && <p className="text-xs sm:text-sm text-red-500">{userErrorResponse}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
            })}
            className="w-full border border-purple-300 rounded-lg px-3 py-2 
              focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm sm:text-base"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-xs sm:text-sm text-red-500">{errors.password.message}</p>}
          {passwordErrorResponse && <p className="text-xs sm:text-sm text-red-500">{passwordErrorResponse}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#57FFFC] 
             font-medium py-2 rounded-lg transition duration-200 
            disabled:opacity-50 text-sm sm:text-base shadow-md
            cursor-pointer"
        >
          {isSubmitting || isLoading ? 'Logging in...' : 'Login'}
        </button>

        {/* Link */}
        <p className="text-xs sm:text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <a href="/unified-health-tech/register" className="text-rose-500 hover:underline">Sign up</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
