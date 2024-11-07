/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // Hoặc xóa dòng này nếu không sử dụng chế độ tối
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // thêm các đường dẫn khác nếu cần
  ],
  theme: {
    extend: {
      colors: {
        orange: '#FF5E1F', // Thêm màu tùy chỉnh
      },
    },
  },
  plugins: [],
};
