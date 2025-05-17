import React, { useEffect, useState } from "react";
import SmallProfile from "../General/SmallProfile";
import { IoFilter } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useSession } from "../../context/SessionContext";
import { getConversations, getMessages, getOrCreateConversation, sendMessage } from "../../hooks/messageService";
import MessageContainer from "./MessageContainer";
import fetchUser from "../../hooks/userData";

const Messaging = ({ userData, ViewData, listingsData }) => {
  const { user } = useSession();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [otherUsers, setOtherUsers] = useState({});
  const [showTestUser, setShowTestUser] = useState(true);

  // Test user data
  const testUser = {
    uid: "test_user_123",
    displayName: "Test User",
    profilePic: "/default-avatar.png",
    displayRole: "Vehicle Owner"
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversationsData = await getConversations(user.uid);
        
        // Filter conversations to only show those where the other user messaged first
        const filteredConversations = await Promise.all(
          conversationsData.map(async (conversation) => {
            const messages = await getMessages(conversation.id);
            const firstMessage = messages[0];
            return firstMessage?.senderId !== user.uid ? conversation : null;
          })
        );

        const validConversations = filteredConversations.filter(Boolean);
        setConversations(validConversations);

        // Fetch other users' data for each conversation
        const usersData = {};
        for (const conversation of validConversations) {
          const otherUserId = conversation.participants.find(id => id !== user.uid);
          if (otherUserId && !usersData[otherUserId]) {
            const otherUserData = await fetchUser(otherUserId);
            usersData[otherUserId] = otherUserData;
          }
        }
        setOtherUsers(usersData);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    if (user?.uid) {
      fetchConversations();
    }
  }, [user]);

  const handleTestUserClick = async () => {
    try {
      // Create a conversation with the test user
      const conversationId = await getOrCreateConversation(user.uid, testUser.uid);
      
      // Send a test message
      await sendMessage(conversationId, testUser.uid, "Hello! I'm a test user. Feel free to message me!");
      
      // Create a new conversation object
      const newConversation = {
        id: conversationId,
        participants: [user.uid, testUser.uid],
        lastMessage: "Hello! I'm a test user. Feel free to message me!",
        lastMessageTime: new Date(),
      };
      
      // Update conversations and otherUsers state
      setConversations(prev => [newConversation, ...prev]);
      setOtherUsers(prev => ({
        ...prev,
        [testUser.uid]: testUser
      }));
      
      // Select the new conversation
      setSelectedConversation(newConversation);
      setShowTestUser(false);
    } catch (error) {
      console.error("Error creating test conversation:", error);
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    const otherUserId = conversation.participants.find(id => id !== user.uid);
    const otherUser = otherUsers[otherUserId];
    if (!otherUser) return false;
    
    return otherUser.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col font-jakarta flex-1 p-5">
      <div className="flex w-full h-20 flex-row items-center justify-end mb-4 border-b border-gray-400">
        <SmallProfile listings={listingsData} userData={userData} />
      </div>

      <div className="w-full flex flex-row h-auto flex-1 gap-5">
        <div className="w-1/4 flex flex-col h-[calc(100vh-12rem)]">
          <div className="flex flex-row justify-between items-center">
            <label className="text-4xl font-jakarta font-semibold">
              Messaging
            </label>
            <button className="cursor-pointer font-jakarta py-2 px-3 rounded-lg flex flex-row items-center gap-2">
              <IoFilter />
              All
            </button>
          </div>
          <div className="bg-gray-100 flex flex-row items-center px-5 py-2 rounded-lg gap-2 mt-4">
            <CiSearch className="w-6 h-6 font-semibold" />
            <input
              placeholder="Search conversations..."
              className="text-lg w-full text-gray-500 font-jakarta"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-1 mt-5 overflow-y-auto custom-scrollbar">
            {showTestUser && (
              <div
                className="border-b px-4 flex flex-row gap-4 py-3 border-gray-400 h-24 w-full cursor-pointer hover:bg-gray-50"
                onClick={handleTestUserClick}
              >
                <img 
                  className="rounded-full w-12 h-12 object-cover" 
                  src={testUser.profilePic} 
                  alt={testUser.displayName}
                />
                <div className="flex flex-col justify-evenly">
                  <label className="text-lg font-semibold">
                    {testUser.displayName}
                  </label>
                  <label className="text-sm text-gray-400 transform -translate-y-1 max-w-48 text-nowrap overflow-hidden">
                    Click to start a test conversation
                  </label>
                </div>
              </div>
            )}
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
                const otherUserId = conversation.participants.find(id => id !== user.uid);
                const otherUser = otherUsers[otherUserId];
                
                if (!otherUser) return null;

                return (
                  <div
                    key={conversation.id}
                    className={`border-b px-4 flex flex-row gap-4 py-3 border-gray-400 h-24 w-full cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <img 
                      className="rounded-full w-12 h-12 object-cover" 
                      src={otherUser.profilePic || "/default-avatar.png"} 
                      alt={otherUser.displayName}
                    />
                    <div className="flex flex-col justify-evenly">
                      <label className="text-lg font-semibold">
                        {otherUser.displayName}
                      </label>
                      <label className="text-sm text-gray-400 transform -translate-y-1 max-w-48 text-nowrap overflow-hidden">
                        {conversation.lastMessage || "No messages yet"}
                      </label>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="justify-center flex">
                <label className="text-gray-400 text-xl font-jakarta">
                  No conversations yet
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 h-[calc(100vh-12rem)]">
          {selectedConversation ? (
            <MessageContainer 
              conversationId={selectedConversation.id}
              otherUserId={selectedConversation.participants.find(id => id !== user.uid)}
              otherUser={otherUsers[selectedConversation.participants.find(id => id !== user.uid)]}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-xl">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;
