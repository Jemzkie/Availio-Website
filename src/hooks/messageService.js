import { collection, addDoc, getDocs, getDoc, doc, setDoc, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

// ✅ Create or Get a Conversation between two users
export const getOrCreateConversation = async (userId1, userId2) => {
  try {
    // Sort user IDs to ensure uniqueness regardless of order
    const participants = [userId1, userId2].sort();
    const conversationId = `${participants[0]}_${participants[1]}`;

    const conversationRef = doc(db, "conversations", conversationId);
    const conversationSnap = await getDoc(conversationRef);

    if (!conversationSnap.exists()) {
      await setDoc(conversationRef, {
        participants,
        createdAt: Timestamp.now(),
      });
    }

    return conversationId;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw new Error("Failed to create conversation");
  }
};

// ✅ Send Message
export const sendMessage = async (conversationId, senderId, message) => {
  try {
    if (!conversationId || !senderId || !message) {
      throw new Error("Missing required fields");
    }

    const messageRef = collection(db, "conversations", conversationId, "messages");
    const newMessage = {
      senderId,
      message,
      createdAt: Timestamp.now(),
    };

    await addDoc(messageRef, newMessage);
    return { success: true, message: "Message sent successfully" };
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
};

// ✅ Get Messages in a Conversation
export const getMessages = async (conversationId) => {
  try {
    if (!conversationId) {
      throw new Error("Missing conversation ID");
    }

    const messagesQuery = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "asc")
    );
    const messagesSnapshot = await getDocs(messagesQuery);

    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to get messages");
  }
};

// ✅ Get Conversations for a User
export const getConversations = async (userId) => {
  try {
    if (!userId) {
      throw new Error("Missing user ID");
    }

    const conversationsQuery = query(
      collection(db, "conversations"),
      where("participants", "array-contains", userId)
    );
    const conversationsSnapshot = await getDocs(conversationsQuery);

    const conversations = conversationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return conversations;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw new Error("Failed to get conversations");
  }
};
