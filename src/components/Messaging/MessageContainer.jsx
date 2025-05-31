import React, { useState, useEffect, useRef } from "react";
import { RxDashboard } from "react-icons/rx";
import { IoIosSend } from "react-icons/io";
import { useSession } from "../../context/SessionContext";
import { getMessages, sendMessage, updateMessageReaction } from "../../hooks/messageService";
import formatTimestamp from "../../utils/formatTimestamp";
import { IoImageOutline, IoVideocamOutline } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { FaHeart, FaThumbsUp, FaLaugh, FaSurprise, FaSadTear, FaAngry } from "react-icons/fa";
import EmojiPicker from 'emoji-picker-react';
import { storage } from "../../config/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import BookingBanner from "./BookingBanner";
import Cat from "../../assets/images/Cat.jpg";

const MessageContainer = ({ conversationId, otherUserId, otherUser }) => {
  const { user } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Set up real-time message listener
  useEffect(() => {
    if (!conversationId) return;

    setIsLoading(true);
    const messagesQuery = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error listening to messages:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage(conversationId, user.uid, newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleReactionClick = async (messageId, reaction) => {
    try {
      await updateMessageReaction(conversationId, messageId, user.uid, reaction);
      setShowReactionPicker(null);
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  const handleMediaUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingMedia(true);
      const storageRef = ref(storage, `messages/${conversationId}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Send message with media
      await sendMessage(conversationId, user.uid, "", {
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: downloadURL
      });
    } catch (error) {
      console.error("Error uploading media:", error);
    } finally {
      setUploadingMedia(false);
    }
  };

  const getReactionCount = (reactions, type) => {
    return reactions?.filter(r => r.type === type).length || 0;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <img
          src={otherUser?.profilePic || Cat}
          alt={otherUser?.displayName || "User"}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = Cat;
          }}
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">
              {otherUser?.displayName || "Unknown User"}
            </span>
            <BookingBanner userId={otherUserId} />
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === user.uid ? "justify-end" : "justify-start"
              }`}
            >
              {message.senderId !== user.uid && (
                <img
                  src={otherUser?.profilePic || Cat}
                  alt={otherUser?.displayName || "User"}
                  className="w-8 h-8 rounded-full object-cover mr-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = Cat;
                  }}
                />
              )}
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === user.uid
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {message.media && (
                  <div className="mb-2">
                    {message.media.type === "image" ? (
                      <img
                        src={message.media.url}
                        alt="Shared media"
                        className="max-w-full rounded-lg"
                      />
                    ) : (
                      <video
                        src={message.media.url}
                        controls
                        className="max-w-full rounded-lg"
                      />
                    )}
                  </div>
                )}
                <p>{message.message}</p>
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {message.reactions.map((reaction, index) => (
                      <span key={index}>{reaction.type}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="h-18 mt-4 flex gap-5 flex-row justify-between items-center px-4">
        <div className="flex-1 flex items-center gap-2 relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-500 hover:text-gray-700"
            >
              <BsEmojiSmile className="w-6 h-6" />
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 z-10">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-gray-700"
            disabled={uploadingMedia}
          >
            <IoImageOutline className="w-6 h-6" />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleMediaUpload}
            accept="image/*,video/*"
            className="hidden"
          />
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#2E3B5B]"
          />
        </div>
        
        <button 
          type="submit"
          className="bg-[#2E3B5B] px-6 py-3 rounded-md hover:bg-[#1E2B4B] transition-colors"
          disabled={uploadingMedia}
        >
          <IoIosSend className="text-white w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default MessageContainer;
