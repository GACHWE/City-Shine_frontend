import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-400">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="prose max-w-none dark:prose-invert">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">1. Information We Collect</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                At City-Shine, we collect information you provide directly to us, including when you create an account, 
                make a purchase, or contact us for support. This may include:
              </p>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 mb-4">
                <li>Personal identification information (Name, email address, phone number and delivery address)</li>
                <li>Payment information (MPESA details)</li>
                <li>Communication preferences</li>
              </ul>
            </section>
            
            {/* Rest of the privacy policy content */}
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">5. Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Email: privacy@cityshine.co.ke<br />
                Phone: 011 440 9633<br />
                Address: Nairobi, Kenya
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;