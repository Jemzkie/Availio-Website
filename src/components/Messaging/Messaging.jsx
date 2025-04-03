import React, { useEffect, useState } from "react";
import SmallProfile from "../General/SmallProfile";
import { IoFilter } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useSession } from "../../context/SessionContext";
import { getConversations } from "../../hooks/messageService";
import MessageContainer from "./MessageContainer";
const Messaging = ({ ViewData }) => {
  const { user } = useSession();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const data = async () => {
      try {
        // const userListData = await getConversations(user.uid);
        const userListData = [
          { uid: 1, username: "User 1", profilePic: "user1.jpg" },
          { uid: 2, username: "User 2", profilePic: "user2.jpg" },
          { uid: 3, username: "User 3", profilePic: "user3.jpg" },
        ];
        setUserList(userListData);
      } catch (error) {
        console.log(error);
      }
    };
    data();
  }, [user]);
  return (
    <div className="flex flex-col font-jakarta flex-1 p-5">
      <div className="flex w-full h-20 flex-row items-center justify-end mb-4 border-b border-gray-400">
        <SmallProfile />
      </div>

      <div className="w-full flex flex-row h-auto flex-1 gap-5">
        <div className="w-1/4 flex flex-col">
          <div className="flex flex-row justify-between items-center">
            {/*User Conversation List*/}
            <label className="text-4xl font-jakarta font-semibold">
              Messaging
            </label>
            <button className="cursor-pointer font-jakarta py-2 px-3 rounded-lg flex flex-row items-center gap-2">
              <IoFilter />
              Renters
            </button>
          </div>
          <div className=" bg-gray-100 flex flex-row items-center px-5 py-2 rounded-lg gap-2 mt-4">
            <CiSearch className="w-6 h-6 font-semibold" />
            <input
              placeholder="Search In People..."
              className="text-lg w-full text-gray-500 font-jakarta"
            />
          </div>
          <div className="flex-1 h-auto mt-5">
            {userList.length > 0 ? (
              userList.map((user) => (
                /*Render Users Here*/
                <div
                  key={user.uid}
                  className="border-b px-4 flex flex-row gap-4 py-3 border-gray-400 h-24 w-full"
                >
                  <img className="rounded-full" src="/2.jpg" />
                  <div className="flex flex-col justify-evenly">
                    <label className="text-lg font-semibold">
                      {user.username}
                    </label>
                    <label className="text-sm text-gray-400 transform -translate-y-1 max-w-48 text-nowrap overflow-hidden">
                      Render Recent Message Here...
                    </label>
                  </div>
                </div>
              ))
            ) : (
              /*Else Render This*/
              <div className="justify-center flex">
                <label className="text-gray-400 text-xl font-jakarta">
                  No Renters Messaged Yet
                </label>
              </div>
            )}
          </div>
        </div>
        {/*User Messages Container*/}
        <div className="flex-1">
          <MessageContainer uid={1} />
        </div>
      </div>
    </div>
  );
};

export default Messaging;
