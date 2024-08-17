import './App.css';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <div className="content">
  <div className="background-container"></div>
  <div className="text-content relative z-10">
    <h2 className="text-white text-5xl text-outline font-extrabold italic text-center p-4">
      Generate Your NDA in Minutes
    </h2>
    <p className="text-lg text-white mt-4 text-outline">
      Quickly create a legally binding Non-Disclosure Agreement tailored to your specific needs. Protect your confidential information with ease.
    </p>
  </div>
</div>

<div className="content2">
  <h3 className="text-xl font-bold mb-4">Why Choose Our NDA Generator?</h3>
  <ul className="list-disc pl-5 space-y-2">
    <li>Customizable templates tailored to your requirements</li>
    <li>User-friendly interface for seamless document creation</li>
    <li>Instantly downloadable and ready to sign</li>
  </ul>
  <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
    Start Creating Your NDA
  </button>
</div>

    </>
  );
}

export default App;
