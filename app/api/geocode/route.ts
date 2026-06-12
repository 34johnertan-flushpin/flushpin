import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 })
  }

  const key = process.env.GOOGLE_MAPS_KEY
  if (!key) {
    return NextResponse.json({ label: 'Your area' })
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`
    )
    const data = await res.json()
    const comp = data.results?.[0]?.address_components || []
    const city =
      comp.find((c: { types: string[] }) => c.types.includes('locality'))?.long_name ||
      comp.find((c: { types: string[] }) => c.types.includes('sublocality'))?.long_name ||
      comp.find((c: { types: string[] }) => c.types.includes('administrative_area_level_2'))?.long_name
    const state = comp.find((c: { types: string[] }) => c.types.includes('administrative_area_level_1'))?.short_name

    const label = city && state ? `${city}, ${state}` : city || data.results?.[0]?.formatted_address || 'Your area'
    return NextResponse.json({ label, city: city || null, state: state || null })
  } catch {
    return NextResponse.json({ label: 'Your area' })
  }
}
