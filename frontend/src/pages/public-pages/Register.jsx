import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useRegisterApiMutation, useDuplicateUserIdCheckerApiMutation } from '../../services/LoginRegisterApi';
import { useNavigate } from 'react-router';
function Register() {
  const [registerApi, { isLoading }] = useRegisterApiMutation();
  const [duplicateUserIdCheckerApi] = useDuplicateUserIdCheckerApiMutation();
  const [errorResponse, setErrorResponse] = useState();
  const [userIdDuplicateResponse, setUserIdDuplicateResponse] = useState();
  const [userId, setUserId] = useState();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ mode: 'onChange' });

  useEffect(() => {
    if (!userId || userId.trim() === "" || userId.includes(' ')) {
      setUserIdDuplicateResponse("");
      return;
    }

    let debounceTimer = setTimeout(async () => {
      const response = await duplicateUserIdCheckerApi({ userId });
      if (response.error) {
        setUserIdDuplicateResponse(response.error.data.status);
      } else {
        setUserIdDuplicateResponse(response.data.status);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [userId]);

  const onSubmit = async (data) => {
    data.role = "user";
    const response = await registerApi(data);
    if (response.error) {
      setErrorResponse(response.error.data.status);
    }else{
      alert("New user Created");
      navigate("/unified-health-tech/login");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center 
     bg-[#273953]
      px-4 sm:px-6 md:px-8">
      
      <div className="text-center mb-8 text-white drop-shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-semibold">Unified Health Tech Solutions</h1>
        <p className="mt-1 text-sm sm:text-base opacity-90">...</p>
      </div>

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white shadow-xl rounded-lg p-5 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md space-y-5"
      >

        {/* User ID */}
        <div className="relative">
          <label className="block text font-medium text-gray-700 mb-1">User ID</label>
          <input
            {...register('userId', {
              required: 'User ID is required',
              pattern: {
                value: /^[^\s]+$/,
                message: 'User ID must not contain spaces'
              }
            })}
            onChange={(e) => setUserId(e.target.value)}
            value={userId || ''}
            className="w-full border border-purple-300 rounded-lg px-3 py-2 pr-10 
              focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm sm:text-base"
            placeholder="Enter your user ID"
          />
          {userIdDuplicateResponse && userIdDuplicateResponse.toLowerCase() === "ok" && (
            <span className="absolute right-3 top-8 text-green-500 text-lg">✔</span>
          )}
          {userIdDuplicateResponse && userIdDuplicateResponse.toLowerCase() !== "ok" && (
            <p className="text-xs sm:text-sm text-red-500">{userIdDuplicateResponse}</p>
          )}
          {errors.userId && <p className="text-xs sm:text-sm text-red-500">{errors.userId.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text font-medium text-gray-700 mb-1">Email</label>
          <input
          type='email'
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
        </div>

        {/* Password */}
        <div>
          <label className="block text font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
                message: 'Password must contain at least one uppercase letter and one special character'
              },
              minLength: { value: 8, message: "Password should contain at least 8 characters" }
            })}
            className="w-full border border-purple-300 rounded-lg px-3 py-2 
              focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm sm:text-base"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-xs sm:text-sm text-red-500">{errors.password.message}</p>}
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          disabled={isSubmitting || isLoading} 
          className="w-full bg-[#57FFFC69] 
            lg:text-xl  py-2 rounded-lg transition duration-200
            disabled:opacity-50  sm:text-base border-1
            cursor-pointer"

        >
          {isSubmitting || isLoading ? 'Registering...' : 'Register'}
        </button>

        {errorResponse && <p className="text-xs sm:text-sm text-red-500 text-center">{errorResponse}</p>}
         {/* Link */}
      </form>
         <div className='login mt-8'>
        <p className="text-xs sm:text-sm text-white text-center">
          Already have an account?{' '}
          <a href="/unified-health-tech/login" className="text-[#9485FF] hover:underline">Login</a>
        </p>
        </div>
    </div>
  );
}

export default Register;
