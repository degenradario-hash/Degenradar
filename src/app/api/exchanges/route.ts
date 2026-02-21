import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get('page') || '1'
  const per_page = searchParams.get('per_page') || '100'

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/exchanges?per_page=${per_page}&page=${page}`,
      { next: { revalidate: 300 } }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'CoinGecko API error' }, { status: res.status })
    }

    const exchanges = await res.json()

    return NextResponse.json({
      exchanges,
      page: parseInt(page),
      per_page: parseInt(per_page),
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch exchanges' }, { status: 500 })
  }
}
