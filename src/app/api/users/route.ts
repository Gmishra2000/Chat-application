import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        avatar: true,
        isOnline: true,
        lastSeen: true,
      },
      orderBy: {
        username: 'asc'
      }
    })

    // For now, keep all users online to ensure chat functionality works
    // TODO: Implement proper online/offline status based on lastSeen when needed
    const updatedUsers = users.map((user: any) => ({
      ...user,
      isOnline: true
    }))

    return NextResponse.json({
      users: updatedUsers,
      success: true
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users', success: false },
      { status: 500 }
    )
  }
}
