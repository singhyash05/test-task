import React from 'react';
import image from '../src/assets/image.png'; // Import the image file

const LoginPage = () => {
  return (
    <div className="flex h-screen">
      {/* Left side: Form */}
      <div className="w-1/2 flex items-center justify-center bg-gray-100 p-10">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold font-extralight mb-6 text-center">Login</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Right side: Photo */}
      <div
        className="w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        {/* You can also add additional styling or content here */}
      </div>
    </div>
  );
}

export default LoginPage;
