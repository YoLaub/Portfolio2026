import { NextResponse } from "next/server"
import { getServices } from "@/lib/content"

export async function GET() {
  try {
    const data = getServices()
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
      },
    })
  } catch (error) {
    console.error("[API Portfolio]", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
