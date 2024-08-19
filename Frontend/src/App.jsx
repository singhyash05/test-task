import React from 'react';
import Navbar from '../src/components/Navbar.jsx';

const App = () => {
  return (
    <>
      <div className="navbarDiv mb-20">
        <Navbar />
      </div>
      <div className="pt-16 mt-10 flex flex-col items-center">
        <p className="font-serif text-center font-semibold text-3xl mb-8">
          "We're generating customized NDAs swiftly and 
          <span className=" text-lime-600"> cost-effectively</span>, 
          <span className=" text-cyan-500"> ensuring precision </span> 
          and <span className="text-red-500">affordability</span>."
        </p>
      </div>
      <div className="mt-10 flex flex-col items-center">
        <p className="font-serif text-center text-4xl mb-8">
          - User-Friendly NDA Creation Process
          <br />
          - Secure and Efficient Data Handling
          <br />
          - Sleek Design with User-Centric Features
        </p>
      </div>
      <div className="my-10">
        <hr className="border-t border-gray-300 mx-auto w-3/4 md:w-1/2 lg:w-1/3" />
      </div>
      <div className="mt-20 flex flex-col items-center text-center px-4">
        <h2 className="font-serif text-2xl font-bold mb-6">How to Use Our Website</h2>
        <ol className="font-serif text-lg">
          <li className="mb-4">1. Login/Register to create your account.</li>
          <li className="mb-4">2. Choose from the following options:
            <ul className="list-disc ml-6 mt-2">
              <li>Generate NDA</li>
              <li>View Previous NDAs</li>
            </ul>
          </li>
          <li>3. To generate an NDA, simply use our chatbot for an easy and guided process.</li>
        </ol>
      </div>
    </>
  );
}

export default App;
