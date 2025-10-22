import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoading } from '../../store/features/common';
import { verifyAPI } from '../../api/authentication';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { saveToken } from '../../utils/jwt-helper';

const VerifyCode = ({ email }) => {
  const [values, setValues] = useState({
    userName: email,
    code: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    setError('');
    
    if (!values.code || values.code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    dispatch(setLoading(true));
    verifyAPI(values)
      .then(res => {
        if (res?.token) {
          saveToken(res.token);
          setMessage('Thank you! Your email has been successfully verified. You can now access your account.');
          
          // Redirect to account page after 2 seconds
          setTimeout(() => {
            navigate('/account-details');
          }, 2000);
        } else {
          setMessage('Verification successful! Redirecting to your account...');
          setTimeout(() => {
            navigate('/account-details');
          }, 1500);
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || 'The verification code is incorrect or has expired.');
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch, values, navigate]);

  const handleOnChange = useCallback((e) => {
    e.persist();
    setValues(values => ({
      ...values,
      [e.target.name]: e.target?.value,
    }));
  }, []);

  const handleBack = () => {
    // This would typically go back to registration
    window.location.reload();
  };

  return (
    <div className="w-full">
      {!message ? (
        <>
          <button
            onClick={handleBack}
            className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 mb-6 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to registration
          </button>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Email</h1>
            <p className="text-gray-600 dark:text-gray-400">
              We've sent a 6-digit code to <span className="font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={values.code}
                onChange={handleOnChange}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-xl tracking-widest focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Verify Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the code?{' '}
              <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors">
                Resend code
              </button>
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
            <FaCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          <div className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 dark:border-indigo-400 mr-2"></div>
            Redirecting to your account...
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCode;