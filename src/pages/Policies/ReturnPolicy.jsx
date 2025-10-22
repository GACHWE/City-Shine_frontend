import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">Return Policy</h1>
          <p className="text-gray-600 dark:text-gray-400">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="prose max-w-none dark:prose-invert">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">1. Returns</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We accept returns within 14 days of receipt of items for most products in original condition. 
                To be eligible for a return, your item must be unused and in the same condition that you received it.
              </p>
            </section>
            
            {/* Rest of the return policy content */}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;