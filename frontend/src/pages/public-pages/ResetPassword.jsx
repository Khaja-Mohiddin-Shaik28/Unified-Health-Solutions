import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPasswordApiMutation } from '../../services/LoginRegisterApi';

function ResetPassword() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ mode: 'onChange' });
  const [resetPassword] = useResetPasswordApiMutation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailId = searchParams.get('email') || '';

  const onSubmit = async (data) => {
    try {
        
      await resetPassword({ emailId, newPassword: data.password }).unwrap();
      alert("Password reset successfully!");
      navigate('/unified-health-tech/login');
    } catch (err) {
      console.error(err);
      alert(err?.data?.status || 'Failed to reset password. Try again.');
    }
  };

  const passwordValue = watch('password');

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#273953] px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl p-8 sm:p-10 md:p-12 lg:p-16 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[50%] shadow-lg"
      >
        {/* Headings */}
        <div className="text-center mb-6 drop-shadow-2xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Unified Health Tech Solutions</h1>
        </div>
        <div className="heading text-center mb-6">
          <p className='text-lg sm:text-xl md:text-2xl font-semibold mb-2'>Reset Password</p>
          <p className='text-xs sm:text-sm md:text-base text-gray-600'>
            Enter your new password to reset your account password
          </p>
        </div>

        {/* New Password */}
        <div className="password mb-4">
          <label className="block font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password should contain at least 8 characters' },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
                message: 'Password must contain at least one uppercase letter and one special character'
              }
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm sm:text-base md:text-base"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="password mb-4">
          <label className="block font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: value => value === passwordValue || 'Passwords do not match'
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm sm:text-base md:text-base"
            placeholder="••••••••"
            onPaste={(e) => e.preventDefault()} // disable paste
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cyan-300 hover:bg-cyan-400 text-black py-2 sm:py-3 rounded-lg font-medium transition mt-6 text-sm sm:text-base md:text-lg disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;