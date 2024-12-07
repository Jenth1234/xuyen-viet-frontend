import React, { useState, useEffect } from 'react';
import { Input, Spin, Alert } from 'antd';
import { motion } from 'framer-motion';
import { SearchOutlined } from '@ant-design/icons';
import { getAllProvincesWithFestivals, getAllProvincesWithByViews, getAllProvincesWithByCultural, getAllProvincesWithByBeaches, getAttractionByName } from '../../api/callApi';
import AttractionSlider from './AttractionSlider';

const { Search } = Input;

const Explore = () => {
  // State Management
  const [provinceData, setProvinceData] = useState({
    festivals: [],
    views: [],
    cultural: [],
    beaches: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const responses = await Promise.all([
          getAllProvincesWithFestivals(),
          getAllProvincesWithByViews(),
          getAllProvincesWithByCultural(),
          getAllProvincesWithByBeaches(),
        ].map(promise => 
          promise.catch(error => ({ success: false, error }))
        ));

        const [festivalsResponse, viewsResponse, culturalResponse, beachesResponse] = responses;

        // Kiểm tra lỗi
        const failedResponse = responses.find(r => !r.success);
        if (failedResponse) {
          throw new Error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        }

        setProvinceData({
          festivals: festivalsResponse.data || [],
          views: viewsResponse.data || [],
          cultural: culturalResponse.data || [],
          beaches: beachesResponse.data || []
        });

      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search Handling
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (searchTerm) {
        try {
          const response = await getAttractionByName(searchTerm);
          setSearchResults(response.success ? response.data : []);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Filter Function
  const filterProvinces = (provinces) => {
    if (!searchTerm) return provinces;
    return provinces.filter(province =>
      province.NAME.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Render Functions
  const renderLoading = () => (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Spin size="large" tip="Đang tải dữ liệu..." />
    </div>
  );

  const renderError = () => (
    <Alert
      message="Có lỗi xảy ra"
      description={error}
      type="error"
      showIcon
      className="mb-8"
      action={
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Thử lại
        </button>
      }
    />
  );

  const renderContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {searchTerm ? (
        <AttractionSlider 
          title={`Kết quả tìm kiếm cho "${searchTerm}"`} 
          provinces={searchResults}
        />
      ) : (
        <>
          <AttractionSlider 
            title="🌟 Địa điểm đáng đi trong năm" 
            provinces={filterProvinces(provinceData.festivals)}
          />
          <AttractionSlider 
            title="🏖️ Điểm đến dành cho kỳ nghỉ" 
            provinces={filterProvinces(provinceData.views)}
          />
          <AttractionSlider 
            title="🏛️ Di sản văn hóa và lịch sử" 
            provinces={filterProvinces(provinceData.cultural)}
          />
          <AttractionSlider 
            title="🎭 Lễ hội và sự kiện đặc biệt" 
            provinces={filterProvinces(provinceData.beaches)}
          />
        </>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div 
        className="relative min-h-[600px] flex items-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://res.cloudinary.com/dbdl1bznw/image/upload/v1727963288/place/wj00n6t8fyvqxnohpp0y.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50"></div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto text-center px-4 py-20">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 text-shadow-lg"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Khám phá Việt Nam
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-12 text-gray-100 text-shadow"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Tìm kiếm và khám phá những điểm đến tuyệt vời trên khắp đất nước
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <Search
              placeholder="Nhập tên địa điểm bạn muốn tìm..."
              enterButton={<SearchOutlined className="text-lg" />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-custom"
            />
          </motion.div>

          {/* Decorative elements */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          />
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {error && renderError()}
        {loading ? renderLoading() : renderContent()}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .search-input-custom {
          .ant-input {
            @apply bg-white/90 backdrop-blur;
          }
          .ant-input-search-button {
            @apply bg-blue-700 hover:bg-blue-800;
          }
        }
      `}</style>
    </div>
  );
};

export default Explore;