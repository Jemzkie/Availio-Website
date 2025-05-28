import React, { useEffect, useState } from "react";
import SmallProfile from "../General/SmallProfile";
import { IoFilter } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useSession } from "../../context/SessionContext";
import { getConversations, getMessages, getOrCreateConversation, sendMessage } from "../../hooks/messageService";
import MessageContainer from "./MessageContainer";
import fetchUser from "../../hooks/userData";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const Messaging = ({ userData, ViewData, listingsData }) => {
  const { user } = useSession();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [otherUsers, setOtherUsers] = useState({});

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        console.log("=== Starting Conversation Fetch ===");
        console.log("Current user ID:", user.uid);
        
        const conversationsData = await getConversations(user.uid);
        console.log("Fetched conversations:", conversationsData);
        
        setConversations(conversationsData);

        // Fetch other users' data for each conversation
        const usersData = {};
        for (const conversation of conversationsData) {
          console.log("\n=== Processing Conversation ===");
          console.log("Conversation ID:", conversation.id);
          console.log("Participants:", conversation.participants);
          
          // Get both participants' data
          for (const participantId of conversation.participants) {
            if (!usersData[participantId]) {
              console.log("\nFetching data for participant:", participantId);
              const userData = await fetchUser(participantId);
              
              if (userData) {
                // Log the raw user data
                console.log("Raw user data received:", userData);
                
                // Create the user object with all necessary fields
                const processedUser = {
                  ...userData,
                  uid: participantId,
                  displayName: userData.username || userData.firstName || "Unknown User",
                  profilePic: userData.personalProfile || userData.profilePicture || "https://firebasestorage.googleapis.com/v0/b/scootergaming-8c4c9.appspot.com/o/defaults%2FCat.jpg?alt=media"
                };
                
                console.log("Processed user data:", {
                  uid: processedUser.uid,
                  displayName: processedUser.displayName,
                  profilePic: processedUser.profilePic
                });
                
                usersData[participantId] = processedUser;
              } else {
                console.log("No user data found for participant:", participantId);
              }
            }
          }
        }
        
        console.log("\n=== Final Users Data ===");
        console.log(usersData);
        setOtherUsers(usersData);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    if (user?.uid) {
      fetchConversations();
    }
  }, [user]);

  // Add real-time conversation updates
  useEffect(() => {
    if (!user?.uid) return;

    console.log("Setting up real-time conversation listener...");
    const unsubscribe = onSnapshot(
      collection(db, "conversations"),
      async (snapshot) => {
        console.log("Real-time update - Number of conversations:", snapshot.size);
        const conversationsData = snapshot.docs
          .map(doc => {
            const data = doc.data();
            console.log("Conversation document:", { id: doc.id, ...data });
            return { id: doc.id, ...data };
          })
          .filter(conversation => conversation.participants?.includes(user.uid));
        
        console.log("Filtered conversations for current user:", conversationsData);
        setConversations(conversationsData);

        // Update other users data
        const usersData = { ...otherUsers };
        for (const conversation of conversationsData) {
          console.log("Processing conversation in real-time:", conversation);
          // Get both participants' data
          for (const participantId of conversation.participants) {
            if (!usersData[participantId]) {
              console.log("Real-time - Fetching user data for:", participantId);
              const userData = await fetchUser(participantId);
              console.log("Real-time - Fetched user data:", userData);
              if (userData) {
                // Create the user object with all necessary fields
                const processedUser = {
                  ...userData,
                  uid: participantId,
                  displayName: userData.username || userData.firstName || "Unknown User",
                  profilePic: userData.personalProfile || userData.profilePicture || "https://firebasestorage.googleapis.com/v0/b/scootergaming-8c4c9.appspot.com/o/defaults%2FCat.jpg?alt=media"
                };
                
                console.log("Real-time - Processed user data:", {
                  uid: processedUser.uid,
                  displayName: processedUser.displayName,
                  profilePic: processedUser.profilePic
                });
                
                usersData[participantId] = processedUser;
              }
            }
          }
        }
        console.log("Final real-time users data:", usersData);
        setOtherUsers(usersData);
      },
      (error) => {
        console.error("Error listening to conversations:", error);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const filteredConversations = conversations.filter(conversation => {
    // Get both participants' data
    const participant1 = otherUsers[conversation.participants[0]];
    const participant2 = otherUsers[conversation.participants[1]];
    
    console.log("Filtering conversation:", conversation.id);
    console.log("Participants data:", { participant1, participant2 });
    
    // If we don't have user data for either participant, don't show the conversation
    if (!participant1 || !participant2) {
      console.log("Missing participant data for conversation:", conversation.id);
      return false;
    }
    
    // If no search query, show all conversations
    if (!searchQuery) return true;
    
    // Filter based on search query
    const searchLower = searchQuery.toLowerCase();
    const matches = participant1.displayName?.toLowerCase().includes(searchLower) ||
           participant2.displayName?.toLowerCase().includes(searchLower);
    
    console.log("Search match result for conversation:", conversation.id, matches);
    return matches;
  });

  console.log("Current conversations:", conversations);
  console.log("Current otherUsers:", otherUsers);
  console.log("Filtered conversations:", filteredConversations);

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
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
                // Get both participants
                const participant1 = otherUsers[conversation.participants[0]];
                const participant2 = otherUsers[conversation.participants[1]];
                
                console.log("\n=== Rendering Conversation ===");
                console.log("Conversation ID:", conversation.id);
                console.log("Participant 1:", participant1);
                console.log("Participant 2:", participant2);

                if (!participant1 || !participant2) {
                  console.log("Missing participant data for conversation:", conversation.id);
                  return null;
                }

                // Determine which participant is not the current user
                const otherUser = participant1.uid === user.uid ? participant2 : participant1;

                console.log("Selected other user:", {
                  uid: otherUser.uid,
                  displayName: otherUser.displayName,
                  profilePic: otherUser.profilePic
                });

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
                      src={otherUser.profilePic || "https://firebasestorage.googleapis.com/v0/b/scootergaming-8c4c9.appspot.com/o/defaults%2FCat.jpg?alt=media"} 
                      alt={otherUser.displayName || "User"}
                      onError={(e) => {
                        console.log("Profile picture failed to load for user:", otherUser.uid);
                        e.target.onerror = null;
                        e.target.src = "https://firebasestorage.googleapis.com/v0/b/scootergaming-8c4c9.appspot.com/o/defaults%2FCat.jpg?alt=media";
                      }}
                    />
                    <div className="flex flex-col justify-evenly flex-1">
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
                  No conversations found
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
