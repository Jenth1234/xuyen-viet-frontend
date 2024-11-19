import React, { useState, useEffect,useRef  } from 'react';
import { debounce } from 'lodash';
import {
  getTop10,
  addByUser,
  searchPlacesByName,
} from '../../api/ApiPlace';
import { createVote, getVoteByUser } from '../../api/apiVote';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart,faQuestion  } from '@fortawesome/free-solid-svg-icons'; 


import PrizeModal from './modal/prizeModal'; // Import PrizeModal

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
  const [userVotes, setUserVotes] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [newLocation, setNewLocation] = useState({ name: '', image: '', category: 'beaches' });
  const [locations, setLocations] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]); // Khởi tạo filteredLocations và setFilteredLocations
  const [newModalName, setNewModalName] = useState('');
  const containerRef = useRef(null); // Tạo ref cho container
  // Khai báo categories ở đây trước khi sử dụng
  const categories = Object.keys(categoryMapping);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]); // Khởi tạo danh mục đầu tiên
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        const response = await getTop10();
        console.log('Dữ liệu từ API:', response.data); // Kiểm tra dữ liệu
        setLocations(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchVoteData();
  }, []);
  console.log("Votes:", votes);

  useEffect(() => {
    // Lấy bình chọn của người dùng khi component được mount
    const fetchVotes = async () => {
    
        try {
          const response = await getVoteByUser(); // Gọi hàm với userId
          if (response.success) {
            const userVotes = response.data[0]?.LISTVOTE || [];
            const updatedVotes = { ...votes };

            userVotes.forEach(vote => {
              const category = vote.CATEGORY;
              const placeId = vote.placeId;

              // Cập nhật trạng thái bình chọn của người dùng
              if (updatedVotes[category]) {
                updatedVotes[category].push(placeId);
              }
            });

            setVotes(updatedVotes);
          } else {
            console.error('Không thể lấy bình chọn của người dùng.');
          }
        } catch (error) {
          console.error('Có lỗi xảy ra:', error);
        }
      
    };

    fetchVotes();
  }, []); // Chạy lại nếu userId thay đổi

  const prizes = [
    {
      id: 1,
      name: "Giải Nhất",
      description: "Giải thưởng cho người đạt điểm cao nhất.",
      value: "100.000 VND",
    },
    {
      id: 2,
      name: "Giải Nhì",
      description: "Giải thưởng cho người đạt điểm thứ hai.",
      value: "50.000 VND",
    },
    // Các giải thưởng khác...
  ];
  
  const handleVote = async (category, item) => {
 
    const mappedCategory = categoryMapping[category]; // Ánh xạ category sang tên trong votes
    console.log(mappedCategory);
    if (!mappedCategory) {
        alert("Danh mục không hợp lệ.");
        return;
    }
    if (!votes[mappedCategory]) {
      alert("Danh mục không tồn tại trong hệ thống bình chọn.");
      return;
  }

    const isVoted = votes[mappedCategory].includes(item.placeId);
    
    setVotes(prevVotes => ({
      ...prevVotes,
      [mappedCategory]: isVoted ? prevVotes[mappedCategory].filter(vote => vote !== item.placeId) : [...prevVotes[mappedCategory], item.placeId],
    }));

    if (!isVoted) {
      try {
        const trimmedItem = item.name.trim(); 
        console.log("Tên địa điểm đang tìm:", trimmedItem);

        // Kiểm tra xem category có trong locations không
        if (!locations[mappedCategory]) {
          alert("Danh mục không tồn tại.");
          return;
        }

        const place = locations[mappedCategory].find(loc => loc.name.toLowerCase() === trimmedItem.toLowerCase());

        // Log để kiểm tra địa điểm
        console.log("Địa điểm trong danh mục:", locations[mappedCategory]);

        if (place) {
          const currentYear = new Date().getFullYear(); 
          const voteData = { 
            category: mappedCategory, 
            placeId: place.placeId,
            year: currentYear 
          };

          await createVote(voteData);
          alert("Bình chọn đã được gửi thành công!");
        } else {
          alert("Không tìm thấy địa điểm.");
        }
      } catch (error) {
        alert("Không thể gửi bình chọn! Có lỗi xảy ra: " + error.message);
        console.error("Lỗi:", error);
      }
    } else {
      alert("Bạn đã bình chọn cho địa điểm này rồi!");
    }
};



