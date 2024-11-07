import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, content } = body

    const todo = await prisma.todo.create({
      data: {
        id,
        content
      }
    })

    return NextResponse.json(todo, { status: 201 })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    )
  }
}