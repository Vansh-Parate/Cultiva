import axios from 'axios';
import React, { useState } from 'react'
import Component from '~/components/comp-544'
import Sidebar from '~/components/Sidebar'
import CustomToast from '~/components/CustomToast';

function fileToBase64(file){
    return new Promise((res,rej) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            res(reader.result.split(',')[1]);
          } else {
            rej(new Error('FileReader result is not a string'));
          }
        };
        reader.onerror = error => rej(error);
    })
}

const FindPlant = () => {

  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [apiResult,setApiResult] = useState(null);
  const [error, setError] = useState(null);
  // Add state to track which plant was added to collection
  const [addedIdx, setAddedIdx] = useState(null);
  const [toast, setToast] = useState({ show: false, title: '', message: '' });

  const handleIdentify = async() => {
    if(!uploadedFile) return;

    setLoading(true);
    setShowResults(false);
    
    try{
        const base64 = await fileToBase64(uploadedFile);

        const response = await axios.post('/api/identify-plant', {
            base64,
        });

        setApiResult(response.data);
        setShowResults(true);
    }catch (err){
        setError('Failed to identify plant. Please try again.')
        console.log(err)
    }finally{
        setLoading(false);
    }
  };

  // Handler for Add to Collection (mocked)
  const handleAddToCollection = (idx) => {
    setAddedIdx(idx);
    setTimeout(() => setAddedIdx(null), 1500); // Show confirmation for 1.5s

    setToast({
      show: true,
      title: 'Added to Collection',
      message: 'Plant added to your collection.',
    });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    try{
      <div>Successfull</div>
    }catch{
      <div>UnSuccessful</div>
    }
  };

  return (
    <div className='min-h-screen w-full flex bg-[#F5E9DA] text-[#2D2D2D]'>
      <aside className="w-64 flex-shrink-0">
        <Sidebar />
      </aside>
      <div className='flex-1 flex justify-center items-center px-4 py-10'>
        <div className="relative max-w-md w-full bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <CustomToast
            show={toast.show}
            title={toast.title}
            message={toast.message}
            // onClose={() => setToast(t => ({ ...t, show: false }))}
          />
          <h1 className="text-2xl flex items-center justify-center font-bold mb-2">Plant Identification</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Upload a photo of your plant to identify its species and get care tips.
          </p>
          <Component onFileChange={setUploadedFile} />
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
          {showResults && apiResult && (
            <div className="mt-8 w-full">
              <h2 className='text-lg font-bold mb-4'>Top Matches</h2>
              {Array.isArray(apiResult?.result?.classification?.suggestions) &&
                apiResult.result.classification.suggestions.slice(0,3).map((s,idx) => (
                  <div key={s.id || idx} className='mb-4 p-4 rounded-xl bg-[#F5E9DA] shadow flex flex-col md:flex-row items-center gap-4'>
                    {s.similar_images?.[0]?.url_small && (
                      <img 
                        src={s.similar_images[0].url_small}
                        alt={s.name}
                        className='w-20 h-20 object-cover rounded-lg border'
                      />
                    )} 
                    <div className='flex-1'>
                      <div className='font-bold text-[#5d55ee] text-lg'>{s.name}</div>
                      <div className='text-sm text-gray-700 mb-2'>
                        Confidence: {(s.probability * 100).toFixed(1)}%
                      </div>
                      <button
                        className={`mt-2 px-4 py-1 rounded-lg font-semibold text-white bg-[#5d55ee] hover:bg-[#574fd6] transition-colors shadow ${addedIdx === idx ? 'opacity-60 pointer-events-none' : ''}`}
                        onClick={() => handleAddToCollection(idx)}
                        disabled={addedIdx === idx}
                      >
                        {addedIdx === idx ? 'Added!' : 'Add to Collection'}
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
          {error && (
            <div className="mt-4 text-red-600">{error}</div>
          )}
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
