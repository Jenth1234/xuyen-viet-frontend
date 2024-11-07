// import React, { useState, useEffect } from 'react';
// import ReactPannellum from 'react-pannellum';

// const PanoramaViewer = ({ image, onClose }) => {
//   const [isImageValid, setIsImageValid] = useState(false);

//   useEffect(() => {
//     // Kiểm tra xem image có phải là một URL hợp lệ
//     if (image) {
//       setIsImageValid(true);
//     } else {
//       setIsImageValid(false);
//     }
//   }, [image]);
//   return (
//     <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
//       <button 
//         className="absolute top-4 right-4 bg-white text-black p-2 rounded shadow-lg"
//         onClick={onClose}
//       >
//         Close
//       </button>
//       <ReactPannellum
//         width="85%"
//         height="85%"
//         image={image}
//         pitch={0}
//         yaw={0}
//         hfov={100}
//         autoLoad
//         onLoad={() => console.log('Pannellum viewer loaded')}
//         onError={() => console.error('Pannellum viewer failed to load')}
//       />
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import ReactPannellum from "react-pannellum";

const PanoramaViewer = ({ image, onClose }) => {
  const [isImageValid, setIsImageValid] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu image là URL hợp lệ
    try {
      new URL(image); // Nếu image là một URL hợp lệ, sẽ không ném lỗi
      setIsImageValid(true);
    } catch (e) {
      setIsImageValid(false);
    }
  }, [image]);

  const config = {
    autoRotate: -2, // Cấu hình tự động quay
    };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
      {/* Nút đóng viewer */}
      <button
        className="absolute top-4 right-4 bg-white text-black p-2 rounded shadow-lg"
        onClick={onClose}
      >
        Close
      </button>

      {/* Kiểm tra nếu URL hợp lệ */}
      {isImageValid ? (
        <ReactPannellum
          id="1"
          sceneId="firstScene"
          imageSource={image}  // Sử dụng ảnh từ props
          config={config}  // Sử dụng cấu hình
        />
      ) : (
        <div className="text-white">Invalid Image URL</div> // Thông báo nếu URL không hợp lệ
      )}
    </div>
  );
};

export default PanoramaViewer;
