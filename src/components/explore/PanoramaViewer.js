import React from 'react';
import ReactPannellum from 'react-pannellum';

const PanoramaViewer = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
      <button 
        className="absolute top-4 right-4 bg-white text-black p-2 rounded shadow-lg"
        onClick={onClose}
      >
        Close
      </button>
      <ReactPannellum
        width="85%"
        height="85%"
        image={imageUrl}
        pitch={0}
        yaw={0}
        hfov={100}
        autoLoad
        onLoad={() => console.log('Pannellum viewer loaded')}
        onError={() => console.error('Pannellum viewer failed to load')}
      />
    </div>
  );
};

export default PanoramaViewer;
