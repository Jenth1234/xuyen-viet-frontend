import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <a >
            Tên Blog Du Lịch
          </a>
        </div>
        <div className="mb-4">
          <p>Chia sẻ hành trình, kinh nghiệm và những câu chuyện thú vị từ những chuyến đi.</p>
        </div>
        <div className="mb-4 flex justify-center space-x-6">
          <a
            href="https://www.facebook.com"
            className="hover:text-yellow-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://www.instagram.com"
            className="hover:text-yellow-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://www.youtube.com"
            className="hover:text-yellow-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-youtube"></i>
          </a>
        </div>
        <div className="mb-4">
          <a href="/terms" className="text-sm text-gray-400 hover:text-white">
            Điều khoản sử dụng
          </a>{' '}
          |{' '}
          <a href="/privacy" className="text-sm text-gray-400 hover:text-white">
            Chính sách bảo mật
          </a>
        </div>
        <div className="text-sm text-gray-400">
          &copy; 2024 Tên Blog Du Lịch. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
