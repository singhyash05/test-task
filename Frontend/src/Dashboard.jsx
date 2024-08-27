import React from 'react';
import backgroundImage from '../src/assets/back2.png'; // Import the background image
import { useNavigate } from 'react-router-dom'


const Dashboard = () => {
  const navigate = useNavigate()
  const handleGenerate = function (){
    navigate('/generateNDA')
  }

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg text-center">
        <h2 className="text-3xl font-light mb-8">Dashboard</h2>
        <div className="space-y-4">
          <button
            onClick={handleGenerate}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Generate NDA
          </button>
          <button
            onClick={() => alert('View Previous NDAs Clicked')}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            View Previous NDAs
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
