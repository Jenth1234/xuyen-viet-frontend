import React from "react";

const FullSizePhotoModal = ({
  isOpen,
  onClose,
  photoUrl,
  photoList,
  currentPhotoIndex,
  setCurrentPhotoIndex,
  setFullSizePhoto,
}) => {
  if (!isOpen) return null;

  const handleNext = () => {
    const nextIndex = (currentPhotoIndex + 1) % photoList.length;
    setCurrentPhotoIndex(nextIndex);
    setFullSizePhoto(photoList[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex =
      (currentPhotoIndex - 1 + photoList.length) % photoList.length;
    setCurrentPhotoIndex(prevIndex);
    setFullSizePhoto(photoList[prevIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-white p-4 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1"
        >
          X
        </button>
        <img
          src={photoUrl}
          alt="Full Size"
          className="max-w-full max-h-screen rounded-lg"
        />
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <button
            onClick={handlePrev}
            className="bg-gray-700 text-white p-2 rounded-full"
          >
            &#10094;
          </button>
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <button
            onClick={handleNext}
            className="bg-gray-700 text-white p-2 rounded-full"
          >
            &#10095;
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullSizePhotoModal;
