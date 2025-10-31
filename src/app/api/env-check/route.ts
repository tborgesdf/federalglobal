import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL || 'NOT_SET'
    
    return NextResponse.json({
      success: true,
      databaseUrl: databaseUrl.substring(0, 20) + '...' + databaseUrl.substring(databaseUrl.length - 10),
      protocol: databaseUrl.split('://')[0],
      isMySQL: databaseUrl.startsWith('mysql://'),
      environment: process.env.NODE_ENV
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}