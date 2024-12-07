import React, { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { getTop10, addByUser, searchPlacesByName } from '../../api/ApiPlace';
import { createVote, getVoteByUser } from '../../api/apiVote';
import PrizeModal from './modal/prizeModal';

const categoryMapping = {
  'bãi biển': 'BEACH',
  'khách sạn': 'HOTEL',
  'nhà hàng': 'RESTAURANT',
  'quán cafe': 'CAFE',
  'lễ hội': 'FESTIVAL',
  'văn hóa': 'CULTURAL',
  'điểm tham quan': 'ATTRACTION',
};

const VotePage = () => {
  const [loading, setLoading] = useState(false);
  const [votes, setVotes] = useState({
    'BEACH': [],
    'HOTEL': [],
    'RESTAURANT': [],
    'CAFE': [],
    'FESTIVAL': [],
    'CULTURAL': [],
    'ATTRACTION': [],
  });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [locations, setLocations] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [newModalName, setNewModalName] = useState('');
  const containerRef = useRef(null);
  const categories = Object.keys(categoryMapping);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        setLoading(true);
        const response = await getTop10();
        console.log('Dữ liệu từ API:', response.data);
        setLocations(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        message.error('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchVoteData();
  }, []);

  // Fetch user votes
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await getVoteByUser();
        if (response.success) {
          const userVotes = response.data[0]?.LISTVOTE || [];
          const updatedVotes = { ...votes };

          userVotes.forEach(vote => {
            if (updatedVotes[vote.CATEGORY]) {
              updatedVotes[vote.CATEGORY].push(vote.placeId);
            }
          });

          setVotes(updatedVotes);
        }
      } catch (error) {
        console.error('Lỗi khi lấy votes:', error);
        message.error('Không thể tải dữ liệu bình chọn');
      }
    };

    fetchVotes();
  }, []);

  const handleVote = async (category, item) => {
    try {
      if (!category) {
        message.error("Danh mục không hợp lệ");
        return;
      }

      const isVoted = votes[category]?.includes(item.placeId);
      if (isVoted) {
        message.warning("Bạn đã bình chọn cho địa điểm này rồi!");
        return;
      }

      const currentYear = new Date().getFullYear();
      const voteData = {
        category: category,
        placeId: item.placeId,
        year: currentYear
      };

      const response = await createVote(voteData);
      
      if (response.success) {
        setVotes(prevVotes => ({
          ...prevVotes,
          [category]: [...(prevVotes[category] || []), item.placeId]
        }));

        message.success("Bình chọn thành công!");

        // Update locations vote count
        setLocations(prevLocations => {
          const updatedLocations = { ...prevLocations };
          if (updatedLocations[category]) {
            const locationIndex = updatedLocations[category].findIndex(
              loc => loc.placeId === item.placeId
            );
            
            if (locationIndex !== -1) {
              const location = updatedLocations[category][locationIndex];
              updatedLocations[category][locationIndex] = {
                ...location,
                votes: {
                  ...location.votes,
                  [currentYear]: (location.votes?.[currentYear] || 0) + 1
                }
              };
            }
          }
          return updatedLocations;
        });
      } else {
        message.error("Không thể gửi bình chọn!");
      }
    } catch (error) {
      console.error("Lỗi khi bình chọn:", error);
      message.error("Có lỗi xảy ra khi bình chọn");
    }
  };

  // Rest of your handlers...
  const handleSearch = (term) => {
    setSearchTerm(term);
    const selectedKey = categoryMapping[selectedCategory];
    const currentLocations = locations[selectedKey] || [];
    
    const filtered = currentLocations.filter(location =>
      location.name.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredLocations(filtered);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPrize(null);
  };

  // Get selected locations based on current category
  const selectedKey = categoryMapping[selectedCategory];
  const selectedLocations = locations[selectedKey] || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Bình Chọn Điểm Đến Yêu Thích
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hãy cùng chọn ra những điểm du lịch tuyệt vời nhất Việt Nam năm 2024
          </p>
        </div>

        {/* Categories */}
        <div className="relative mb-8">
          <div className="tabs flex overflow-x-auto scrollbar-hide space-x-2 p-2 bg-white rounded-xl shadow-md">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Grid */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative flex-1 md:flex-none">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm địa điểm..."
              className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            {/* Search icon */}
          </div>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {(searchTerm ? filteredLocations : selectedLocations).map((location) => {
            const isVoted = votes[selectedKey]?.includes(location.placeId);

            return (
              <div
                key={location.placeId}
                className="flex flex-col items-center transform transition-all duration-300 hover:scale-105"
              >
                {/* Location card content */}
                <div className="relative mb-4">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {location.image?.NORMAL?.[0] ? (
                      <img
                        src={location.image.NORMAL[0]}
                        alt={location.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FontAwesomeIcon icon={faQuestion} className="text-gray-400 text-4xl" />
                      </div>
                    )}
                  </div>

                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md">
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faHeart} className="text-red-500 w-4 h-4" />
                      <span className="text-sm font-medium">
                        {location.votes?.[2024] || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-center font-semibold text-gray-800 mb-2 px-2">
                  {location.name}
                </h3>

                <button
                  onClick={() => handleVote(selectedKey, location)}
                  className={`
                    px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${isVoted
                      ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:scale-105'
                    }
                  `}
                  disabled={isVoted}
                >
                  {isVoted ? 'Đã bình chọn' : 'Bình chọn ngay'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Prize Section */}
        <div className="mt-12 text-center">
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            Xem giải thưởng hấp dẫn
          </button>
        </div>

        {/* Prize Modal */}
        <PrizeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          prizeDetails={selectedPrize}
        />
      </div>
    </div>
  );
};

export default VotePage;