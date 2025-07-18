export interface Message {
  id: string
  content: string
  username: string
  timestamp: Date
  userId?: string
}

export interface User {
  id: string
  username: string
  email?: string
  avatar?: string
  isOnline: boolean
  lastSeen?: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
