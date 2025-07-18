import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get all conversations for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required', success: false },
        { status: 400 }
      )
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        members: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                isOnline: true,
              }
            }
          }
        },
        messages: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 1, // Get the last message for preview
          include: {
            user: {
              select: {
                username: true
              }
            }
          }
        }
      }
    })

    // Transform conversations to include other participant info
    const transformedConversations = conversations.map(conversation => {
      const otherMember = conversation.members.find(member => member.userId !== userId)
      const lastMessage = conversation.messages[0]

      return {
        id: conversation.id,
        isGroup: conversation.isGroup,
        name: conversation.name,
        otherUser: otherMember ? {
          id: otherMember.user.id,
          username: otherMember.user.username,
          avatar: otherMember.user.avatar,
          isOnline: otherMember.user.isOnline,
        } : null,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          timestamp: lastMessage.timestamp,
          username: lastMessage.user.username,
        } : null,
        updatedAt: conversation.updatedAt,
      }
    })

    return NextResponse.json({
      conversations: transformedConversations,
      success: true
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations', success: false },
      { status: 500 }
    )
  }
}

// Create a new conversation between two users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId1, userId2 } = body

    if (!userId1 || !userId2) {
      return NextResponse.json(
        { error: 'Both user IDs are required', success: false },
        { status: 400 }
      )
    }

    // Check if conversation already exists between these users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          {
            members: {
              some: {
                userId: userId1
              }
            }
          },
          {
            members: {
              some: {
                userId: userId2
              }
            }
          }
        ]
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                isOnline: true,
              }
            }
          }
        }
      }
    })

    if (existingConversation) {
      const otherMember = existingConversation.members.find(member => member.userId !== userId1)

      return NextResponse.json({
        conversation: {
          id: existingConversation.id,
          otherUser: otherMember ? {
            id: otherMember.user.id,
            username: otherMember.user.username,
            avatar: otherMember.user.avatar,
            isOnline: otherMember.user.isOnline,
          } : null,
        },
        success: true
      })
    }

    // Create new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        members: {
          create: [
            { userId: userId1 },
            { userId: userId2 }
          ]
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                isOnline: true,
              }
            }
          }
        }
      }
    })

    const otherMember = newConversation.members.find(member => member.userId !== userId1)

    return NextResponse.json({
      conversation: {
        id: newConversation.id,
        otherUser: otherMember ? {
          id: otherMember.user.id,
          username: otherMember.user.username,
          avatar: otherMember.user.avatar,
          isOnline: otherMember.user.isOnline,
        } : null,
      },
      success: true
    }, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation', success: false },
      { status: 500 }
    )
  }
}
