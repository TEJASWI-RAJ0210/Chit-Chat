import React from "react";
import {Search} from "lucide-react";

const SearchFriend=()=>{
    return(
        <div className="w-[400px] p-3 border-r ml-[409px]">
            <p className="text-sm font-medium text-gray-700 text-center">
                    Add Friend
                </p>
            <div className="flex items-center gap-2 rounded-lg border border-black bg-white px-3 py-2 shadow-md">
                <Search />
                <input
                    type="text"
                    placeholder="Search friend"
                    className="flex-grow outline-none"
                    
                />
                
                    
                

            </div>
            <div className="text-gray-600 hover:text-black">
                    <ul className="bg-white border rounded-md shadow-lg mt-2 w-full">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Tejaswi</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Soumya</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Anmolee</li>
                    </ul>
                    </div>
                
                <p className="text-sm font-medium text-gray-700 text-center">
                    Accept Request
                </p> 
                 <div className="text-gray-600 hover:text-black">
                    <ul className="bg-white border rounded-md shadow-lg mt-2 w-full">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Tejaswi</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Soumya</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Anmolee</li>
                    </ul>
                    </div>

        </div>
    );
}
export default SearchFriend;