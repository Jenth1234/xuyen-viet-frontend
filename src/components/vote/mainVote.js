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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Bình chọn các địa điểm du lịch hàng đầu trong năm</h1>
      <div className="tabs flex text-xl  overflow-x-auto whitespace-nowrap my-4 mx-20 rounded-lg bg-blue-100">
        {categories.map((category) => (
          <button
            key={category}
            className={`flex-shrink-0 text-center p-2 m-2 px-5 rounded-lg transition-colors duration-300 
                        ${selectedCategory === category ? 'bg-blue-500 text-white' : 'text-gray-800 hover:bg-blue-500 hover:text-white'}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      <div className="tab-content">
    <div className="flex justify-between items-center relative">
      <h3 className="text-xl font-semibold mt-6 text-center">
        {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}:
      </h3>
      <div className="flex items-center space-x-2 relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Tìm kiếm địa điểm"
          className="p-2 border rounded w-full"
        />

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white p-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Đề xuất địa điểm
        </button>
      </div>
    </div>

    {/* Danh sách địa điểm hiển thị kết quả tìm kiếm hoặc thông tin mặc định */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
  {(Array.isArray(searchTerm ? filteredLocations : selectedLocations)
    ? (searchTerm ? filteredLocations : selectedLocations).slice(0, 12)
    : []
  ).map(location => {
    const categoryKey = categoryMapping[selectedCategory];
    const isVoted = votes[categoryKey]?.includes(location.placeId);

    return (
      <div key={location.placeId} className="relative flex flex-col items-center p-4 transition-transform transform hover:scale-105 group">
        <div className="relative w-40 h-40 rounded-full bg-green-200 flex items-center justify-center border-4 border-gray-300">
          {location.image?.NORMAL?.[0] ? (
            <img src={location.image.NORMAL[0]} alt={location.name} className="w-32 h-32 rounded-full" />
          ) : (
            <span>Không có ảnh</span>
          )}
        </div>
        <div className="flex flex-col items-center mt-2 text-center">
          <span className="font-semibold">{location.name}</span>
           {/* Biểu tượng trái tim */}
           <span className="mt-1 text-sm text-gray-600">
  <FontAwesomeIcon icon={faHeart} className="text-red-500 w-5 h-5  " /> 
      {location.votes?.[2024] || 0}
</span> 

          <button
            onClick={() => handleVote(categoryKey, location)}
            className={`mt-2 p-2 rounded-lg shadow-lg transition duration-300 ${isVoted ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            disabled={isVoted}
          >
            {isVoted ? 'Đã chọn' : 'Bình chọn'}
          </button>
        </div>
      </div>
    );
  })}
</div>



<div>
      {/* Hiển thị danh sách giải thưởng */}
     
            <button
              onClick={() => handleOpenModal()}
              className="mt-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Xem chi tiết giải thưởng
            </button>
          
  
      
      {/* Prize Modal */}
      <PrizeModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        prizeDetails={selectedPrize} 
      />
    </div>
  </div>







      {/* {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-1/3">
            <h2 className="text-xl mb-4">
              Đề xuất địa điểm cho {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            </h2>
            <input
              type="text"
              value={newModalName}
              onChange={e => setNewModalName(e.target.value)}
              className="border p-2 w-full mb-4"
              placeholder="Tên địa điểm"
            />
            <button onClick={handleModalOk} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">OK</button>
            <button onClick={handleModalCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )} */}
    </div>
  );

  
};

export default VotePage; 