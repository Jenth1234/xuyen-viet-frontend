import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHotel, 
  faBed, 
  faUsers, 
  faEye,
  faBuilding,
  faRuler,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  Typography, 
  Rate, 
  Divider, 
  Button, 
  Card, 
  Tag, 
  Image,
  Row,
  Col,
  Spin,Modal,Carousel
} from 'antd';
import { 
  RightOutlined,
  LeftOutlined,
  EnvironmentOutlined,
  WifiOutlined,
  CarOutlined,
  ClockCircleOutlined,
  CoffeeOutlined,
  CheckCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useRef } from 'react';


import { ApiHotel } from '../../api/ApiHotel';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const HotelDetail = () => {
  const { hotelId } = useParams();
  const carouselRef = useRef();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
const [selectedRoom, setSelectedRoom] = useState(null);
const NextArrow = ({ className, style, onClick }) => (
  <div
    className={className}
    style={{
      ...style,
      color: 'white',
      fontSize: '20px',
      lineHeight: '1.5715'
    }}
    onClick={onClick}
  >
    <RightOutlined />
  </div>
);
const PrevArrow = ({ className, style, onClick }) => (
  <div
    className={className}
    style={{
      ...style,
      color: 'white',
      fontSize: '20px',
      lineHeight: '1.5715'
    }}
    onClick={onClick}
  >
    <LeftOutlined />
  </div>
);

  console.log(hotelId);
  useEffect(() => {
    const fetchHotelDetail = async () => {
      try {
        setLoading(true);
        const result = await ApiHotel.getHotelDetails(hotelId);
        if (result.status === 'success') {
          // Lấy thông tin khách sạn từ phòng đầu tiên
          const hotelInfo = result.data.rooms[0].hotel;
          setHotel(hotelInfo);
          // Lấy danh sách phòng
          setRooms(result.data.rooms);
        } else {
          setError('Không thể tải thông tin khách sạn');
        }
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        setError('Đã có lỗi xảy ra khi tải thông tin khách sạn');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetail();
  }, [hotelId]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Đang tải thông tin khách sạn..." />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Title level={3} className="text-red-500">{error || 'Không tìm thấy thông tin khách sạn'}</Title>
          <Button type="primary" onClick={() => window.history.back()}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  const handleBookingRoom = (room) => {
    setSelectedRoom(room);
    setBookingModalVisible(true);
  };
  
  const handleConfirmBooking = () => {
    // Chuyển hướng đến trang đặt phòng với thông tin đã chọn
    navigate('/booking-hotel', {
      state: {
        hotel,
        room: selectedRoom,
        // Có thể thêm các thông tin khác như ngày check-in, check-out
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hotel Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-start">
            <div>
              <Title level={2} className="mb-2">{hotel.name}</Title>
              <div className="flex items-center gap-4 mb-4">
                <Rate disabled defaultValue={hotel.rating} />
                <Text className="text-lg">({hotel.rating} / 5)</Text>
              </div>
              <div className="flex items-center text-gray-600">
                <EnvironmentOutlined className="mr-2" />
                <Text>{hotel.address}</Text>
              </div>
            </div>
            <div className="text-right">
              <Text className="text-gray-500">Giá từ</Text>
              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(hotel.priceRange.min)}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
  
<div className="max-w-7xl mx-auto px-4 py-8">
  <Row gutter={24}>
    <Col span={16}>
    {/* Hotel Images Carousel */}
<div className="mb-8">
  <div className="relative">
    <Carousel
      autoplay
      ref={carouselRef}
      arrows={true}
      prevArrow={<PrevArrow />}
      nextArrow={<NextArrow />}
      className="hotel-carousel"
    >
      {hotel.images.map((image, index) => (
        <div key={index}>
          <div className="relative h-[500px]">
            <img
              src={image}
              alt={`${hotel.name} - ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <Text className="text-white text-lg">
                {index + 1}/{hotel.images.length}
              </Text>
            </div>
          </div>
        </div>
      ))}
    </Carousel>

    {/* Thumbnails */}
    <div className="mt-4 grid grid-cols-6 gap-2">
      {hotel.images.map((image, index) => (
        <div
          key={index}
          onClick={() => carouselRef.current.goTo(index)}
          className={`
            cursor-pointer h-20 rounded-lg overflow-hidden
            ${carouselRef.current?.current === index ? 'ring-2 ring-blue-500' : ''}
          `}
        >
          <img
            src={image}
            alt={`thumbnail ${index + 1}`}
            className="w-full h-full object-cover hover:opacity-80 transition-opacity"
          />
        </div>
      ))}
    </div>
  </div>
</div>

      {/* Hotel Description */}
      <Card className="mb-8">
        <Title level={4}>Giới thiệu</Title>
        <Text className="text-gray-600">{hotel.description}</Text>
      </Card>

      {/* Hotel Amenities */}
      <Card className="mb-8">
        <Title level={4}>Tiện nghi khách sạn</Title>
        <div className="grid grid-cols-3 gap-4">
          {hotel.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center">
              <CheckCircleOutlined className="text-green-500 mr-2" />
              <Text>{amenity}</Text>
            </div>
          ))}
        </div>
      </Card>

      {/* Room List */}
      <Title level={3} className="mb-6">Danh sách phòng</Title>
      {rooms.map((room) => (
        <Card key={room.id} className="mb-4 hover:shadow-lg transition-shadow">
          <div className="flex">
            <div className="w-64 h-48 relative">
              <img
                src={room.images[0]}
                alt={room.roomType}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/images/room-placeholder.jpg';
                }}
              />
            </div>
            <div className="flex-1 ml-6">
              <div className="flex justify-between">
                <div>
                  <Title level={4}>{room.roomType}</Title>
                  <div className="flex items-center gap-4 mb-2">
                    <Tag color="blue">Diện tích: {room.size}m²</Tag>
                    <Tag color="green">Tối đa: {room.capacity} khách</Tag>
                    <Tag color="purple">View: {room.view}</Tag>
                    <Tag color="orange">Tầng: {room.floor}</Tag>
                    <Tag color="cyan">Giường: {room.bedType}</Tag>
                  </div>
                    {/* Thêm thông tin chi tiết về sức chứa */}
            <div className="mb-3 text-gray-600">
              <div className="flex items-center gap-2">
                <UserOutlined />
                <Text>
                  Phù hợp cho: {room.capacity} người lớn
                  {room.capacity > 2 && " (có thể thêm 1 trẻ em dưới 6 tuổi)"}
                </Text>
              </div>
              {room.capacity > 2 && (
                <Text className="text-sm text-gray-500 ml-6">
                  * Trẻ em dưới 6 tuổi được miễn phí khi ngủ chung giường với người lớn
                </Text>
              )}
            </div>
                </div>
                <div className="text-right">
                  <Text className="text-gray-500">Giá mỗi đêm</Text>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(room.price)}
                  </div>
                  <Button 
                    type="primary" 
                    size="large" 
                    className="mt-4 bg-blue-500 hover:bg-blue-600"
                    disabled={room.status !== 'available'}
                    onClick={() => handleBookingRoom(room)}
                  >
                    {room.status === 'available' ? 'Đặt phòng ngay' : 'Hết phòng'}
                  </Button>
                </div>
              </div>
              <Divider className="my-4" />
              <Text className="block mb-4 text-gray-600">{room.description}</Text>
              <div className="grid grid-cols-3 gap-2">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircleOutlined className="text-green-500 mr-2" />
                    <Text>{amenity}</Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </Col>

    {/* Sidebar */}
    <Col span={8}>
      <div className="sticky top-8">
        <Card className="mb-6">
          <Title level={4}>Chính sách khách sạn</Title>
          <div className="space-y-4">
            <div className="flex items-center">
              <ClockCircleOutlined className="text-blue-500 mr-2" />
              <div>
                <Text strong>Nhận phòng:</Text>
                <Text className="ml-2">Từ 14:00</Text>
              </div>
            </div>
            <div className="flex items-center">
              <ClockCircleOutlined className="text-blue-500 mr-2" />
              <div>
                <Text strong>Trả phòng:</Text>
                <Text className="ml-2">Trước 12:00</Text>
              </div>
            </div>
            <Divider />
            <div className="flex items-center">
              <WifiOutlined className="text-blue-500 mr-2" />
              <Text>Wifi miễn phí</Text>
            </div>
            <div className="flex items-center">
              <CarOutlined className="text-blue-500 mr-2" />
              <Text>Bãi đậu xe miễn phí</Text>
            </div>
          </div>
        </Card>

        <Card>
          <Title level={4}>Tiện ích nổi bật</Title>
          <div className="space-y-4">
            {hotel.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center">
                <CheckCircleOutlined className="text-green-500 mr-2" />
                <Text>{amenity}</Text>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Col>
  </Row>

  {/* Booking Modal */}
  <Modal
  title={
    <div className="flex items-center gap-3 pb-3 border-b">
      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
        <FontAwesomeIcon icon={faHotel} className="text-blue-500 text-lg" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800">Xác nhận đặt phòng</h3>
        <p className="text-sm text-gray-500 mt-1">Vui lòng kiểm tra thông tin trước khi xác nhận</p>
      </div>
    </div>
  }
  visible={bookingModalVisible}
  onCancel={() => setBookingModalVisible(false)}
  width={600}
  centered
  footer={[
    <Button 
      key="back" 
      onClick={() => setBookingModalVisible(false)}
      className="px-6 hover:bg-gray-50"
      icon={<FontAwesomeIcon icon={faTimes} className="mr-2" />}
    >
      Hủy
    </Button>,
    <Button
      key="submit"
      type="primary"
      onClick={handleConfirmBooking}
      className="bg-blue-500 hover:bg-blue-600 px-6"
      icon={<FontAwesomeIcon icon={faCheck} className="mr-2" />}
    >
      Xác nhận đặt phòng
    </Button>
  ]}
  className="booking-modal"
>
  {selectedRoom && (
    <div className="py-4">
      {/* Hotel Info */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FontAwesomeIcon icon={faBuilding} className="text-blue-500" />
          <Text strong className="text-lg">{hotel.name}</Text>
        </div>
        <Text className="text-gray-600 ml-7">{hotel.address}</Text>
      </div>

      {/* Room Details */}
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <FontAwesomeIcon icon={faBed} className="text-blue-500" />
              <Text strong>Loại phòng</Text>
            </div>
            <Text className="ml-6">{selectedRoom.roomType}</Text>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
              <Text strong>Sức chứa</Text>
            </div>
            <Text className="ml-6">{selectedRoom.capacity} người</Text>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <FontAwesomeIcon icon={faEye} className="text-blue-500" />
              <Text strong>View</Text>
            </div>
            <Text className="ml-6">{selectedRoom.view}</Text>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <FontAwesomeIcon icon={faRuler} className="text-blue-500" />
              <Text strong>Diện tích</Text>
            </div>
            <Text className="ml-6">{selectedRoom.size}m²</Text>
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <div>
              <Text strong className="text-lg">Tổng tiền</Text>
              <div className="text-gray-500 text-sm">Đã bao gồm thuế và phí</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {formatPrice(selectedRoom.price)}
              </div>
              <div className="text-gray-500 text-sm">/ đêm</div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-4 pt-4 border-t">
          <Text strong className="mb-3 block">Tiện nghi phòng</Text>
          <div className="grid grid-cols-2 gap-3">
            {selectedRoom.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                <Text>{amenity}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}
</Modal>

{/* Add custom styles */}

</div>
    </div>
  );
};
{/* Add custom styles */}
<style jsx>{`
  .hotel-carousel {
    margin-bottom: 24px;
  }

  .hotel-carousel .slick-prev,
  .hotel-carousel .slick-next {
    z-index: 10;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }

  .hotel-carousel .slick-prev {
    left: 20px;
  }

  .hotel-carousel .slick-next {
    right: 20px;
  }

  .hotel-carousel .slick-prev:hover,
  .hotel-carousel .slick-next:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .hotel-carousel .slick-dots {
    bottom: 16px;
  }

  .hotel-carousel .slick-dots li button {
    background: white;
    opacity: 0.5;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .hotel-carousel .slick-dots li.slick-active button {
    opacity: 1;
    transform: scale(1.2);
  }
     .booking-modal .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
  }

  .booking-modal .ant-modal-header {
    border-bottom: none;
    padding: 24px 24px 0;
  }

  .booking-modal .ant-modal-body {
    padding: 24px;
  }

  .booking-modal .ant-modal-footer {
    border-top: 1px solid #f0f0f0;
    padding: 16px 24px;
  }
`}</style>
export default HotelDetail;