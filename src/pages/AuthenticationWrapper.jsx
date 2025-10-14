import React from 'react';
import Navigation from '../components/Navigation/Navigation';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner/Spinner';

const AuthenticationWrapper = () => {
  const isLoading = useSelector((state) => state?.commonState?.loading);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation variant="auth" />
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
        {/* Left side - Image */}
        <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-indigo-600 to-purple-700 p-8">
          <div className="flex flex-col justify-center items-center text-white w-full">
            <h1 className="text-4xl font-bold mb-6 text-center">Welcome to Our Store</h1>
            <p className="text-xl text-indigo-100 text-center max-w-md">
              Discover amazing products and exclusive deals. Join thousands of satisfied customers today.
            </p>
            <div className="mt-12 grid grid-cols-3 gap-4 opacity-90">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-24 bg-white/20 rounded-xl backdrop-blur-sm"
                  style={{ animationDelay: `${item * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
      {isLoading && <Spinner />}
    </div>
  );
};

export default AuthenticationWrapper;