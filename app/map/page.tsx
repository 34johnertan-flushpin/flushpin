'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import RatingModal from '../../components/RatingModal'
import PromoModal from '../../components/PromoModal'
import { useLang } from '../../lib/LanguageContext'

function getDistance(lat1:number, lng1:number, lat2:number, lng2:number) {
  const R = 3958.8
  const dLat = (lat2-lat1) * Math.PI/180
  const dLng = (lng2-lng1) * Math.PI/180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function getDistanceMeters(lat1:number, lng1:number, lat2:number, lng2:number) {
  return getDistance(lat1, lng1, lat2, lng2) * 1609.34
}

const RADIUS_MILES = 12

function nameSimilar(a:string, b:string) {
  const clean = (s:string) => s.toLowerCase().replace(/[^a-z0-9]/g,'').trim()
  const ca = clean(a)
  const cb = clean(b)
  return ca.includes(cb) || cb.includes(ca) || ca === cb
}

type MapPlace = { name?: string; address?: string; lat: number; lng: number; [key: string]: unknown }

function matchesSearch(r: MapPlace, query: string) {
  if (!query.trim()) return true
  const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2)
  if (tokens.length === 0) return true
  const haystack = `${(r.name || '').toLowerCase()} ${(r.address || '').toLowerCase()}`
  return tokens.every(t => haystack.includes(t))
}

function withinRadius(r: MapPlace, lat: number, lng: number, miles: number) {
  return getDistance(lat, lng, r.lat, r.lng) <= miles
}

function bboxDeltas(lat: number, miles: number) {
  const latDelta = miles / 69
  const lngDelta = miles / (69 * Math.cos(lat * Math.PI / 180))
  return { latDelta, lngDelta }
}

const Logo = () => (
  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
    <div style={{width:'44px',height:'44px',background:'linear-gradient(135deg,#1D9E75,#0A5C42)',borderRadius:'12px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'4px',boxShadow:'0 2px 8px rgba(29,158,117,0.4)'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'3px',width:'22px'}}>
        {[1,1,1,1,1,1,0,1,0].map((v,i)=>(<div key={i} style={{width:'5px',height:'5px',borderRadius:'50%',background:v?'white':'rgba(255,255,255,0.2)'}}/>))}
      </div>
      <div style={{width:0,height:0,borderLeft:'5px solid transparent',borderRight:'5px solid transparent',borderTop:'8px solid white',marginTop:'-1px'}}/>
    </div>
    <div style={{display:'flex',flexDirection:'column',lineHeight:1}}>
      <span style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:'20px',fontWeight:'800',color:'#0A2E1F',letterSpacing:'-0.5px'}}>Flush<span style={{color:'#1D9E75'}}>Pin</span></span>
      <span style={{fontSize:'10px',color:'#999',fontWeight:'500',letterSpacing:'0.5px'}}>FIND · RATE · FLUSH</span>
    </div>
  </div>
)

