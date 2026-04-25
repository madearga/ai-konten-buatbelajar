import { NextRequest, NextResponse } from 'next/server'

// Bun + Next.js 16 has issues with fs in API routes
// Using a workaround with dynamic imports
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get('file')
  if (!file || !/^[\w-]+$/.test(file)) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 })
  }

  try {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'content/docs', `${file}.mdx`)
    const content = fs.readFileSync(filePath, 'utf-8')
    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch {
    return new NextResponse('File not found', { status: 404 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { file, content } = body

    if (!file || !content || !/^[\w-]+$/.test(file)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'content/docs', `${file}.mdx`)
    fs.writeFileSync(filePath, content, 'utf-8')

    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    return new NextResponse(String(err), { status: 500 })
  }
}
