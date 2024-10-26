import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="max-w-3xl   mt-32 p-8">
      <div className="flex items-center border p-2 border-gray-300 rounded-2xl shadow-md">
        <input
          type="text"
          placeholder="Tìm kiếm tỉnh/thành phố..."
          
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border-none rounded-lg focus:outline-none focus:ring-2"
        />
        
        <button
          onClick={() => {}}
          className="bg-green-500 text-white p-2 rounded-xl mr-1 shadow-md hover:bg-green-400 transition duration-400 flex items-center"
        >
       
          Tìm kiếm
        </button>
      </div>
    </div>
  );
};

export default Search;
