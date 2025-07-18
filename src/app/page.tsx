'use client'

import { useState, useEffect, useRef } from 'react'
import ChatMessage from '@/components/ChatMessage'
import MessageInput from '@/components/MessageInput'
import UsersList from '@/components/UsersList'

interface Message {
  id: string
  content: string
  username: string
  timestamp: Date
}

interface User {
  id: string
  username: string
  isOnline: boolean
}

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<string>('Travis Taylor')
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentConversationId, setCurrentConversationId] = useState<string>('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    console.log('💬 Send message called with:', content, 'conversationId:', currentConversationId)
    if (!currentConversationId) {
      console.log('❌ No conversation ID available')
      return
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      username: currentUser,
      timestamp: new Date()
    }

    // Add message locally first for immediate UI update
    setMessages(prev => [...prev, newMessage])

    // Send to backend API
    try {
      console.log('📤 Sending message to API:', { content, username: currentUser, conversationId: currentConversationId })
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          username: currentUser,
          conversationId: currentConversationId
        }),
      })

      console.log('📡 Message API response status:', response.status)
      if (response.ok) {
        console.log('✅ Message sent successfully')
        // Reload messages to get the server version with proper ID and timestamp
        loadMessages(currentConversationId)
      } else {
        console.error('❌ Message sending failed')
        // Remove the optimistic message if send failed
        setMessages(prev => prev.filter(msg => msg.id !== newMessage.id))
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error)
      // Remove the optimistic message if send failed
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id))
    }
  }

  // Get current user ID and load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('/api/users')
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])

          // Find current user ID
          const user = data.users.find((u: any) => u.username === currentUser)
          console.log('🔍 Looking for current user:', currentUser, 'in users:', data.users.map((u: any) => u.username))
          if (user) {
            console.log('✅ Found current user:', user)
            setCurrentUserId(user.id)
          } else {
            console.log('❌ Current user not found!')
          }
        }
      } catch (error) {
        console.error('Failed to load users:', error)
      }
    }

    loadUsers()
  }, [currentUser])

  // Handle user selection and create/get conversation
  const handleUserSelect = async (user: User) => {
    console.log('👤 User selected:', user.username, user.id)
    console.log('🔑 Current user ID:', currentUserId)
    setSelectedUser(user)

    if (!currentUserId || !user.id) {
      console.log('❌ Missing user IDs - currentUserId:', currentUserId, 'selectedUserId:', user.id)
      return
    }

    // Prevent users from chatting with themselves
    if (currentUserId === user.id) {
      console.log('❌ Cannot create conversation with yourself')
      return
    }

    try {
      console.log('🔄 Creating/getting conversation between:', currentUserId, 'and', user.id)
      // Create or get conversation between current user and selected user
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId1: currentUserId,
          userId2: user.id
        }),
      })

      console.log('📡 Conversation API response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Conversation data:', data)
        setCurrentConversationId(data.conversation.id)

        // Load messages for this conversation
        loadMessages(data.conversation.id)
      } else {
        const errorData = await response.json()
        console.error('❌ Failed to create/get conversation:', errorData)
      }
    } catch (error) {
      console.error('❌ Failed to create/get conversation - error:', error)
    }
  }

  // Load messages for a specific conversation
  const loadMessages = async (conversationId: string) => {
    console.log('🔄 Loading messages for conversation:', conversationId)
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`)
      console.log('📡 Messages API response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('📥 Raw messages data:', data)
        // Transform messages to ensure timestamp is a Date object
        const transformedMessages = (data.messages || []).map((message: any) => ({
          ...message,
          timestamp: new Date(message.timestamp)
        }))
        console.log('✅ Transformed messages:', transformedMessages.length, transformedMessages)
        setMessages(transformedMessages)
      } else {
        console.error('❌ Failed to load messages - response not ok')
      }
    } catch (error) {
      console.error('❌ Failed to load messages - error:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:block`}>

        {/* User Profile Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {currentUser.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{currentUser}</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search friends"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Friends Online
              </h3>
              <span className="text-sm text-gray-400">{users.filter(u => u.isOnline && u.id !== currentUserId).length}</span>
            </div>
            <UsersList
              users={users.filter(user => user.id !== currentUserId)}
              selectedUser={selectedUser}
              onUserSelect={handleUserSelect}
            />
          </div>

          {/* Recent Chats */}
          <div className="p-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
              Chats
            </h3>
            <div className="space-y-2">
              {users.filter(user => user.id !== currentUserId).slice(0, 4).map((user) => (              <div
                key={user.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleUserSelect(user)}
              >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.username.charAt(0)}
                    </div>
                    {user.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">Hey there! 👋</p>
                  </div>
                  <div className="text-xs text-gray-400">2m</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {selectedUser ? (
              <>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {selectedUser.username.charAt(0)}
                  </div>
                  {selectedUser.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">Chat with</h1>
                  <p className="text-lg font-bold text-gray-900">{selectedUser.username}</p>
                </div>
              </>
            ) : (
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Chat Application</h1>
                <p className="text-sm text-gray-600">Select a friend to start chatting</p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {selectedUser ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              {(() => {
                console.log('🎨 Rendering UI - Selected user:', selectedUser?.username, 'Messages count:', messages.length);
                return null;
              })()}
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isOwnMessage={message.username === currentUser}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
                <p className="text-gray-500">Select a friend from the sidebar to begin chatting</p>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        {selectedUser && (
          <div className="bg-white border-t border-gray-200 p-4">
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        )}
      </div>
    </div>
  )
}
