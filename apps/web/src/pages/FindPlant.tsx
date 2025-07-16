import React, { useState } from 'react'
import Component from '~/components/comp-544'
import Sidebar from '~/components/Sidebar'

const FindPlant = () => {
  // State to show results
  const [showResults, setShowResults] = useState(false);
  // State for button loading micro-interaction
  const [loading, setLoading] = useState(false);

  // Handler for Identify Plant button
  const handleIdentify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1500); // Simulate async work (1.5s)
  };

  return (
    <div className='min-h-screen w-full flex bg-[#F5E9DA] text-[#2D2D2D]'>
      <aside className="w-64 flex-shrink-0">
        <Sidebar />
      </aside>
      <div className='flex-1 flex justify-center items-center px-4 py-10'>
        <div className='max-w-md w-full bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center'>
          <h1 className="text-2xl flex items-center justify-center font-bold mb-2">Plant Identification</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Upload a photo of your plant to identify its species and get care tips.
          </p>
          <Component />
          <button
            className={`mt-6 w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors shadow-lg bg-[#5d55ee] hover:bg-[#574fd6] cursor-pointer flex items-center justify-center`}
            onClick={handleIdentify}
            disabled={loading}
          >
            {loading ? (
              <span className="loader mr-2"></span>
            ) : (
              "Identify Plant"
            )}
          </button>
          {/* Placeholder for results section */}
          {showResults && (
            <div className="mt-8 w-full">
              {/* Results will be shown here in the next step */}
              <div className="bg-[#F5E9DA] rounded-xl p-4 text-center text-gray-500 border border-dashed border-[#BFA2DB]">
                [Identification results will appear here]
              </div>
            </div>
          )}
          {/* Loader CSS for micro-interaction */}
          <style>{`
            .loader {
              border: 2px solid #fff;
              border-top: 2px solid #BFA2DB;
              border-radius: 50%;
              width: 1em;
              height: 1em;
              animation: spin 0.7s linear infinite;
              display: inline-block;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </div>
  )
}

export default FindPlant
