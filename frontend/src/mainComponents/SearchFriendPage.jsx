import React from 'react';
import Sidebar from '../chatComponents/sidebar.jsx';
import SearchFriend from '../chatComponents/searchFriend.jsx';

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
