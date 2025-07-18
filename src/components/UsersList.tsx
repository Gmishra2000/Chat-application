interface User {
  id: string
  username: string
  isOnline: boolean
}

interface UsersListProps {
  users: User[]
  selectedUser?: User | null
  onUserSelect?: (user: User) => void
}

export default function UsersList({ users, selectedUser, onUserSelect }: UsersListProps) {
  const onlineUsers = users.filter(user => user.isOnline)
  // Show online users if any exist, otherwise show all users
  const displayUsers = onlineUsers.length > 0 ? onlineUsers : users

  return (
    <div className="space-y-1">
      {displayUsers.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">No friends available</p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {displayUsers.map((user) => (
            <div
              key={user.id}
              className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedUser?.id === user.id
                  ? 'bg-blue-50 ring-2 ring-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onUserSelect?.(user)}
            >
              <div className="relative mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.username.charAt(0)}
                </div>
                {user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <span className="text-xs text-gray-700 font-medium text-center truncate w-full">
                {user.username.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
