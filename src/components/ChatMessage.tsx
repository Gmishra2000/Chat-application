interface Message {
  id: string
  content: string
  username: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
  isOwnMessage: boolean
}

export default function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  console.log('💬 ChatMessage received:', {
    id: message.id,
    content: message.content,
    username: message.username,
    timestamp: message.timestamp,
    isOwnMessage
  });

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isOwnMessage) {
    return (
      <div className="flex justify-end">
        <div className="flex items-end space-x-2 max-w-md">
          <div className="text-xs text-gray-500 mb-1">
            {formatTime(message.timestamp)}
          </div>
          <div className="bg-blue-500 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
            <div className="text-sm leading-relaxed">{message.content}</div>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {message.username.charAt(0)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="flex items-end space-x-2 max-w-md">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
          {message.username.charAt(0)}
        </div>
        <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
          <div className="text-xs font-medium text-gray-600 mb-1">
            {message.username}
          </div>
          <div className="text-sm text-gray-800 leading-relaxed">{message.content}</div>
        </div>
        <div className="text-xs text-gray-500 mb-1">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}
