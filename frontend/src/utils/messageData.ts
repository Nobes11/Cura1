export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachedPatientId?: string;
  attachedPatientName?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupMembers?: { id: string; name: string }[];
}

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participantId: "user2",
    participantName: "Dr. Sarah Johnson",
    participantAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    lastMessage: "We need to discuss the lab results for Room 3 patient",
    lastMessageTime: "2025-04-08T13:45:00",
    unreadCount: 2,
    isGroup: false
  },
  {
    id: "conv2",
    participantId: "user3",
    participantName: "Nurse Mike Chen",
    participantAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    lastMessage: "Patient in Room 5 needs pain medication",
    lastMessageTime: "2025-04-08T12:30:00",
    unreadCount: 0,
    isGroup: false
  },
  {
    id: "conv3",
    participantId: "group1",
    participantName: "Emergency Department",
    lastMessage: "Shift handover in 20 minutes",
    lastMessageTime: "2025-04-08T15:05:00",
    unreadCount: 1,
    isGroup: true,
    groupName: "Emergency Department",
    groupMembers: [
      { id: "user1", name: "Dr. Alex Morgan" },
      { id: "user2", name: "Dr. Sarah Johnson" },
      { id: "user3", name: "Nurse Mike Chen" },
      { id: "user4", name: "Nurse Emma Wilson" }
    ]
  },
  {
    id: "conv4",
    participantId: "user4",
    participantName: "Nurse Emma Wilson",
    participantAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
    lastMessage: "Can you cover my shift tomorrow?",
    lastMessageTime: "2025-04-08T09:15:00",
    unreadCount: 0,
    isGroup: false
  },
  {
    id: "conv5",
    participantId: "group2",
    participantName: "Trauma Team",
    lastMessage: "New trauma protocol guidelines attached",
    lastMessageTime: "2025-04-07T18:22:00",
    unreadCount: 0,
    isGroup: true,
    groupName: "Trauma Team",
    groupMembers: [
      { id: "user1", name: "Dr. Alex Morgan" },
      { id: "user5", name: "Dr. James Williams" },
      { id: "user6", name: "Nurse David Chen" }
    ]
  }
];

export const mockMessages: Message[] = [
  {
    id: "msg1",
    senderId: "user2",
    senderName: "Dr. Sarah Johnson",
    senderAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    recipientId: "user1",
    recipientName: "Dr. Alex Morgan",
    content: "The patient in Room 3 has concerning lab results. His potassium is 5.8, can you check on him?",
    timestamp: "2025-04-08T13:40:00",
    read: true
  },
  {
    id: "msg2",
    senderId: "user1",
    senderName: "Dr. Alex Morgan",
    recipientId: "user2",
    recipientName: "Dr. Sarah Johnson",
    content: "I'll head there now. Did you order an EKG?",
    timestamp: "2025-04-08T13:42:00",
    read: true
  },
  {
    id: "msg3",
    senderId: "user2",
    senderName: "Dr. Sarah Johnson",
    senderAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    recipientId: "user1",
    recipientName: "Dr. Alex Morgan",
    content: "Yes, EKG ordered. Results should be available in 10 minutes.",
    timestamp: "2025-04-08T13:44:00",
    read: true
  },
  {
    id: "msg4",
    senderId: "user2",
    senderName: "Dr. Sarah Johnson",
    senderAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    recipientId: "user1",
    recipientName: "Dr. Alex Morgan",
    content: "We need to discuss the lab results for Room 3 patient",
    timestamp: "2025-04-08T13:45:00",
    read: false,
    attachedPatientId: "patient123",
    attachedPatientName: "John Smith, 45M, Room 3"
  },
  {
    id: "msg5",
    senderId: "user3",
    senderName: "Nurse Mike Chen",
    senderAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    recipientId: "user1",
    recipientName: "Dr. Alex Morgan",
    content: "Patient in Room 5 is complaining of pain. Pain score 8/10. Last dose of morphine was 4 hours ago.",
    timestamp: "2025-04-08T12:30:00",
    read: true
  }
];

export const getUnreadMessagesCount = (userId: string): number => {
  return mockMessages.filter(msg => 
    msg.recipientId === userId && !msg.read
  ).length;
};

export const getRecentMessages = (userId: string, limit: number = 5) => {
  return mockMessages
    .filter(msg => msg.recipientId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
    .map(msg => ({
      id: msg.id,
      sender: msg.senderName,
      content: msg.content,
      timestamp: msg.timestamp,
      read: msg.read
    }));
};