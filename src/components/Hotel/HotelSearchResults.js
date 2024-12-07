import React, { useState } from 'react';
import { Card, Rate, Tag, Row, Col, Typography, Slider, Checkbox, Divider, Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    EnvironmentOutlined, 
    StarFilled,
    CalendarOutlined,
    UserOutlined,
    DollarOutlined,
    HeartOutlined,
    FilterOutlined ,
    ClockCircleOutlined,
    WifiOutlined,
    CarOutlined
  } from '@ant-design/icons';
const { Title, Text } = Typography;

const HotelSearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, searchParams } = location.state || {};
  const [hotels, setHotels] = useState(searchResults?.data?.hotels || []);
  
  // State cho filters
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const amenitiesOptions = [
    'Hồ bơi',
    'Nhà hàng',
    'Spa',
    'Phòng gym',
    'Bar',
    'Wifi miễn phí',
    'Đưa đón sân bay'
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleFilter = () => {
    let filteredHotels = searchResults.data.hotels;

    // Lọc theo giá
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.priceRange.min >= priceRange[0] && hotel.priceRange.max <= priceRange[1]
    );

    // Lọc theo rating
    if (selectedRatings.length > 0) {
      filteredHotels = filteredHotels.filter(hotel => 
        selectedRatings.includes(Math.floor(hotel.rating))
      );
    }

    // Lọc theo tiện ích
    if (selectedAmenities.length > 0) {
      filteredHotels = filteredHotels.filter(hotel => 
        selectedAmenities.every(amenity => hotel.amenities.includes(amenity))
      );
    }

    setHotels(filteredHotels);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-4">
              Khách sạn tại {searchParams?.city}
            </h1>
            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <span className="bg-blue-500 px-3 py-1 rounded-full font-semibold">
                  {hotels.length} khách sạn
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarOutlined className="text-xl" />
                <span>{searchParams?.checkIn} - {searchParams?.checkOut}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserOutlined className="text-xl" />
                <span>
                  {searchParams?.adults} người lớn
                  {searchParams?.children > 0 && ` • ${searchParams?.children} trẻ em`}
                </span>
              </div>
            </div>
          </div>
  
          {/* Quick Filters */}
          <div className="flex gap-4 mt-8">
            <Button 
              type="default" 
              ghost 
              icon={<DollarOutlined />}
              className="border-white text-white hover:bg-white hover:text-blue-700"
            >
              Giá tốt nhất
            </Button>
            <Button 
              type="default" 
              ghost 
              icon={<StarFilled />}
              className="border-white text-white hover:bg-white hover:text-blue-700"
            >
              Đánh giá cao
            </Button>
            <Button 
              type="default" 
              ghost 
              icon={<HeartOutlined />}
              className="border-white text-white hover:bg-white hover:text-blue-700"
            >
              Phổ biến nhất
            </Button>
          </div>
        </div>
      </div>
  
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Aside Filter */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-8">
              <Title level={4} className="mb-6 flex items-center gap-2">
                <FilterOutlined />
                Bộ lọc tìm kiếm
              </Title>
  
              {/* Price Range Filter */}
              <div className="mb-6">
                <Text strong className="block mb-4 text-lg">Khoảng giá</Text>
                <Slider
                  range
                  min={0}
                  max={10000000}
                  step={500000}
                  value={priceRange}
                  onChange={setPriceRange}
                  tipFormatter={value => formatPrice(value)}
                  className="custom-slider"
                />
                <div className="flex justify-between mt-4">
                  <Tag color="blue" className="px-3 py-1 text-sm">
                    {formatPrice(priceRange[0])}
                  </Tag>
                  <Tag color="blue" className="px-3 py-1 text-sm">
                    {formatPrice(priceRange[1])}
                  </Tag>
                </div>
              </div>
  
              <Divider />
  
              {/* Star Rating Filter */}
              <div className="mb-6">
                <Text strong className="block mb-4 text-lg">Xếp hạng sao</Text>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(star => (
                    <Checkbox
                      key={star}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedRatings([...selectedRatings, star]);
                        } else {
                          setSelectedRatings(selectedRatings.filter(r => r !== star));
                        }
                      }}
                      className="star-checkbox"
                    >
                      <div className="flex items-center gap-1">
                        {[...Array(star)].map((_, i) => (
                          <StarFilled key={i} className="text-yellow-400 text-lg" />
                        ))}
                      </div>
                    </Checkbox>
                  ))}
                </div>
              </div>
  
              <Divider />
  
              {/* Amenities Filter */}
              <div className="mb-8">
                <Text strong className="block mb-4 text-lg">Tiện nghi</Text>
                <div className="grid grid-cols-1 gap-3">
                  {amenitiesOptions.map(amenity => (
                    <Checkbox
                      key={amenity}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedAmenities([...selectedAmenities, amenity]);
                        } else {
                          setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                        }
                      }}
                      className="amenity-checkbox"
                    >
                      <span className="text-gray-700">{amenity}</span>
                    </Checkbox>
                  ))}
                </div>
              </div>
  
              <Button 
                type="primary" 
                block 
                size="large"
                onClick={handleFilter}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Áp dụng bộ lọc
              </Button>
            </div>
          </aside>
  
          {/* Hotel Cards */}
          <div className="flex-grow">
            <Row gutter={[24, 24]}>
        

