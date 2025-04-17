import React from 'react';

const Loader = () => {
  return (
    <>
        {/* <div className="flex items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div> */}

        {/* <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div> */}

        {/* <div className="w-6 h-6 bg-blue-500 animate-pulse rounded"></div> */}

        {/* <div className="flex space-x-1">
            <div className="w-1.5 h-5 bg-blue-500 animate-[ping_1s_infinite]"></div>
            <div className="w-1.5 h-8 bg-blue-500 animate-[ping_1s_infinite_0.2s]"></div>
            <div className="w-1.5 h-6 bg-blue-500 animate-[ping_1s_infinite_0.4s]"></div>
        </div> */}

        {/* <div className="relative w-12 h-12">
            <div className="absolute w-full h-full border-4 border-blue-500 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
            <div className="absolute w-8 h-8 top-2 left-2 border-4 border-blue-300 border-t-transparent border-b-transparent rounded-full animate-spin-reverse"></div>
        </div> */}

        {/* <div className="relative w-12 h-12">
            <div className="absolute w-full h-full border-4 border-blue-500 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
            <div className="absolute w-8 h-8 top-2 left-2 border-4 border-blue-300 border-t-transparent border-b-transparent rounded-full animate-spin-reverse"></div>
        </div> */}
        
        <div className="bg-gradient-to-br from-gray-0 to-gray-300 flex items-center justify-center space-x-1 sm:h-100 h-80 w-screen">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-[bounce_0.6s_infinite]"></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-[bounce_0.6s_infinite_0.2s]"></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-[bounce_0.6s_infinite_0.4s]"></div>
        </div>

        {/* <div className="w-8 h-8 bg-blue-500 animate-[flip_1s_infinite] origin-center"></div>

        <div className="relative w-12 h-12">
            {[...Array(8)].map((_, i) => (
                <div
                key={i}
                className={`absolute w-2 h-2 bg-yellow-500 rounded-full`}
                style={{
                    transform: `rotate(${i * 45}deg) translateY(-20px)`,
                    animation: `fade 1s linear infinite`,
                    animationDelay: `${i * 0.1}s`,
                }}
                ></div>
            ))}
        </div> */}

        {/* <div className="relative flex justify-center items-center w-16 h-16">
            <div className="absolute w-16 h-16 rounded-full border-4 border-blue-400 animate-ping"></div>
            <div className="absolute w-12 h-12 rounded-full border-4 border-purple-400 animate-ping delay-200"></div>
            <div className="absolute w-8 h-8 rounded-full border-4 border-pink-400 animate-ping delay-400"></div>
        </div> */}

        {/* <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm bg-white/50 z-50">
            <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div> */}

        {/* <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-md bg-white/10 z-50">
            <div className="relative">
                <div className="w-16 h-16 border-t-4 border-blue-400 border-solid rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 rounded-full shadow-[0_0_10px_2px_rgba(0,123,255,0.6)]"></div>
            </div>
        </div> */}

    </>
  );
};

const Loader2 = () => {
    return (
      <>
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm bg-white/50 z-50">
            <div className="w-16 h-16 border-4 border-t-transparent border-blue-400 rounded-full animate-spin"></div>
        </div>
      </>
    );
  };
  
export {Loader2}

export default Loader;