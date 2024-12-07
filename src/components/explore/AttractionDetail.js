import React, { useState, useEffect } from 'react';
import { getAttractionSubField } from "../../api/callApi";
import { useParams } from "react-router-dom";
import { RatingFeedback, RatingModal } from './RatingFeedback';
import { getPlaceById } from '../../api/ApiPlace';

const AttractionDetail = () => {
  const { provinceName, type, provinceNameSub, placeId } = useParams();
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [reviewType, setReviewType] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;
        console.log("Fetching by ID:", placeId);

        if (placeId) {
          response = await getPlaceById(placeId);
        } else if (provinceName && type && provinceNameSub) {
          const name = decodeURIComponent(provinceName);
          const typeField = decodeURIComponent(type);
          const field = decodeURIComponent(provinceNameSub);
          response = await getAttractionSubField(name, typeField, field);
        } else {
          throw new Error("Thiếu thông tin để tìm kiếm địa điểm");
        }

        if (response?.data) {
          console.log("Response data:", response.data);
          setAttraction(response.data);
        } else {
          throw new Error("Không tìm thấy dữ liệu địa điểm");
        }
      } catch (error) {
        console.error('Error fetching attraction:', error);
        setError(error.message || "Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [placeId, provinceName, type, provinceNameSub]);

  const nextSlide = () => {
    if (attraction?.IMAGES?.NORMAL) {
      setCurrentIndex((prevIndex) =>
        prevIndex === attraction.IMAGES.NORMAL.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevSlide = () => {
    if (attraction?.IMAGES?.NORMAL) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? attraction.IMAGES.NORMAL.length - 1 : prevIndex - 1
      );
    }
  };

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const handleSubmitReview = (rating, feedback) => {
    console.log("Đánh giá:", rating, "Ý kiến:", feedback);
    setIsModalOpen(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          fill={i < rating ? "#FFC107" : "none"}
          stroke={i < rating ? "#FFC107" : "#CBD5E0"}
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M12 17.303l-3.76 2.027 1.078-4.234L4 9.684l4.351-.378 1.413-4.003L12 4l2.236 4.329 4.351.378-2.318 5.412 1.078 4.234L12 17.303z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Lỗi: {error}</div>
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Không tìm thấy thông tin địa điểm.</div>
      </div>
    );
  }

  const filteredReviews = attraction.REVIEWS?.filter((review) => {
    if (reviewType === 'positive') {
      return review.rating >= 3;
    } else if (reviewType === 'negative') {
      return review.rating < 3;
    }
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Section */}
      {attraction?.IMAGES?.NORMAL?.length > 0 ? (
        <div className="relative h-[400px]">
          {/* Main Image */}
          <img
            src={attraction.IMAGES.NORMAL[currentIndex]}
            alt={attraction.NAME}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Navigation Arrows - Only show if more than 1 image */}
          {attraction.IMAGES.NORMAL.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {attraction.IMAGES.NORMAL.length}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="h-[200px] bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Không có hình ảnh</p>
        </div>
      )}

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{attraction.NAME}</h1>

              {/* Category */}
              {attraction.CATEGORY && (
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {attraction.CATEGORY}
                  </span>
                </div>
              )}

              {/* Description */}
              <div className="prose max-w-none mb-8">
                <p className="text-gray-600 leading-relaxed">
                  {attraction.DESCRIPTIONPLACE || 'Chưa có mô tả chi tiết.'}
                </p>
              </div>

              {/* Location Info */}
              {attraction.URLADDRESS && (
                <div className="bg-blue-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Địa chỉ
                  </h3>
                  <p className="text-gray-600 mb-2">{attraction.ADDRESS}</p>
                  <a 
                    href={`https://www.google.com/maps?q=${attraction.URLADDRESS}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {/* Xem trên Google Maps */}
                  </a>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Đánh giá</h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Viết đánh giá
                  </button>
                </div>

                {/* Review Filters */}
                <div className="flex gap-2 mb-6">
                  {['all', 'positive', 'negative'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setReviewType(type)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        reviewType === type 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      {type === 'all' ? 'Tất cả' : type === 'positive' ? 'Tích cực' : 'Tiêu cực'}
                    </button>
                  ))}
                </div>

                {/* Reviews List */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
  {filteredReviews.length > 0 ? (
    filteredReviews.map((review) => (
      <div key={review._id} className="bg-white p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            {review.userId && review.userId.FULLNAME ? review.userId.FULLNAME.charAt(0) : ''}
          </div>
          <div>
            <div className="font-medium">
              {review.userId && review.userId.FULLNAME ? review.userId.FULLNAME : 'Unknown User'}
            </div>
            <div className="flex gap-1">
              {renderStars(review.rating)}
            </div>
          </div>
        </div>
        <p className="text-gray-600">{review.comment}</p>
      </div>
    ))
  ) : (
    <div className="text-center py-8 text-gray-500">
      Chưa có đánh giá nào.
    </div>
  )}
</div>

              </div>
            </div>
          </div>
        </div>

        {/* Rating Modal */}
        <RatingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitReview}
          rating={userRating}
          setRating={handleRatingChange}
          feedback={feedback}
          setFeedback={setFeedback}
        />
      </div>
    </div>
  );
};

export default AttractionDetail;