{/* Hotel List */}
<div className="flex-grow">
  {hotels.map((hotel) => (
    <div 
      key={hotel.id}
      className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex">
        {/* Hotel Image Section */}
        <div className="w-1/3 relative">
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-full h-[300px] object-cover"
            onError={(e) => {
              e.target.src = '/images/hotel-placeholder.jpg';
            }}
          />
          <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-600">{hotel.rating}</span>
              <StarFilled className="text-yellow-400 text-lg" />
            </div>
          </div>
        </div>

        {/* Hotel Details Section */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{hotel.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <EnvironmentOutlined className="mr-2" />
                <span>{hotel.address}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-500">Giá mỗi đêm từ</div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatPrice(hotel.priceRange.min)}
              </div>
              <Button 
                type="primary"
                size="large"
                onClick={() => navigate(`/hotel/${hotel.id}`)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Xem chi tiết
              </Button>
            </div>
          </div>

          {/* Hotel Description */}
          <div className="mb-4">
            <Text className="text-gray-600">
              {hotel.description}
            </Text>
          </div>

          {/* Divider */}
          <Divider className="my-4" />

          {/* Amenities Section */}
          <div className="mb-4">
            <div className="text-gray-700 font-medium mb-2">Tiện nghi nổi bật:</div>
            <div className="grid grid-cols-3 gap-2">
              {hotel.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Highlights */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex items-center text-gray-600">
              <WifiOutlined className="text-blue-500 mr-2" />
              <span>Wifi miễn phí</span>
            </div>
            <div className="flex items-center text-gray-600">
              <CarOutlined className="text-blue-500 mr-2" />
              <span>Bãi đậu xe</span>
            </div>
            <div className="flex items-center text-gray-600">
              <ClockCircleOutlined className="text-blue-500 mr-2" />
              <span>Nhận phòng 24/7</span>
            </div>
          </div>

          {/* Tags Section */}
          <div className="mt-4">
            <Tag color="green">Đặt phòng nhanh</Tag>
            <Tag color="blue">Giá tốt nhất</Tag>
            <Tag color="gold">Được đề xuất</Tag>
            {hotel.rating >= 4.5 && (
              <Tag color="red">Đánh giá xuất sắc</Tag>
            )}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
            </Row>
          </div>
        </div>
      </div>
  
      {/* Custom Styles */}
      <style jsx>{`
        .custom-slider .ant-slider-track {
          background-color: #2563eb;
        }
        .custom-slider .ant-slider-handle {
          border-color: #2563eb;
        }
        .star-checkbox .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #2563eb;
          border-color: #2563eb;
        }
        .amenity-checkbox .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #2563eb;
          border-color: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default HotelSearchResults;