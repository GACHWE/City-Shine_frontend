import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const HelpFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "To place an order, browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or checkout as a guest."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept instant payment via MPESA and Cash on delivery (Visa, MasterCard, and bank transfers are also available for cash on delivery or in-person purchases at any of our shops). All transactions are processed in Kenyan Shillings (KES)."
    },
    // More FAQs...
  ];
  
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
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
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">Help & FAQ</h1>
          <p className="text-gray-600 dark:text-gray-400">Find answers to common questions about our products and services</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Contact Information</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-medium">Customer Service Hours:</span> Monday - Saturday, 8:00 AM - 5:00 PM & Sunday, 12:00 PM - 5:00 PM  
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-medium">Phone:</span> 011 440 9633
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-medium">Email:</span> support@cityshine.co.ke
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Address:</span> Nairobi, Kenya
              </p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <button
                    className="flex justify-between items-center w-full px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${
                        activeIndex === index ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeIndex === index && (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpFAQ;