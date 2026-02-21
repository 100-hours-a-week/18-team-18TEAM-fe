import type { ChatMessage, ChatRoomState, ChatRoomSummary } from './chat.types'

const NOW = Date.now()
const MINUTE = 60 * 1000

const ROOMS: ChatRoomSummary[] = [
  {
    id: 'room-1',
    participant: {
      id: 201,
      name: '김지훈',
      company: 'Bizkit',
      position: '백엔드 개발자',
      isOnline: true,
    },
    lastMessagePreview: '좋아요. 내일 오전 10시에 이야기해요.',
    lastMessageAt: new Date(NOW - 2 * MINUTE).toISOString(),
    unreadCount: 2,
  },
  {
    id: 'room-2',
    participant: {
      id: 202,
      name: '박소연',
      company: 'CardCaro',
      position: 'PM',
      isOnline: false,
    },
    lastMessagePreview: '채용 공고 링크 보내드릴게요.',
    lastMessageAt: new Date(NOW - 43 * MINUTE).toISOString(),
    unreadCount: 0,
  },
  {
    id: 'room-3',
    participant: {
      id: 203,
      name: '이도윤',
      company: 'Studio One',
      position: '디자이너',
      isOnline: true,
    },
    lastMessagePreview: '시안 검토 감사합니다!',
    lastMessageAt: new Date(NOW - 6 * 60 * MINUTE).toISOString(),
    unreadCount: 1,
  },
]

const MESSAGES: Record<string, ChatMessage[]> = {
  'room-1': [
    {
      id: 'm-1',
      roomId: 'room-1',
      senderId: 201,
      senderName: '김지훈',
      content: '안녕하세요, 어제 공유해주신 API 문서 확인했습니다.',
      sentAt: new Date(NOW - 25 * MINUTE).toISOString(),
      direction: 'received',
      isRead: true,
    },
    {
      id: 'm-2',
      roomId: 'room-1',
      senderId: 100,
      senderName: '나',
      content: '확인 감사합니다. 구현 시작해보셔도 됩니다.',
      sentAt: new Date(NOW - 18 * MINUTE).toISOString(),
      direction: 'sent',
      isRead: true,
    },
    {
      id: 'm-3',
      roomId: 'room-1',
      senderId: 201,
      senderName: '김지훈',
      content: '좋아요. 내일 오전 10시에 이야기해요.',
      sentAt: new Date(NOW - 2 * MINUTE).toISOString(),
      direction: 'received',
      isRead: false,
    },
  ],
  'room-2': [
    {
      id: 'm-4',
      roomId: 'room-2',
      senderId: 202,
      senderName: '박소연',
      content: '안녕하세요. 포지션 관련해서 간단히 미팅 가능하실까요?',
      sentAt: new Date(NOW - 90 * MINUTE).toISOString(),
      direction: 'received',
      isRead: true,
    },
    {
      id: 'm-5',
      roomId: 'room-2',
      senderId: 100,
      senderName: '나',
      content: '네, 가능해요. 일정 후보 부탁드립니다.',
      sentAt: new Date(NOW - 82 * MINUTE).toISOString(),
      direction: 'sent',
      isRead: true,
    },
    {
      id: 'm-6',
      roomId: 'room-2',
      senderId: 202,
      senderName: '박소연',
      content: '채용 공고 링크 보내드릴게요.',
      sentAt: new Date(NOW - 43 * MINUTE).toISOString(),
      direction: 'received',
      isRead: true,
    },
  ],
  'room-3': [
    {
      id: 'm-7',
      roomId: 'room-3',
      senderId: 203,
      senderName: '이도윤',
      content: '시안 검토 감사합니다!',
      sentAt: new Date(NOW - 6 * 60 * MINUTE).toISOString(),
      direction: 'received',
      isRead: false,
    },
  ],
  'mock-or-temp-room': [],
}

function cloneMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.map((message) => ({ ...message }))
}

export function getMockChatRooms(): ChatRoomSummary[] {
  return ROOMS.map((room) => ({
    ...room,
    participant: { ...room.participant },
  }))
}

export function getMockRoom(roomId: string): ChatRoomSummary | null {
  const room = ROOMS.find((item) => item.id === roomId)
  if (room) {
    return {
      ...room,
      participant: { ...room.participant },
    }
  }

  if (roomId === 'mock-or-temp-room') {
    return {
      id: 'mock-or-temp-room',
      participant: {
        id: 0,
        name: '새 채팅',
        company: 'Unknown',
        position: '상대 정보 없음',
        isOnline: false,
      },
      lastMessagePreview: '아직 대화가 없습니다.',
      lastMessageAt: new Date(NOW).toISOString(),
      unreadCount: 0,
    }
  }

  return null
}

export function getMockMessages(roomId: string): ChatMessage[] {
  const messages = MESSAGES[roomId]
  if (!messages) return []
  return cloneMessages(messages)
}

export function getMockRoomState(roomId: string): ChatRoomState | null {
  const room = getMockRoom(roomId)
  if (!room) return null
  return {
    room,
    messages: getMockMessages(roomId),
  }
}
