import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaAward, FaUsers, FaShippingFast, FaHeadset } from 'react-icons/fa';
import Logo from "../../assets/img/Logo.webp";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
        </div>

        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-full w-40 h-40 md:w-80 md:h-80 mx-auto mb-4 flex items-center justify-center">
            <img src={Logo} alt='' className='md:w-72 md:h-72' />
          </div>
          <h1 className="text-4xl font-bold text-blue-500 dark:text-blue-400 mb-2">CityShine Electronics</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Illuminating Kenyan Homes Since 2010</p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <div className="prose max-w-none dark:prose-invert">
            {/* Our Story */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Founded in 2010, CityShine Electronics has been at the forefront of providing quality home appliances 
                to Kenyan households. What started as a small family business in Nairobi has grown into one of 
                Kenya's most trusted electronics retailers.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Our mission is simple: to bring reliable, energy-efficient, and affordable home appliances that 
                make everyday life easier for Kenyan families.
              </p>
            </section>

            {/* What We Offer */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">What We Offer</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Kitchen Appliances</h3>
                  <p className="text-gray-600 dark:text-gray-400">Refrigerators, Cookers, Microwaves, Blenders, and more</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Home Comfort</h3>
                  <p className="text-gray-600 dark:text-gray-400">Air Conditioners, Heaters, Fans, and Water Dispensers</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Cleaning Solutions</h3>
                  <p className="text-gray-600 dark:text-gray-400">Vacuum Cleaners, Washing Machines, and Iron Boxes</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Entertainment</h3>
                  <p className="text-gray-600 dark:text-gray-400">Televisions, Sound Systems, and Home Theater</p>
                </div>
              </div>
            </section>

            {/* Why Choose Us */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Why Choose CityShine?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <FaAward className="text-blue-600 dark:text-blue-400 text-3xl mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Quality Guarantee</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">All products come with warranty and quality assurance</p>
                </div>
                <div className="text-center">
                  <FaUsers className="text-blue-600 dark:text-blue-400 text-3xl mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Expert Support</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Knowledgeable staff to guide your purchases</p>
                </div>
                <div className="text-center">
                  <FaShippingFast className="text-blue-600 dark:text-blue-400 text-3xl mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Nationwide Delivery</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Free delivery across major cities in Kenya</p>
                </div>
                <div className="text-center">
                  <FaHeadset className="text-blue-600 dark:text-blue-400 text-3xl mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">After-Sales Service</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Reliable maintenance and repair services</p>
                </div>
              </div>
            </section>

            {/* Our Values */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Our Values</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Customer First</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We prioritize our customers' needs and strive to exceed expectations in every interaction.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Quality Assurance</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Every appliance we sell undergoes rigorous quality checks to ensure durability and performance.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Kenyan Pride</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    As a Kenyan-owned business, we're committed to contributing to our nation's growth and development.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ready to upgrade your home? Visit us today!
          </p>
          <a 
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;