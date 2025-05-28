import { collection, addDoc, getDocs, getDoc, doc, setDoc, query, where, orderBy, Timestamp, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
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
        lastMessage: null,
        lastMessageTime: Timestamp.now(),
      });
    }

    return conversationId;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw new Error("Failed to create conversation");
  }
};

// ✅ Send Message
export const sendMessage = async (conversationId, senderId, message, media = null) => {
  try {
    if (!conversationId || !senderId) {
      throw new Error("Missing required fields");
    }

    const messageRef = collection(db, "conversations", conversationId, "messages");
    const newMessage = {
      senderId,
      message: message || "",
      media,
      reactions: [],
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(messageRef, newMessage);

    // Update conversation's last message
    const conversationRef = doc(db, "conversations", conversationId);
    await updateDoc(conversationRef, {
      lastMessage: message || (media ? (media.type === 'image' ? '📷 Image' : '🎥 Video') : ''),
      lastMessageTime: Timestamp.now(),
    });

    return { success: true, message: "Message sent successfully", messageId: docRef.id };
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

    console.log("Fetching conversations for user:", userId);
    
    // Get all conversations
    const conversationsQuery = query(
      collection(db, "conversations")
    );
    
    const conversationsSnapshot = await getDocs(conversationsQuery);
    console.log("Total conversations found:", conversationsSnapshot.size);

    // Filter conversations where the user is a participant
    const conversations = conversationsSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        console.log("Processing conversation:", { id: doc.id, participants: data.participants });
        return {
          id: doc.id,
          ...data,
        };
      })
      .filter(conversation => {
        const isParticipant = conversation.participants?.includes(userId);
        console.log(`Conversation ${conversation.id} - User is participant:`, isParticipant);
        return isParticipant;
      });

    // Sort conversations by lastMessageTime
    conversations.sort((a, b) => {
      const timeA = a.lastMessageTime?.toDate?.() || new Date(0);
      const timeB = b.lastMessageTime?.toDate?.() || new Date(0);
      return timeB - timeA;
    });

    console.log("Filtered conversations for user:", conversations);
    return conversations;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw new Error("Failed to get conversations");
  }
};

// ✅ Update Message Reaction
export const updateMessageReaction = async (conversationId, messageId, userId, reactionType) => {
  try {
    const messageRef = doc(db, "conversations", conversationId, "messages", messageId);
    const messageSnap = await getDoc(messageRef);

    if (!messageSnap.exists()) {
      throw new Error("Message not found");
    }

    const message = messageSnap.data();
    const existingReaction = message.reactions?.find(r => r.userId === userId);

    if (existingReaction) {
      // Remove existing reaction if it's the same type
      if (existingReaction.type === reactionType) {
        await updateDoc(messageRef, {
          reactions: message.reactions.filter(r => r.userId !== userId)
        });
      } else {
        // Update existing reaction
        await updateDoc(messageRef, {
          reactions: message.reactions.map(r => 
            r.userId === userId ? { ...r, type: reactionType } : r
          )
        });
      }
    } else {
      // Add new reaction
      await updateDoc(messageRef, {
        reactions: arrayUnion({ userId, type: reactionType, createdAt: Timestamp.now() })
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating message reaction:", error);
    throw new Error("Failed to update reaction");
  }
};

// ✅ Create Test Conversation
export const createTestConversation = async (userId1, userId2) => {
  try {
    // Sort user IDs to ensure uniqueness
    const participants = [userId1, userId2].sort();
    const conversationId = `${participants[0]}_${participants[1]}`;

    const conversationRef = doc(db, "conversations", conversationId);
    const conversationSnap = await getDoc(conversationRef);

    if (!conversationSnap.exists()) {
      await setDoc(conversationRef, {
        participants,
        createdAt: Timestamp.now(),
        lastMessage: "Hi! Let's start a conversation.",
        lastMessageTime: Timestamp.now(),
      });

      // Add a test message
      const messageRef = collection(db, "conversations", conversationId, "messages");
      await addDoc(messageRef, {
        senderId: userId1,
        message: "Hi! Let's start a conversation.",
        createdAt: Timestamp.now(),
        reactions: []
      });
    }

    return conversationId;
  } catch (error) {
    console.error("Error creating test conversation:", error);
    throw new Error("Failed to create test conversation");
  }
};
