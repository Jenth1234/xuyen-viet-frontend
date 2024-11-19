import React, { useState } from 'react';
import { addReview } from '../../api/ApiPlace';
import { toast } from 'react-toastify';
const RatingModal = ({ isOpen, onClose, onSubmit, activity }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview({
        placeId: activity?.placeId,
        rating,
        feedback
      });
      toast.success('Cảm ơn bạn đã đánh giá!');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Có lỗi xảy ra khi gửi đánh giá');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg p-6 max-w-sm w-full mx-auto">
          <h2 className="text-lg font-medium mb-4">Đánh giá trải nghiệm của bạn</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full p-2 border rounded mb-4"
              rows="4"
              placeholder="Chia sẻ trải nghiệm của bạn..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={onClose}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={rating === 0}
              >
                Gửi đánh giá
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;