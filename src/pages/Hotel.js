import React, { useState } from 'react';
import { Form, DatePicker, Select, Button, Popover, message } from 'antd';
import { SearchOutlined, EnvironmentOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ApiHotel } from '../api/ApiHotel';
import 'dayjs/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const BookingHotel = () => {
  const [form] = Form.useForm();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const cities = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hochiminh', label: 'Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'nhatrang', label: 'Nha Trang' },
    { value: 'phuquoc', label: 'Phú Quốc' },
    { value: 'dalat', label: 'Đà Lạt' },
    { value: 'cantho', label: 'Cần Thơ' },
  ];
  const handleSearch = async (values) => {
    try {
      setLoading(true);
      
      // Lấy giá trị địa điểm từ form, nếu không có thì lấy label từ city được chọn
      const selectedCity = cities.find(city => city.value === values.location);
      const cityName = selectedCity ? selectedCity.label : 'Cần Thơ'; // Mặc định là Cần Thơ
      
      // Chuẩn bị params với số người mặc định là 2 nếu không chọn
      const searchParams = {
        city: cityName,
        checkIn: values.checkIn.format('YYYY-MM-DD'),
        checkOut: values.checkOut.format('YYYY-MM-DD'),
        adults: adults || 2, // Mặc định 2 người lớn
        children: children || 0 // Mặc định 0 trẻ em
      };
  
      // Gọi API search hotels
      const result = await ApiHotel.searchHotels(searchParams);
      
      if (result.status === 'success') {
        // Chuyển hướng đến trang kết quả với dữ liệu
        navigate('/hotel-search-results', { 
          state: { 
            searchResults: result,
            searchParams: {
              ...searchParams,
              checkIn: values.checkIn.format('DD/MM/YYYY'),
              checkOut: values.checkOut.format('DD/MM/YYYY')
            }
          } 
        });
      } else {
        message.error('Không tìm thấy khách sạn phù hợp');
      }
  
    } catch (error) {
      console.error('Search error:', error);
      message.error('Có lỗi xảy ra khi tìm kiếm khách sạn');
    } finally {
      setLoading(false);
    }
  };
  const guestsContent = (
    <div className="p-4 w-72">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="font-medium">Người lớn</div>
          <div className="text-sm text-gray-500">Từ 13 tuổi trở lên</div>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => setAdults(Math.max(1, adults - 1))}
            disabled={adults <= 1}
            className="flex items-center justify-center w-8 h-8 rounded-full"
          >
            -
          </Button>
          <span className="w-8 text-center">{adults}</span>
          <Button
            onClick={() => setAdults(Math.min(10, adults + 1))}
            disabled={adults >= 10}
            className="flex items-center justify-center w-8 h-8 rounded-full"
          >
            +
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">Trẻ em</div>
          <div className="text-sm text-gray-500">Từ 0-12 tuổi</div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setChildren(Math.max(0, children - 1))}
            disabled={children <= 0}
            className="flex items-center justify-center w-8 h-8 rounded-full"
          >
            -
          </Button>
          <span className="w-8 text-center">{children}</span>
          <Button
            onClick={() => setChildren(Math.min(5, children + 1))}
            disabled={children >= 5}
            className="flex items-center justify-center w-8 h-8 rounded-full"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
  return (
    <div 
      className="min-h-screen py-20 px-4"
      style={{
        backgroundImage: 'url(https://res.cloudinary.com/dbdl1bznw/image/upload/v1732442400/booking_ik4kvt.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-3xl mx-auto">
        <Form
          form={form}
          layout="vertical"
          className="bg-[#2c4975] p-8 rounded-2xl shadow-xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Đặt Phòng Khách Sạn
            </h1>
            <p className="text-gray-300">
              Bạn muốn đi đâu?
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-2">
              <Form.Item
                name="location"
                rules={[{ required: true, message: 'Vui lòng chọn điểm đến' }]}
                className="mb-0"
              >
                <Select
                  showSearch
                  placeholder="Bạn muốn đi đâu?"
                  optionFilterProp="children"
                  className="h-12"
                  suffixIcon={<EnvironmentOutlined className="text-gray-400" />}
                >
                  {cities.map(city => (
                    <Option key={city.value} value={city.value}>
                      <div className="flex items-center">
                        <EnvironmentOutlined className="mr-2" />
                        {city.label}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="col-span-1">
            <Form.Item
  name="guests"
  initialValue={{ adults: 2, children: 0 }} // Thêm giá trị mặc định
  className="mb-0"
>
  <Popover 
    content={guestsContent} 
    trigger="click" 
    placement="bottom"
    overlayClassName="guests-popover"
  >
    <Button className="w-full h-12 bg-white text-left px-4 flex items-center justify-between">
      <div className="flex items-center truncate">
        <UserOutlined className="mr-2 text-gray-400 flex-shrink-0" />
        <span className="truncate">{adults || 2} người lớn{children > 0 ? `, ${children} trẻ em` : ''}</span>
      </div>
      <div className="text-gray-400 flex-shrink-0">▼</div>
    </Button>
  </Popover>
</Form.Item>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="checkIn"
              rules={[{ required: true, message: 'Vui lòng chọn ngày đến' }]}
            >
              <DatePicker
                placeholder="Ngày đến"
                format="DD/MM/YYYY"
                className="w-full h-12"
                locale={locale}
                suffixIcon={<CalendarOutlined className="text-gray-400" />}
                disabledDate={(current) => {
                  return current && current < dayjs().startOf('day');
                }}
              />
            </Form.Item>

            <Form.Item
              name="checkOut"
              rules={[{ required: true, message: 'Vui lòng chọn ngày đi' }]}
            >
              <DatePicker
                placeholder="Ngày đi"
                format="DD/MM/YYYY"
                className="w-full h-12"
                locale={locale}
                suffixIcon={<CalendarOutlined className="text-gray-400" />}
                disabledDate={(current) => {
                  const checkInDate = form.getFieldValue('checkIn');
                  return current && (current < dayjs().startOf('day') || 
                    (checkInDate && current < checkInDate));
                }}
              />
            </Form.Item>
          </div>

        <Form.Item className="mt-8">
    <Button
      type="primary"
      htmlType="submit"
      size="large"
      loading={loading}
      onClick={() => form.submit()}
      className="w-full h-12 bg-blue-500 hover:bg-blue-600 border-0 rounded-lg text-lg font-medium flex items-center justify-center"
    >
      <SearchOutlined className="text-xl mr-2" />
      Tìm Khách Sạn
    </Button>
  </Form.Item>

  <Form
    form={form}
    layout="vertical"
    onFinish={handleSearch}
    className="bg-[#2c4975] p-8 rounded-2xl shadow-xl"
  ></Form>
        </Form>
      </div>

      <style jsx>{`
        .ant-select-selector,
        .ant-picker {
          background-color: #ffffff !important;
          border: 1px solid #e5e7eb !important;
          height: 48px !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          display: flex;
          align-items: center;
        }

        .ant-select-selection-search-input {
          height: 46px !important;
        }

        .ant-select-selection-placeholder,
        .ant-select-selection-item {
          line-height: 32px !important;
        }

        .guests-popover .ant-popover-inner {
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .guests-popover .ant-popover-arrow {
          display: none;
        }
      `}</style>
    </div>
  );

};

export default BookingHotel;   