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

      const currentYear = new Date().getFullYear();
      const voteData = {
        category: category,
        placeId: item.placeId,
        year: currentYear
      };

      const response = await createVote(voteData);
      
      // Kiểm tra kết quả từ vote object trong response
      if (response.vote && !response.vote.success) {
        message.warning(
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg font-medium">Không thể bình chọn</span>
            <span className="text-sm text-gray-500">
              {response.vote.error || "Bạn đã bình chọn cho danh mục này rồi"}
            </span>
          </div>,
          5
        );
        return;
      }

      // Chỉ xử lý khi vote thành công
      if (response.success && !response.vote?.error) {
        setVotes(prevVotes => ({
          ...prevVotes,
          [category]: [...(prevVotes[category] || []), item.placeId]
        }));

        message.success(
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg font-medium">Bình chọn thành công!</span>
            <span className="text-sm text-gray-500">
              Cảm ơn bạn đã tham gia bình chọn
            </span>
          </div>
        );

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
    <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section với hiệu ứng 3D */}
        <div className="text-center mb-16 transform hover:scale-105 transition-all duration-700">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 
            [text-shadow:_2px_2px_0_rgb(0_0_0_/_20%)]
            bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
            bg-clip-text text-transparent animate-gradient">
            Bình Chọn Điểm Đến Yêu Thích
          </h1>
          <p className="text-gray-600 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed
            font-light tracking-wide">
            Hãy cùng chọn ra những điểm du lịch tuyệt vời nhất Việt Nam năm 2024
          </p>
        </div>

        {/* Categories với Neumorphism effect */}
        <div className="relative mb-12">
          <div className="tabs flex overflow-x-auto scrollbar-hide space-x-4 p-6
            bg-white/90 backdrop-blur-xl rounded-3xl
            shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),_0_4px_8px_rgba(0,0,0,0.1)]">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-8 py-4 rounded-2xl whitespace-nowrap transition-all duration-500
                  font-medium text-lg ${
                  selectedCategory === category
                    ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 hover:shadow-inner'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Modern Search Bar */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-3xl group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm địa điểm..."
              className="w-full pl-14 pr-6 py-5 rounded-2xl
                border-2 border-transparent bg-white/80
                focus:border-purple-500 focus:ring-4 focus:ring-purple-200 
                transition-all duration-300 text-lg placeholder-gray-400
                shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-sm
                group-hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
            />
            <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 
              text-gray-400 group-hover:text-purple-500 transition-colors duration-300"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Locations Grid với Card Design Mới */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {(searchTerm ? filteredLocations : selectedLocations).map((location) => {
            const isVoted = votes[selectedKey]?.includes(location.placeId);

            return (
              <div key={location.placeId} 
                className="group flex flex-col items-center">
                <div className="relative mb-8 transform transition-all duration-700 
                  hover:scale-105 hover:-rotate-2">
                  {/* Image Container với Border Gradient */}
                  <div className="w-52 h-52 rounded-[2rem] overflow-hidden
                    bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1
                    shadow-[0_8px_16px_rgba(0,0,0,0.2)] group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)]
                    transition-all duration-500">
                    {location.image?.NORMAL?.[0] ? (
                      <img
                        src={location.image.NORMAL[0]}
                        alt={location.name}
                        className="w-full h-full object-cover rounded-[1.85rem]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-[1.85rem]
                        flex items-center justify-center">
                        <FontAwesomeIcon icon={faQuestion} 
                          className="text-gray-400 text-4xl" />
                      </div>
                    )}
                  </div>

                  {/* Vote Counter với Glass Effect */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 
                    bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full
                    shadow-[0_4px_12px_rgba(0,0,0,0.1)] group-hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)]
                    transition-all duration-500 border border-white/50">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faHeart} 
                        className="text-red-500 w-5 h-5 group-hover:animate-bounce" />
                      <span className="text-base font-semibold bg-gradient-to-r 
                        from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {location.votes?.[2024] || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location Name với Gradient Hover */}
                <h3 className="text-center font-semibold text-xl mb-4 px-4
                  bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent
                  group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {location.name}
                </h3>

                {/* Vote Button với Modern Design */}
                <button
                  onClick={() => handleVote(selectedKey, location)}
                  disabled={isVoted}
                  className={`
                    relative overflow-hidden px-8 py-3 rounded-full text-base font-medium
                    transition-all duration-500 ${
                      isVoted
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : `bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white
                          shadow-lg hover:shadow-xl transform hover:scale-105
                          before:absolute before:inset-0 before:bg-white/20
                          before:translate-x-[-100%] hover:before:translate-x-[100%]
                          before:transition-transform before:duration-700 before:ease-in-out`
                    }
                  `}
                >
                  {isVoted ? 'Đã bình chọn' : 'Bình chọn ngay'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Prize Button với Fancy Design */}
        <div className="mt-20 text-center">
          <button
            onClick={handleOpenModal}
            className="group relative overflow-hidden inline-flex items-center gap-3 
              bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 
              text-white px-12 py-5 rounded-full text-xl font-medium
              shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)]
              transform hover:scale-105 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 
              translate-x-[-100%] group-hover:translate-x-[100%] 
              transition-transform duration-1000 ease-in-out" />
            <svg className="w-8 h-8 transform group-hover:rotate-12 transition-transform duration-500" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <span className="relative">Xem giải thưởng hấp dẫn</span>
          </button>
        </div>

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