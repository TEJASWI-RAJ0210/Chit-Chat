import React from 'react';
import Sidebar from '../../components/navigation/Sidebar.jsx';
import SearchFriend from '../../components/chat/SearchFriend.jsx';

const SearchFriendPage = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Search Friend Panel */}
        <SearchFriend />
      </div>
    </div>
  );
};

export default SearchFriendPage;
