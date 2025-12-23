// src/types/messages.ts

export interface MessageProperty {
  _id: string;
  title: string;
  titleAr: string;
  price: number;
  images: string[];
  location: {
    city: string;
    district: string;
    address?: string;
  };
  propertyType: 'apartment' | 'villa' | 'land' | 'building' | 'office';
  listingType: 'sale' | 'rent';
}

export interface MessageUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  role?: 'user' | 'agent' | 'admin';
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: MessageUser;
  receiver: MessageUser;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'property' | 'offer';
  attachments?: {
    url: string;
    type: string;
    name: string;
    size?: number;
  }[];
  offer?: {
    amount: number;
    status: 'pending' | 'accepted' | 'rejected' | 'countered';
    counterAmount?: number;
    expiresAt?: Date;
  };
  isRead: boolean;
  readAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  _id: string;
  participants: MessageUser[];
  property?: MessageProperty;
  lastMessage?: Message;
  unreadCount: number;
  isArchived: boolean;
  isPinned: boolean;
  isMuted: boolean;
  isBlocked: boolean;
  blockedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationWithDetails extends Conversation {
  otherParticipant: MessageUser;
  messages: Message[];
}

export interface SendMessageInput {
  conversationId?: string;
  receiverId: string;
  propertyId?: string;
  content: string;
  messageType?: 'text' | 'image' | 'file' | 'property' | 'offer';
  attachments?: {
    url: string;
    type: string;
    name: string;
    size?: number;
  }[];
  offer?: {
    amount: number;
    expiresAt?: Date;
  };
}

export interface MessagesState {
  conversations: Conversation[];
  selectedConversation: ConversationWithDetails | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  unreadTotal: number;
}

export interface TypingIndicator {
  odei: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}
