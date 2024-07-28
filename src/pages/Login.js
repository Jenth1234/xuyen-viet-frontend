import React, { useState } from 'react';
import { loginUser } from '../api/callApi';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [USERNAME, setUsername] = useState('');
  const [PASSWORD, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser(USERNAME, PASSWORD);
      console.log('Login successful:', result);
      if (result.metadata && result.metadata.accessToken) {
        localStorage.setItem('accessToken', result.metadata.accessToken);
        const savedToken = localStorage.getItem('accessToken');
        console.log('Token saved:', savedToken);

        if (savedToken === result.metadata.accessToken) {
          console.log('Token saved successfully');
          alert('Token saved successfully');
        } else {
          console.error('Failed to save token');
          alert('Failed to save token');
        }

        navigate('/');
      } else {
        console.error('Access token is missing in the response:', result);
        setError('Failed to retrieve access token');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Hành Trình Xuyên Việt</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username:
            </label>
            <input
              type="text"
              value={USERNAME}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password:
            </label>
            <input
              type="password"
              value={PASSWORD}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
