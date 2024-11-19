import React, { useState } from 'react';

// Rating Component với animation và hiệu ứng tốt hơn
const Rating = ({ rating, onRatingChange }) => {
  const [hoveredStar, setHoveredStar] = useState(null);
  const stars = Array(5).fill(false).map((_, index) => index < rating);

  const handleClick = (index) => {
    if (onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {stars.map((isFilled, index) => (
        <button
          key={index}
          className="relative group transition-transform hover:scale-110"
          onMouseEnter={() => setHoveredStar(index)}
          onMouseLeave={() => setHoveredStar(null)}
          onClick={() => handleClick(index)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-8 h-8 transition-all duration-200 ${
              index <= hoveredStar || isFilled
                ? 'text-yellow-400 fill-yellow-400 filter drop-shadow-md'
                : 'text-gray-300 fill-gray-300'
            }`}
          >
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {index + 1} sao
          </span>
        </button>
      ))}
    </div>
  );
};

// Feedback Component với thiết kế hiện đại
const Feedback = ({ description, urlAddress }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed">{description}</p>
        {urlAddress && (
          <a 
            href={urlAddress}
            target="_blank"
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Xem chi tiết</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};

// Modal Component với giao diện cải tiến
const RatingModal = ({ isOpen, onClose, onSubmit, rating, setRating, feedback, setFeedback }) => {
  if (!isOpen) return null;

  const ratingLabels = [
    "Chọn đánh giá",
    "Rất không hài lòng",
    "Không hài lòng",
    "Bình thường", 
    "Hài lòng",
    "Rất hài lòng"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose} />

        {/* Modal Panel */}
        <div className="inline-block transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  Đánh giá trải nghiệm
                </h3>

                {/* Rating Section */}
                <div className="mb-8">
                  <div className="flex flex-col items-center gap-4">
                    <Rating rating={rating} onRatingChange={setRating} />
                    <span className="text-lg font-medium text-gray-700">
                      {ratingLabels[rating]}
                    </span>
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Chia sẻ trải nghiệm của bạn
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="4"
                    className="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Hãy chia sẻ những điều bạn thích hoặc những điều cần cải thiện..."
                  />
                </div>

                {/* Tips Section */}
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Mẹo viết đánh giá hữu ích:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Chia sẻ trải nghiệm cụ thể của bạn</li>
                    <li>• Đề cập đến các điểm nổi bật hoặc hạn chế</li>
                    <li>• Giữ đánh giá ngắn gọn và khách quan</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
            <button
              type="button"
              onClick={() => onSubmit(rating, feedback)}
              className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto transition-colors"
            >
              Gửi đánh giá
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component chung Rating và Feedback
const RatingFeedback = ({ rating, onRatingChange, description, urlAddress }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Đánh giá và Nhận xét</h3>
      <Rating rating={rating} onRatingChange={onRatingChange} />
      <Feedback description={description} urlAddress={urlAddress} />
    </div>
  );
};

export { RatingFeedback, RatingModal };