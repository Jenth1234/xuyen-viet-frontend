import React from 'react';

const UserInfo = ({ user }) => {
  return (
    <div className="bg-white p-4 border rounded-lg shadow-md mb-4">
      <div className="flex items-center mb-4">
        <img 
          src={user.avatar} 
          alt={`${user.name}'s avatar`} 
          className="w-16 h-16 rounded-full border-2 border-gray-300 mr-4"
        />
        <div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-gray-600">Số tỉnh thành đã đi: {user.visitedCount}</p>
          <p className="text-gray-600">Số tỉnh thành còn lại: {user.remainingCount}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
