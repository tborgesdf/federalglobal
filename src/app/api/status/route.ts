import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ status: 'working', timestamp: Date.now() })
}