export default function FindPage() {
  const { lang, setLang, t } = useLang()
  const [restrooms, setRestrooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userLat, setUserLat] = useState<number|null>(null)
  const [userLng, setUserLng] = useState<number|null>(null)
  const [locationName, setLocationName] = useState('Locating...')
  const [filter, setFilter] = useState('all')
  const [unit, setUnit] = useState<'mi'|'km'>('mi')
  const [selected, setSelected] = useState<any>(null)
  const [showPin, setShowPin] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [showPromo, setShowPromo] = useState(false)
  const [promoTarget, setPromoTarget] = useState<any>(null)
  const [ratingTarget, setRatingTarget] = useState<any>(null)
  const [emergency, setEmergency] = useState(false)
  const [locating, setLocating] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editTarget, setEditTarget] = useState<any>(null)
  const [editEntry, setEditEntry] = useState({pin:'',accessible:false})
  const [successMsg, setSuccessMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const resolveCityLabel = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`)
      const data = await res.json()
      return data.label || 'Your area'
    } catch {
      return 'Your area'
    }
  }

  const fetchGooglePlaces = async (lat: number, lng: number, keyword: string) => {
    try {
      const q = keyword ? `&q=${encodeURIComponent(keyword)}` : ''
      const radiusMeters = Math.round(RADIUS_MILES * 1609.34)
      const res = await fetch(`/api/places?lat=${lat}&lng=${lng}&radius=${radiusMeters}${q}`)
      const data = await res.json()
      return (data.places || []).filter((p: { lat: number; lng: number }) =>
        withinRadius(p, lat, lng, RADIUS_MILES)
      )
    } catch {
      return []
    }
  }

  const fetchSupabaseNearby = async (lat: number, lng: number, keyword: string) => {
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_nearby_restrooms', {
      user_lat: lat,
      user_lng: lng,
      radius_miles: RADIUS_MILES,
      search_text: keyword,
      baby_filter: false,
    })
    if (!rpcError && rpcData) {
      return rpcData.filter((r: MapPlace) =>
        withinRadius(r, lat, lng, RADIUS_MILES) && matchesSearch(r, keyword)
      )
    }

    const { latDelta, lngDelta } = bboxDeltas(lat, RADIUS_MILES)
    const { data, error } = await supabase
      .from('restroom')
      .select('*')
      .gte('lat', lat - latDelta)
      .lte('lat', lat + latDelta)
      .gte('lng', lng - lngDelta)
      .lte('lng', lng + lngDelta)
      .limit(300)

    if (error || !data) return []

    return data.filter(r =>
      withinRadius(r, lat, lng, RADIUS_MILES) && matchesSearch(r, keyword)
    )
  }

  const loadData = async (lat: number, lng: number, keyword: string = '') => {
    setLoading(true)
    const [supabaseData, googlePlaces] = await Promise.all([
      fetchSupabaseNearby(lat, lng, keyword),
      fetchGooglePlaces(lat, lng, keyword),
    ])

    const newPlaces = googlePlaces.filter((gp: { name: string; lat: number; lng: number }) =>
      !supabaseData.some((sp: { name: string; lat: number; lng: number }) => {
        const sameish = nameSimilar(sp.name, gp.name)
        const tooClose = getDistanceMeters(sp.lat, sp.lng, gp.lat, gp.lng) < 100
        return sameish || tooClose
      })
    )

    setRestrooms([...supabaseData, ...newPlaces])
    setLoading(false)
  }

  const getLocation = (onSuccess: (lat: number, lng: number) => void) => {
    const applyLocation = async (lat: number, lng: number, fallbackLabel?: string) => {
      setUserLat(lat)
      setUserLng(lng)
      setLocating(false)
      const label = fallbackLabel || await resolveCityLabel(lat, lng)
      setLocationName(label)
      onSuccess(lat, lng)
    }

    if (!navigator.geolocation) {
      applyLocation(33.6846, -117.7892, 'Irvine, CA')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => applyLocation(pos.coords.latitude, pos.coords.longitude),
      () => applyLocation(33.6846, -117.7892, 'Irvine, CA'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const anchorLat = userLat ?? 33.6846
  const anchorLng = userLng ?? -117.7892

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q') || ''
    setSearchQuery(q); setSearchInput(q)
    supabase.auth.getSession().then(({data:{session}})=>setUser(session?.user??null))
    supabase.auth.onAuthStateChange((_,session)=>setUser(session?.user??null))
    getLocation((lat, lng) => { loadData(lat, lng, q) })
  }, [])

  const handleSearch = () => {
    const q = searchInput.trim()
    setSearchQuery(q)
    const url = new URL(window.location.href)
    if (q) { url.searchParams.set('q', q) } else { url.searchParams.delete('q') }
    window.history.replaceState({}, '', url.toString())
    loadData(anchorLat, anchorLng, q)
  }
  const withDistance = restrooms
    .map(r => ({ ...r, distance: getDistance(anchorLat, anchorLng, r.lat, r.lng) }))
    .sort((a, b) => a.distance - b.distance)
  const filtered = withDistance.filter(r => {
    if (emergency) return r.status==='green'
    if (filter==='verified') return r.status==='green'
    if (filter==='accessible') return r.accessible
    if (filter==='pin') return r.pin && r.pin!=='open' && r.pin!==''
    if (filter==='baby') return r.has_baby_changing === true
    return true
  })

  const formatDist = (d:number) => unit==='mi'?`${d.toFixed(1)} mi`:`${(d*1.609).toFixed(1)} km`
  const statusColor = (s:string) => s==='green'?'#1D9E75':s==='amber'?'#D97706':'#DC2626'
  const statusLabel = (s:string) => s==='green'?'Community verified':s==='amber'?'Needs update':'Access info unknown'
  const openDirections = (r:any) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}&travelmode=driving`,'_blank')

  const handleEditOpen = (r:any,e:React.MouseEvent) => {
    e.stopPropagation()
    setEditTarget(r)
    setEditEntry({pin:r.pin||'',accessible:r.accessible||false})
    setShowEditForm(true)
  }

  const handleEditSave = async () => {
    if (!editTarget.source) {
      await supabase.from('restroom').update({
        pin:editEntry.pin.trim(), accessible:editEntry.accessible,
        status:editEntry.pin.trim()?'green':'red', verified:'Just updated', pin_updated_at: new Date().toISOString(),
      }).eq('id',editTarget.id)
    } else {
      await supabase.from('restroom').insert({
        name:editTarget.name, address:editTarget.address, lat:editTarget.lat, lng:editTarget.lng,
        pin:editEntry.pin.trim(), score:0, stars:0,
        status:editEntry.pin.trim()?'green':'red',
        verified:'Community added', type:editTarget.type||'other',
        accessible:editEntry.accessible,
      })
    }
    await loadData(anchorLat, anchorLng, searchQuery)
    setShowEditForm(false); setEditTarget(null); setSelected(null)
    setSuccessMsg('✅ Updated — thank you!'); setTimeout(()=>setSuccessMsg(''),3000)
  }

  const inputStyle = {width:'100%',padding:'12px 14px',borderRadius:'8px',border:'1px solid #e0e0e0',fontSize:'16px',boxSizing:'border-box' as const,outline:'none',fontFamily:"'Inter',system-ui,sans-serif",color:'#1a1a1a'}
  const labelStyle = {fontSize:'14px',fontWeight:'600' as const,color:'#555',marginBottom:'6px',display:'block' as const}

  return (
    <div style={{minHeight:'100vh',background:'#f8f9fa',fontFamily:"'Inter',system-ui,sans-serif"}}>
      <nav style={{background:'white',borderBottom:'1px solid #f0f0f0',padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:10}}>
        <a href="/" style={{textDecoration:'none'}}><Logo/></a>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <div style={{display:'flex',background:'#f5f5f5',borderRadius:'8px',padding:'3px'}}>
            <button onClick={()=>setLang('en')} style={{padding:'5px 12px',borderRadius:'6px',border:'none',fontSize:'14px',cursor:'pointer',background:lang==='en'?'white':'transparent'}}>🇺🇸</button>
            <button onClick={()=>setLang('es')} style={{padding:'5px 12px',borderRadius:'6px',border:'none',fontSize:'14px',cursor:'pointer',background:lang==='es'?'white':'transparent'}}>🇲🇽</button>
          </div>
          <button onClick={()=>setUnit(unit==='mi'?'km':'mi')} style={{background:'#f5f5f5',border:'none',padding:'7px 14px',borderRadius:'20px',fontSize:'13px',fontWeight:'600',cursor:'pointer',color:'#555'}}>{unit==='mi'?'km':'mi'}</button>
          <button onClick={()=>setEmergency(!emergency)} style={{background:emergency?'#DC2626':'white',color:emergency?'white':'#DC2626',border:'2px solid #DC2626',padding:'7px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:'700',cursor:'pointer'}}>🚨 {emergency?'ON':'Urgent'}</button>
        </div>
      </nav>

      <div style={{background:'white',padding:'12px 16px',borderBottom:'1px solid #f0f0f0'}}>
        <div style={{display:'flex',borderRadius:'12px',overflow:'hidden',border:'2px solid #1D9E75',boxShadow:'0 2px 8px rgba(29,158,117,0.15)'}}>
          <input type="text"
            placeholder={lang==='es'?"Busca Starbucks, burger, gas...":"Search Starbucks, burger, gas station..."}
            value={searchInput}
            onChange={e=>setSearchInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleSearch()}
            style={{flex:1,padding:'14px 16px',fontSize:'16px',border:'none',outline:'none',fontFamily:"'Inter',system-ui,sans-serif",color:'#1a1a1a',background:'white'}}
          />
          <button onClick={handleSearch} style={{background:'#1D9E75',color:'white',border:'none',padding:'14px 20px',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>🔍</button>
        </div>
        {searchQuery&&(
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'8px',flexWrap:'wrap'}}>
            <span style={{fontSize:'14px',color:'#555'}}>
              Results for <strong style={{color:'#0A2E1F'}}>{searchQuery}</strong> near <strong style={{color:'#0A2E1F'}}>{locationName}</strong>
            </span>
            <button onClick={()=>{setSearchQuery('');setSearchInput('');window.history.replaceState({},'',(window.location.pathname));loadData(anchorLat,anchorLng,'')}} style={{background:'#f0f0f0',border:'none',borderRadius:'20px',padding:'3px 10px',fontSize:'13px',cursor:'pointer',color:'#666'}}>✕ Clear</button>
          </div>
        )}
      </div>

      <div style={{background:'white',padding:'10px 16px',borderBottom:'1px solid #f0f0f0'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px'}}>
          <span style={{fontSize:'14px',color:'#1D9E75'}}>📍</span>
          <span style={{fontSize:'14px',color:'#555',fontWeight:'500'}}>
            {locating ? 'Finding your location...' : `Near ${locationName}`}
          </span>
          <button onClick={()=>getLocation((lat,lng)=>loadData(lat,lng,searchQuery))} style={{background:'none',border:'none',color:'#1D9E75',fontSize:'13px',cursor:'pointer',fontWeight:'600',marginLeft:'auto'}}>Update location</button>
        </div>
        <div style={{display:'flex',gap:'8px',overflowX:'auto',paddingBottom:'2px'}}>
          {[{id:'all',label:'All'},{id:'verified',label:'Verified'},{id:'accessible',label:'Accessible ♿'},{id:'pin',label:'Has access info'},{id:'baby',label:'🍼 Baby'}].map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{background:filter===f.id?'#0A2E1F':'#f5f5f5',color:filter===f.id?'white':'#555',border:'none',padding:'8px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:'600',cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}>{f.label}</button>
          ))}
        </div>
      </div>

      {emergency&&<div style={{background:'#FEF2F2',borderBottom:'1px solid #FCA5A5',padding:'10px 20px'}}><p style={{fontSize:'14px',fontWeight:'700',color:'#DC2626',margin:0}}>🚨 Urgent mode — nearest verified locations only</p></div>}
      {successMsg&&<div style={{background:'#E1F5EE',borderBottom:'1px solid #9FE1CB',padding:'10px 20px'}}><p style={{fontSize:'14px',fontWeight:'700',color:'#1D9E75',margin:0}}>{successMsg}</p></div>}

      <div style={{padding:'16px 16px 100px'}}>
        <p style={{fontSize:'14px',color:'#999',fontWeight:'500',margin:'0 0 12px'}}>
          {loading
            ? 'Loading...'
            : `${filtered.length} location${filtered.length !== 1 ? 's' : ''} within ${RADIUS_MILES} mi of ${locationName}`}
        </p>

        {loading&&<div style={{textAlign:'center',padding:'60px 20px'}}>
          <div style={{fontSize:'40px',marginBottom:'12px'}}>🚽</div>
          <p style={{color:'#999',fontSize:'15px'}}>Finding restrooms near you...</p>
        </div>}

        {!loading&&filtered.length===0&&(
          <div style={{textAlign:'center',padding:'60px 20px'}}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>🔍</div>
            <p style={{color:'#555',fontSize:'17px',fontWeight:'700',marginBottom:'8px'}}>No results for "{searchQuery}"</p>
            <p style={{color:'#999',fontSize:'15px'}}>Try a different search term.</p>
          </div>
        )}

        {filtered.map(r=>(
          <div key={r.id} onClick={()=>{setSelected(r===selected?null:r);setShowPin(false)}} style={{background:'white',borderRadius:'14px',marginBottom:'10px',boxShadow:'0 1px 6px rgba(0,0,0,0.06)',overflow:'hidden',cursor:'pointer',border:selected?.id===r.id?'2px solid #1D9E75':'2px solid transparent'}}>
            <div style={{padding:'16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                    <div style={{width:'9px',height:'9px',borderRadius:'50%',background:statusColor(r.status||'red'),flexShrink:0}}/>
                    <span style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:'16px',fontWeight:'700',color:'#0A2E1F'}}>{r.name}</span>
                    {r.accessible&&<span style={{fontSize:'13px'}}>♿</span>}
                    {r.has_baby_changing&&<span style={{fontSize:'13px'}}>🍼</span>}
                  </div>
                  <p style={{fontSize:'13px',color:'#999',margin:'0 0 8px',paddingLeft:'17px'}}>{r.address}</p>
                  {r.opt_out&&<div style={{background:'#FEE2E2',borderRadius:'8px',padding:'6px 12px',marginLeft:'17px',marginBottom:'6px',display:'inline-flex',alignItems:'center',gap:'6px'}}><span>🚫</span><span style={{fontSize:'13px',fontWeight:'700',color:'#DC2626'}}>Restroom not available to the public</span></div>}
                  <div style={{display:'flex',gap:'8px',alignItems:'center',paddingLeft:'17px',flexWrap:'wrap'}}>
                    {r.score>0&&r.stars>0&&!r.source&&<span style={{fontSize:'13px',color:'#D97706',fontWeight:'500'}}>{'★'.repeat(r.stars||0)}{'☆'.repeat(5-(r.stars||0))} {r.score}</span>}
                    <span style={{fontSize:'12px',background:r.status==='green'?'#E1F5EE':r.status==='amber'?'#FEF3C7':'#FEE2E2',color:statusColor(r.status||'red'),padding:'3px 9px',borderRadius:'10px',fontWeight:'600'}}>{statusLabel(r.status||'red')}</span>
                  </div>
                </div>
                <div style={{textAlign:'right',flexShrink:0,marginLeft:'12px',display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'6px'}}>
                  <p style={{fontSize:'15px',fontWeight:'700',color:'#0A2E1F',margin:'0 0 2px'}}>{formatDist(r.distance)}</p>
                  <p style={{fontSize:'12px',color:'#bbb',margin:0}}>away</p>
                  <button onClick={e=>handleEditOpen(r,e)} style={{background:'#f5f5f5',border:'none',borderRadius:'6px',padding:'5px 9px',fontSize:'12px',fontWeight:'600',color:'#555',cursor:'pointer'}}>✏️ Edit</button>
                </div>
              </div>
            </div>

            {selected?.id===r.id&&(
              <div style={{borderTop:'1px solid #f5f5f5',padding:'14px 16px',background:'#fafafa'}}>
                {!showPin?(
                  <div style={{display:'flex',gap:'8px'}}>
                    {r.opt_out?(
                      <div style={{flex:1,background:'#FEE2E2',borderRadius:'9px',padding:'12px',textAlign:'center',fontSize:'14px',color:'#DC2626',fontWeight:'600'}}>🚫 This business has opted out of FlushPin</div>
                    ):(<>
                      <button onClick={e=>{e.stopPropagation();setPromoTarget(r);setShowPromo(true)}} style={{flex:1,background:'#1D9E75',color:'white',border:'none',padding:'12px',borderRadius:'9px',fontSize:'15px',fontWeight:'700',cursor:'pointer'}}>{r.pin?'View access info':'Help us update'}</button>
                      <button onClick={e=>{e.stopPropagation();setRatingTarget({...r,_pinWorked:undefined});setShowRating(true)}} style={{flex:1,background:'#F59E0B',color:'white',border:'none',padding:'12px',borderRadius:'9px',fontSize:'15px',fontWeight:'700',cursor:'pointer'}}>⭐ Rate</button>
                      <button onClick={e=>{e.stopPropagation();openDirections(r)}} style={{flex:1,background:'#0A2E1F',color:'white',border:'none',padding:'12px',borderRadius:'9px',fontSize:'15px',fontWeight:'700',cursor:'pointer'}}>Go →</button>
                    </>)}
                  </div>
                ):(
                  <div onClick={e=>e.stopPropagation()}>
                    {r.pin&&r.pin!=='open'?(
                      <div style={{background:'#E1F5EE',borderRadius:'10px',padding:'16px',textAlign:'center',marginBottom:'10px'}}>
                        <p style={{fontSize:'12px',color:'#0F6E56',fontWeight:'600',margin:'0 0 4px',letterSpacing:'1px'}}>CUSTOMER ACCESS CODE</p>
                        <p style={{fontSize:'42px',fontWeight:'700',color:'#085041',letterSpacing:'10px',margin:'10px 0'}}>{r.pin}</p>
                        <p style={{fontSize:'12px',color:'#888',margin:0}}>Last verified {r.verified}</p>
                      </div>
                    ):r.pin==='open'?(
                      <div style={{background:'#E1F5EE',borderRadius:'10px',padding:'14px',textAlign:'center',marginBottom:'10px'}}>
                        <p style={{fontSize:'17px',fontWeight:'700',color:'#085041',margin:0}}>Open access restroom</p>
                        <p style={{fontSize:'13px',color:'#888',margin:'4px 0 0'}}>No code required</p>
                      </div>
                    ):(
                      <div style={{background:'#FEE2E2',borderRadius:'10px',padding:'14px',textAlign:'center',marginBottom:'10px'}}>
                        <p style={{fontSize:'15px',fontWeight:'700',color:'#DC2626',margin:0}}>Access information unknown</p>
                        <p style={{fontSize:'13px',color:'#888',margin:'4px 0 0'}}>Please ask staff</p>
                      </div>
                    )}
                    <div style={{display:'flex',gap:'8px'}}>
                      <button onClick={e=>{e.stopPropagation();setRatingTarget({...r,_pinWorked:true});setShowRating(true)}} style={{flex:1,background:'#f0faf6',color:'#1D9E75',border:'1px solid #9FE1CB',padding:'10px',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}}>Code worked ✅</button>
                      <button onClick={e=>{e.stopPropagation();setRatingTarget({...r,_pinWorked:false});setShowRating(true)}} style={{flex:1,background:'#FEE2E2',color:'#DC2626',border:'1px solid #FCA5A5',padding:'10px',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}}>Code changed ❌</button>
                      <button onClick={e=>handleEditOpen(r,e)} style={{flex:1,background:'#FEF3C7',color:'#D97706',border:'1px solid #FCD34D',padding:'10px',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}}>Update 🔄</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showPromo&&promoTarget&&(<PromoModal restroom={promoTarget} onComplete={()=>{setShowPromo(false);setShowPin(true)}}/>)}
      {showRating&&ratingTarget&&(<RatingModal restroom={ratingTarget} user={user} onClose={()=>setShowRating(false)} onDone={()=>{setShowRating(false);setSuccessMsg('✅ Thank you!');setTimeout(()=>setSuccessMsg(''),3000);loadData(anchorLat,anchorLng,searchQuery)}} initialPinWorked={ratingTarget?._pinWorked}/>)}

      {showEditForm&&editTarget&&(
        <div onClick={()=>setShowEditForm(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:50,display:'flex',alignItems:'flex-end'}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'white',borderRadius:'20px 20px 0 0',padding:'24px 20px',width:'100%',maxHeight:'85vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
              <h2 style={{margin:0,fontSize:'19px',fontWeight:'700',color:'#0A2E1F'}}>Update: {editTarget.name}</h2>
              <button onClick={()=>setShowEditForm(false)} style={{background:'none',border:'none',fontSize:'26px',cursor:'pointer',color:'#999'}}>✕</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <div><label style={labelStyle}>Access code (PIN)</label><input style={inputStyle} placeholder="e.g. 1234 — or type 'open'" value={editEntry.pin} onChange={e=>setEditEntry(p=>({...p,pin:e.target.value}))}/></div>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <input type="checkbox" id="acc-edit" checked={editEntry.accessible} onChange={e=>setEditEntry(p=>({...p,accessible:e.target.checked}))} style={{width:'18px',height:'18px',cursor:'pointer'}}/>
                <label htmlFor="acc-edit" style={{fontSize:'15px',color:'#555',cursor:'pointer'}}>♿ Wheelchair accessible</label>
              </div>
              <button onClick={handleEditSave} style={{background:'#1D9E75',color:'white',border:'none',padding:'16px',borderRadius:'10px',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>Save ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
