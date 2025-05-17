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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesData = await getMessages(conversationId);
        setMessages(messagesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
      }
    };

    if (conversationId) {
      fetchMessages();
    }
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
      
      // Refresh messages
      const updatedMessages = await getMessages(conversationId);
      setMessages(updatedMessages);
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
      const updatedMessages = await getMessages(conversationId);
      setMessages(updatedMessages);
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

      const updatedMessages = await getMessages(conversationId);
      setMessages(updatedMessages);
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
    <div className="w-full h-full flex flex-col">
      <div className="h-18 flex flex-row items-center px-4 justify-between border-b border-gray-200">
        <div className="flex flex-row font-jakarta gap-4 py-3">
          <img 
            className="rounded-full w-12 h-12 object-cover" 
            src={otherUser?.profilePic || "/default-avatar.png"} 
            alt={otherUser?.displayName}
          />
          <div className="flex flex-col">
            <label className="font-semibold">{otherUser?.displayName}</label>
            <div className="flex flex-row gap-2 items-center">
              <div className="rounded-full w-3 h-3 bg-green-400"></div>
              <label className="text-gray-600">Online</label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 rounded-md p-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === user.uid ? 'justify-end' : 'justify-start'} mb-4 group`}
            >
              <div className="relative max-w-[85%]">
                <div
                  className={`rounded-lg px-4 py-2 break-words ${
                    message.senderId === user.uid
                      ? 'bg-[#2E3B5B] text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {message.media && (
                    <div className="mb-2">
                      {message.media.type === 'image' ? (
                        <img 
                          src={message.media.url} 
                          alt="Shared image" 
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
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  <p className={`text-xs mt-1 ${message.senderId === user.uid ? 'text-gray-300' : 'text-gray-500'}`}>
                    {formatTimestamp(message.createdAt)}
                  </p>
                </div>
                
                {/* Message Reactions */}
                {message.reactions && Object.keys(message.reactions).length > 0 && (
                  <div className="absolute -bottom-4 right-0 flex gap-1 bg-white rounded-full px-2 py-1 shadow-sm">
                    {getReactionCount(message.reactions, 'like') > 0 && (
                      <span className="flex items-center gap-1">
                        <FaThumbsUp className="text-blue-500" />
                        <span className="text-xs">{getReactionCount(message.reactions, 'like')}</span>
                      </span>
                    )}
                    {getReactionCount(message.reactions, 'heart') > 0 && (
                      <span className="flex items-center gap-1">
                        <FaHeart className="text-red-500" />
                        <span className="text-xs">{getReactionCount(message.reactions, 'heart')}</span>
                      </span>
                    )}
                    {/* Add more reaction types as needed */}
                  </div>
                )}

                {/* Reaction Picker */}
                <button
                  className="absolute -right-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setShowReactionPicker(message.id)}
                >
                  <BsEmojiSmile className="text-gray-400 hover:text-gray-600" />
                </button>
                
                {showReactionPicker === message.id && (
                  <div className="absolute -right-32 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-2 flex gap-2">
                    <button onClick={() => handleReactionClick(message.id, 'like')}>
                      <FaThumbsUp className="text-blue-500 hover:scale-125 transition-transform" />
                    </button>
                    <button onClick={() => handleReactionClick(message.id, 'heart')}>
                      <FaHeart className="text-red-500 hover:scale-125 transition-transform" />
                    </button>
                    <button onClick={() => handleReactionClick(message.id, 'laugh')}>
                      <FaLaugh className="text-yellow-500 hover:scale-125 transition-transform" />
                    </button>
                    <button onClick={() => handleReactionClick(message.id, 'wow')}>
                      <FaSurprise className="text-yellow-500 hover:scale-125 transition-transform" />
                    </button>
                    <button onClick={() => handleReactionClick(message.id, 'sad')}>
                      <FaSadTear className="text-yellow-500 hover:scale-125 transition-transform" />
                    </button>
                    <button onClick={() => handleReactionClick(message.id, 'angry')}>
                      <FaAngry className="text-red-500 hover:scale-125 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={messagesEndRef} />
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
