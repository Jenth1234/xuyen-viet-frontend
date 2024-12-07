import React, { useEffect, useState } from 'react';
import { Card, Button, Avatar, Carousel, Spin, message, Tabs, Form, DatePicker, Select, Row, Col } from 'antd';
import { 
  RightOutlined, 
  EnvironmentOutlined, 
  FireOutlined,
  CalendarOutlined, 
  CoffeeOutlined, 
  BankOutlined,
  StarOutlined, 
  GiftOutlined,
  RocketOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { getTop10 } from '../api/ApiPlace';
import { searchFlights } from '../api/ApiFlight';
import dayjs from 'dayjs';
import { getShareableItems } from '../api/ApiItinerary';
import 'dayjs/locale/vi';

const { Option } = Select;

const placeholderImage = 'https://res.cloudinary.com/dbdl1bznw/image/upload/v1732260755/placeholder_h89vxq.jpg';

// Constants
const CATEGORY_ICONS = {
  BEACH: <EnvironmentOutlined className="text-blue-500" />,
  ATTRACTION: <BankOutlined className="text-purple-500" />,
  FESTIVAL: <CalendarOutlined className="text-red-500" />,
  CAFE: <CoffeeOutlined className="text-yellow-500" />
};

const CATEGORY_NAMES = {
  BEACH: 'Bãi biển',
  ATTRACTION: 'Điểm tham quan', 
  FESTIVAL: 'Lễ hội',
  CAFE: 'Quán café'
};

const AIRPORTS = [
  { code: 'HAN', name: 'Hà Nội (HAN)' },
  { code: 'SGN', name: 'Hồ Chí Minh (SGN)' },
  { code: 'DAD', name: 'Đà Nẵng (DAD)' },
  { code: 'PQC', name: 'Phú Quốc (PQC)' },
];

// SharedItineraryCard Component
const SharedItineraryCard = ({ item }) => {
  const navigate = useNavigate();
  
  return (
    <Card
      hoverable
      className="h-[400px] flex flex-col"
      cover={
        <div className="relative h-48">
          <img
            alt={item.NAME}
            src={placeholderImage}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="flex items-center text-white">
              <CalendarOutlined className="mr-2" />
              <span>{dayjs(item.START_DATE).format('DD/MM/YYYY')}</span>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col h-full">
        <Card.Meta
          title={<div className="text-lg font-bold truncate">{item.NAME}</div>}
          description={
            <div className="flex flex-col flex-grow">
              <p className="text-gray-600 mb-2">
                {dayjs(item.START_DATE).format('DD/MM/YYYY')} - {dayjs(item.END_DATE).format('DD/MM/YYYY')}
              </p>
            </div>
          }
        />
        <Button 
          type="primary" 
          block 
          className="mt-auto"
          onClick={() => navigate(`/itinerary/${item._id}`)}
        >
          Xem chi tiết
        </Button>
      </div>
    </Card>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState({
    BEACH: [],
    ATTRACTION: [],
    FESTIVAL: [],
    CAFE: []
  });
  const [loading, setLoading] = useState(true);
  const [searchingFlights, setSearchingFlights] = useState(false);
  const [sharedItems, setSharedItems] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [placesResponse, sharedResponse] = await Promise.all([
        getTop10(),
        getShareableItems()
      ]);

      if (placesResponse?.success && placesResponse?.data) {
        setPlaces(placesResponse.data);
      }

      if (sharedResponse?.items && Array.isArray(sharedResponse.items)) {
        setSharedItems(sharedResponse.items);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchFlights = async (values) => {
    try {
      setSearchingFlights(true);
      if (values.origin === values.destination) {
        message.error('Điểm đi và điểm đến không được trùng nhau');
        return;
      }

      const response = await searchFlights(
        values.origin,
        values.destination,
        values.departureDate.format('YYYY-MM-DD')
      );

      if (response && Array.isArray(response)) {
        navigate('/flight-list', {
          state: {
            flights: response,
            searchInfo: {
              origin: values.origin,
              destination: values.destination,
              departureDate: values.departureDate.format('YYYY-MM-DD'),
              originName: AIRPORTS.find(a => a.code === values.origin)?.name,
              destinationName: AIRPORTS.find(a => a.code === values.destination)?.name
            }
          }
        });
      } else {
        message.warning('Không tìm thấy chuyến bay phù hợp');
      }
    } catch (error) {
      message.error('Không thể tìm chuyến bay: ' + error.message);
    } finally {
      setSearchingFlights(false);
    }
  };

  const renderPlaceCard = (place) => (
    <Card
      key={place.placeId}
      hoverable
      cover={
        <img
          alt={place.name}
          src={place.image?.NORMAL?.[0] || placeholderImage}
          className="h-48 object-cover"
        />
      }
      className="h-[450px] flex flex-col"
    >
      <div className="flex flex-col h-full">
        <Card.Meta
          title={<div className="text-lg font-bold truncate">{place.name}</div>}
          description={
            <div className="flex flex-col flex-grow">
              <p className="text-gray-600 mb-2 line-clamp-3 h-[4.5rem] overflow-hidden">
                <EnvironmentOutlined className="mr-1" />
                {place.des || 'Chưa có mô tả'}
              </p>
              {place.votes && (
                <div className="flex items-center mt-2">
                  <StarOutlined className="text-yellow-500 mr-1" />
                  <span>{Object.values(place.votes).reduce((a, b) => a + b, 0)} đánh giá</span>
                </div>
              )}
            </div>
          }
        />
        <Button 
          type="primary" 
          block 
          className="mt-auto"
          onClick={() => navigate(`/place/${place.placeId}`)}
        >
          Xem chi tiết
        </Button>
      </div>
    </Card>
  );

  const renderFlightSearch = () => (
    <div 
      className="relative py-24 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dbdl1bznw/image/upload/v1732261488/round-trip-flight_bfdmas.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 relative">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <RocketOutlined className="mr-2 text-blue-500" />
            Tìm kiếm chuyến bay
          </h2>
          
          <Form
            form={form}
            onFinish={handleSearchFlights}
            layout="vertical"
            className="max-w-4xl mx-auto"
          >
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="origin"
                  label="Điểm đi"
                  rules={[{ required: true, message: 'Vui lòng chọn điểm đi' }]}
                >
                  <Select placeholder="Chọn sân bay">
                    {AIRPORTS.map(airport => (
                      <Option key={airport.code} value={airport.code}>
                        {airport.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item
                  name="destination"
                  label="Điểm đến"
                  rules={[{ required: true, message: 'Vui lòng chọn điểm đến' }]}
                >
                  <Select placeholder="Chọn sân bay">
                    {AIRPORTS.map(airport => (
                      <Option key={airport.code} value={airport.code}>
                        {airport.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item
                  name="departureDate"
                  label="Ngày đi"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày đi' }]}
                >
                  <DatePicker
                    className="w-full"
                    format="DD/MM/YYYY"
                    disabledDate={current => current && current < dayjs().startOf('day')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mb-0 text-center">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={searchingFlights}
                icon={<RocketOutlined />}
              >
                Tìm chuyến bay
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Carousel section */}
      {places.BEACH?.length > 0 && (
        <Carousel autoplay effect="fade" className="h-[600px]">
          {places.BEACH.slice(0, 3).map((beach) => (
            <div key={beach.placeId} className="relative h-[600px]">
              <img
                src={beach.image?.NORMAL?.[0] || placeholderImage}
                alt={beach.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
                <div className="container mx-auto h-full flex flex-col justify-end text-white px-4 pb-20">
                  <h1 className="text-6xl font-bold mb-4">{beach.name}</h1>
                  <p className="text-xl mb-6 max-w-2xl">{beach.des}</p>
                  <Link to={`/place/${beach.placeId}`}>
                    <Button type="primary" size="large">
                      Khám phá ngay
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      )}

      {/* Flight search section */}
      {renderFlightSearch()}

      {/* Places sections */}
      {Object.entries(places).map(([category, items]) => 
        items && items.length > 0 && (
          <div key={category} className="container mx-auto py-16 px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold flex items-center">
                {CATEGORY_ICONS[category]}
                <span className="ml-2">{CATEGORY_NAMES[category]}</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {items.map(place => renderPlaceCard(place))}
            </div>
          </div>
        )
      )}

      {/* Shared Itineraries section */}
      {sharedItems && sharedItems.length > 0 && (
        <div className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <ShareAltOutlined className="mr-2" />
            Lịch trình được chia sẻ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sharedItems.map(item => (
              <SharedItineraryCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;