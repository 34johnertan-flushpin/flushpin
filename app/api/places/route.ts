import { NextRequest, NextResponse } from 'next/server'
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radius = parseFloat(searchParams.get('radius') || '3000')
  const keyword = searchParams.get('q') || ''
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 })
  }

  let places: any[] = []

  if (keyword) {
    // Keyword varsa Text Search kullan
    const url = 'https://places.googleapis.com/v1/places:searchText'
    const body = {
      textQuery: keyword,
      locationBias: {
        circle: {
          center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
          radius: radius
        }
      },
      maxResultCount: 20
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_MAPS_KEY!,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.primaryType'
      },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    places = data.places || []
  } else {
    // Keyword yoksa Nearby Search kullan
    const url = 'https://places.googleapis.com/v1/places:searchNearby'
    const body = {
      includedTypes: [
        'restaurant', 'cafe', 'coffee_shop',
        'gas_station', 'convenience_store',
        'shopping_mall', 'supermarket', 'grocery_store',
        'pharmacy', 'hospital', 'park',
        'tourist_attraction', 'visitor_center',
        'movie_theater', 'library', 'museum',
        'hotel', 'lodging', 'gym', 'stadium'
      ],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
          radius: radius
        }
      }
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_MAPS_KEY!,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.primaryType'
      },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    places = data.places || []
  }

  const mapped = places.map((p: any) => ({
    id: `google_${p.id}`,
    name: p.displayName?.text || 'Unknown',
    address: p.formattedAddress || '',
    lat: p.location?.latitude || 0,
    lng: p.location?.longitude || 0,
    type: p.primaryType || 'other',
    status: 'red',
    pin: '',
    stars: 0,
    score: 0,
    verified: 'Not yet verified',
    accessible: false,
    source: 'google',
  }))
  return NextResponse.json({ places: mapped })
}
