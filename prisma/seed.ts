import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create users
  const travis = await prisma.user.upsert({
    where: { username: 'Travis Taylor' },
    update: {},
    create: {
      username: 'Travis Taylor',
      email: 'travis@example.com',
      isOnline: true,
    },
  })

  const dina = await prisma.user.upsert({
    where: { username: 'Dina Harrison' },
    update: {},
    create: {
      username: 'Dina Harrison',
      email: 'dina@example.com',
      isOnline: true,
    },
  })

  const john = await prisma.user.upsert({
    where: { username: 'John Shinoda' },
    update: {},
    create: {
      username: 'John Shinoda',
      email: 'john@example.com',
      isOnline: true,
    },
  })

  const mandy = await prisma.user.upsert({
    where: { username: 'Mandy Guoles' },
    update: {},
    create: {
      username: 'Mandy Guoles',
      email: 'mandy@example.com',
      isOnline: true,
    },
  })

  const sam = await prisma.user.upsert({
    where: { username: 'Sam Petterson' },
    update: {},
    create: {
      username: 'Sam Petterson',
      email: 'sam@example.com',
      isOnline: true,
    },
  })

  // Create conversations
  // 1. Travis & Dina conversation
  const travisDinaConversation = await prisma.conversation.create({
    data: {
      isGroup: false,
      members: {
        create: [
          { userId: travis.id },
          { userId: dina.id }
        ]
      }
    }
  })

  // 2. Travis & John conversation
  const travisJohnConversation = await prisma.conversation.create({
    data: {
      isGroup: false,
      members: {
        create: [
          { userId: travis.id },
          { userId: john.id }
        ]
      }
    }
  })

  // Create messages for Travis & Dina conversation
  await prisma.message.createMany({
    data: [
      {
        content: 'Hey Travis, would U like to drink some coffe with me?',
        userId: dina.id,
        conversationId: travisDinaConversation.id,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        content: 'Sure! At 11:00 am?',
        userId: travis.id,
        conversationId: travisDinaConversation.id,
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
      },
      {
        content: 'Emm, no. Maybe at 10? Cuz I have to finish my home work. My professor is jackass...',
        userId: dina.id,
        conversationId: travisDinaConversation.id,
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
      },
      {
        content: 'Wow I heard that he is hard, but never that he is a jackass. Anyway at 10 is ok. Would be my motivation! get up earlier 😊',
        userId: travis.id,
        conversationId: travisDinaConversation.id,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
      },
      {
        content: 'Yay! I have a tons stories about that man. Ok, have a nice evening, see ya!',
        userId: dina.id,
        conversationId: travisDinaConversation.id,
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
      },
      {
        content: 'See ya 😊',
        userId: travis.id,
        conversationId: travisDinaConversation.id,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
    ],
  })

  // Create messages for Travis & John conversation
  await prisma.message.createMany({
    data: [
      {
        content: 'Hey man, how is it going?',
        userId: john.id,
        conversationId: travisJohnConversation.id,
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
      {
        content: 'Hey John! Pretty good, just working on some projects',
        userId: travis.id,
        conversationId: travisJohnConversation.id,
        timestamp: new Date(Date.now() - 55 * 60 * 1000), // 55 mins ago
      },
    ],
  })

  console.log('Database seeded successfully with conversations!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
