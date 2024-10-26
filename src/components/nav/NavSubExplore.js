import React from 'react';
import { Button } from 'antd';

const NavSubExplore = ({ onSelect }) => {
  return (
    <div className="flex space-x-4 mt-4">
      <Button onClick={() => onSelect('/explore/vote')} type="link" className="text-gray-700 hover:text-blue-500 transition duration-200">
        Vote
      </Button>
      <Button onClick={() => onSelect('/explore/explorePage')} type="link" className="text-gray-700 hover:text-blue-500 transition duration-200">
        Nội Dung
      </Button>
    </div>
  );
};

export default NavSubExplore;
