import React, { useState } from 'react';
import { loginUser } from '../api/callApi';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Button, Input, Form, Alert, Typography, notification } from 'antd';

const { Title, Text } = Typography;

const Login = () => {
  const [USERNAME, setUsername] = useState('');
  const [PASSWORD, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const result = await loginUser(values.username, values.password);
      if (result.data && result.data.accessToken) {
        localStorage.setItem('token', result.data.accessToken);
        const savedToken = localStorage.getItem('token');

        if (savedToken === result.data.accessToken) {
          notification.success({
            message: 'Đăng nhập thành công',
            description: 'Bạn đã đăng nhập thành công!',
            placement: 'topRight',
          });

          navigate('/');
        } else {
          notification.error({
            message: 'Lỗi',
            description: 'Không thể lưu token vào localStorage!',
            placement: 'topRight',
          });
        }
      } else {
        setError('Không lấy được token');
      }
    } catch (error) {
      setError('Sai tên đăng nhập hoặc mật khẩu');
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-blue-200">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <Title level={2} className="text-center mb-6" style={{ color: '#333' }}>
          Đăng Nhập
        </Title>
        {error && <Alert message={error} type="error" showIcon className="mb-4" />}
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input
              value={USERNAME}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập của bạn"
              className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              value={PASSWORD}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu của bạn"
              className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              iconRender={(visible) =>
                visible ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />
              }
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-medium py-2 px-4 rounded-md shadow-md"
          >
            Đăng nhập
          </Button>
        </Form>

        <div className="mt-4 text-center">
          <Text className="text-gray-600">Chưa có tài khoản?</Text>
          <Button type="link" onClick={goToRegister} className="mt-2 text-blue-600 hover:text-blue-800">
            Đăng ký ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;