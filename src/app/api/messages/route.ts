import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required', success: false },
        { status: 400 }
      )
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          }
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    })

    // Transform to match frontend expectations
    const transformedMessages = messages.map((message: any) => ({
      id: message.id,
      content: message.content,
      username: message.user.username,
      timestamp: message.timestamp,
      userId: message.user.id,
      conversationId: message.conversationId,
    }))

    return NextResponse.json({
      messages: transformedMessages,
      success: true
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, username, conversationId } = body

    if (!content || !username || !conversationId) {
      return NextResponse.json(
        { error: 'Content, username, and conversation ID are required', success: false },
        { status: 400 }
      )
    }

    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', success: false },
        { status: 404 }
      )
    }

    // Verify user is a member of the conversation
    const conversationMember = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: conversationId,
          userId: user.id
        }
      }
    })

    if (!conversationMember) {
      return NextResponse.json(
        { error: 'User is not a member of this conversation', success: false },
        { status: 403 }
      )
    }

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        content: content.trim(),
        userId: user.id,
        conversationId: conversationId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          }
        }
      }
    })

    // Transform to match frontend expectations
    const transformedMessage = {
      id: newMessage.id,
      content: newMessage.content,
      username: newMessage.user.username,
      timestamp: newMessage.timestamp,
      userId: newMessage.user.id,
      conversationId: newMessage.conversationId,
    }

    return NextResponse.json({
      message: transformedMessage,
      success: true
    }, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create message', success: false },
      { status: 500 }
    )
  }
}
