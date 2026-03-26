import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("i")

  if (!source) {
    return new NextResponse("Missing image source", { status: 400 })
  }

  let sourceUrl: URL
  try {
    sourceUrl = new URL(source)
  } catch {
    return new NextResponse("Invalid image URL", { status: 400 })
  }

  if (sourceUrl.protocol !== "https:" && sourceUrl.protocol !== "http:") {
    return new NextResponse("Unsupported URL protocol", { status: 400 })
  }

  const upstream = await fetch(sourceUrl.toString(), {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    next: { revalidate: 86400 },
  })

  if (!upstream.ok) {
    return new NextResponse("Unable to fetch image", { status: 502 })
  }

  const contentType = upstream.headers.get("content-type") || "image/png"
  const body = await upstream.arrayBuffer()

  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
