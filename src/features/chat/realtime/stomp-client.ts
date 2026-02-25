'use client'

import { Client } from '@stomp/stompjs'
import { issueWsTicket } from '../api'

const DEFAULT_SEND_DEST = '/pub/chat/messages'
const DEFAULT_ROOM_SUB_PREFIX = '/sub/chat/rooms'
const DEFAULT_NOTIFY_DEST = '/sub/chat/notifications'
const DEFAULT_READ_RECEIPT_DEST = '/sub/chat/read'
const DEFAULT_HEARTBEAT_MS = 10_000
const DEFAULT_RECONNECT_DELAY_MS = 5_000

export const CHAT_STOMP_SEND_DEST =
  process.env.NEXT_PUBLIC_CHAT_STOMP_SEND_DEST || DEFAULT_SEND_DEST

export const CHAT_STOMP_ROOM_SUB_PREFIX =
  process.env.NEXT_PUBLIC_CHAT_STOMP_ROOM_SUB_PREFIX ||
  DEFAULT_ROOM_SUB_PREFIX

export const CHAT_STOMP_NOTIFY_DEST =
  process.env.NEXT_PUBLIC_CHAT_STOMP_NOTIFY_DEST || DEFAULT_NOTIFY_DEST

export const CHAT_STOMP_READ_RECEIPT_DEST =
  process.env.NEXT_PUBLIC_CHAT_STOMP_READ_RECEIPT_DEST || DEFAULT_READ_RECEIPT_DEST

function resolveChatWsBaseUrl(): string {
  const wsBaseUrl = process.env.NEXT_PUBLIC_CHAT_WS_BASE_URL
  if (!wsBaseUrl || wsBaseUrl.trim() === '') {
    throw new Error('NEXT_PUBLIC_CHAT_WS_BASE_URL is required for STOMP chat.')
  }
  return wsBaseUrl.trim()
}

function toWebSocketProtocol(url: URL): URL {
  if (url.protocol === 'http:') {
    url.protocol = 'ws:'
  } else if (url.protocol === 'https:') {
    url.protocol = 'wss:'
  }

  return url
}

function buildBrokerUrlWithTicket(ticket: string): string {
  const wsBaseUrl = resolveChatWsBaseUrl()
  const parsed = new URL(wsBaseUrl, window.location.origin)
  toWebSocketProtocol(parsed)
  parsed.searchParams.set('ticket', ticket)
  return parsed.toString()
}

export interface CreateChatStompClientOptions {
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (message: string) => void
}

export function createChatStompClient({
  onConnect,
  onDisconnect,
  onError,
}: CreateChatStompClientOptions): Client {
  const client = new Client({
    brokerURL: resolveChatWsBaseUrl(),
    reconnectDelay: DEFAULT_RECONNECT_DELAY_MS,
    heartbeatIncoming: DEFAULT_HEARTBEAT_MS,
    heartbeatOutgoing: DEFAULT_HEARTBEAT_MS,
    debug: () => {
      // noiseless by default
    },
    beforeConnect: async () => {
      const response = await issueWsTicket()
      const ticket = response.data?.ticket
      if (!ticket) {
        throw new Error('Failed to issue websocket ticket.')
      }

      client.brokerURL = buildBrokerUrlWithTicket(ticket)
    },
    onConnect: () => {
      onConnect?.()
    },
    onWebSocketClose: () => {
      onDisconnect?.()
    },
    onWebSocketError: () => {
      onError?.('WebSocket connection error.')
    },
    onStompError: (frame) => {
      const message = frame.headers['message'] || 'STOMP broker error.'
      onError?.(message)
    },
  })

  return client
}
