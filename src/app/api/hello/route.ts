export async function GET() {
  return new Response(JSON.stringify({ 
    message: "Hello World",
    timestamp: new Date().toISOString() 
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}