// Hàm cập nhật từ khóa và lọc danh sách dựa trên từ khóa
const handleSearch = (term) => {
  setSearchTerm(term);
  
  // Lọc địa điểm dựa trên từ khóa
  const filtered = selectedLocations.filter(location =>
    location.name.toLowerCase().includes(term.toLowerCase())
  );
  
  setFilteredLocations(selectedLocations); 
};

const handleClickOutside = (event) => {
  // Kiểm tra nếu nhấp bên ngoài container
  if (containerRef.current && !containerRef.current.contains(event.target)) {
    setSuggestions([]); // Đóng danh sách gợi ý
  }
};
useEffect(() => {
  document.addEventListener('mousedown', handleClickOutside);
  
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };  
}, []);


  // const filteredLocations = Object.fromEntries(
  //   Object.entries(locations).map(([category, locs]) => [
  //     category,
  //     locs.filter(loc => loc.name.toLowerCase().includes(searchTerm.toLowerCase())),
  //   ])
  // );

    // Hàm mở modal
    const handleOpenModal = () => {
      setSelectedPrize();
      setIsModalOpen(true);
    };
  
    // Hàm đóng modal
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedPrize(null);
    };
  const handleModalOk = async () => {
    if (!newModalName || !selectedCategory) {
      alert('Vui lòng nhập tên và chọn danh mục cho địa điểm!');
      return;
    }

    const categoryInEnglish = categoryMapping[selectedCategory.toLowerCase()];

    try {
      const response = await addByUser({
        NAME: newModalName,
        IS_CUSTOMER: true,
        CATEGORY: categoryInEnglish || selectedCategory.toUpperCase(),
      });

      if (response.success) {
        alert('Địa điểm đã được thêm thành công!');
        setNewModalName('');
      } else {
        alert('Không thể thêm địa điểm!');
      }
    } catch (error) {
      alert('Lỗi xảy ra khi thêm địa điểm!');
      console.error(error);
    }

    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setNewModalName('');
  };

  const handleSearchName = async value => {
    if (value) {
      try {
        const response = await searchPlacesByName(value);
        if (response.success) {
          setSuggestions(response.data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        alert('Lỗi xảy ra khi tìm kiếm địa điểm!');
        console.error(error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = suggestion => {
    setNewModalName(suggestion);
    setSuggestions([]);
  };

  const selectedKey = categoryMapping[selectedCategory]; // Lấy khóa tương ứng với danh mục đã chọn
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

      {/* Categories Tabs */}
      <div className="relative mb-8">
        <div className="tabs flex overflow-x-auto scrollbar-hide space-x-2 p-2 bg-white rounded-xl shadow-md">
          {categories.map((category) => (
            <button
              key={category}
              className={`
                flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-all duration-300
                ${selectedCategory === category 
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Add Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h3 className="text-2xl font-semibold text-gray-800">
          {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
        </h3>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm địa điểm..."
              className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Đề xuất địa điểm
          </button>
        </div>
      </div>

      {/* Locations Grid - Updated with circular design */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {(Array.isArray(searchTerm ? filteredLocations : selectedLocations)
          ? (searchTerm ? filteredLocations : selectedLocations).slice(0, 12)
          : []
        ).map(location => {
          const categoryKey = categoryMapping[selectedCategory];
          const isVoted = votes[categoryKey]?.includes(location.placeId);

          return (
            <div key={location.placeId} 
              className="flex flex-col items-center transform transition-all duration-300 hover:scale-105"
            >
              {/* Circular Image Container */}
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
                
                {/* Vote Count Badge */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md">
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faHeart} className="text-red-500 w-4 h-4" />
                    <span className="text-sm font-medium">{location.votes?.[2024] || 0}</span>
                  </div>
                </div>
              </div>

              {/* Location Name */}
              <h3 className="text-center font-semibold text-gray-800 mb-2 px-2">
                {location.name}
              </h3>

              {/* Vote Button */}
              <button
                onClick={() => handleVote(categoryKey, location)}
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