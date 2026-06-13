'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import RatingModal from '../../components/RatingModal'
import Logo from '../../components/Logo'
import PromoModal from '../../components/PromoModal'
import { useLang } from '../../lib/LanguageContext'
import {
  ACCESS_METHOD_CHIPS,
  buildAccessPayload,
  formatUpdatedAt,
  getAccessListLabel,
  hasDbRestroomId,
  parseAccessEditState,
  parseAccessRecord,
  restroomHasAccessInfo,
  type AccessEditState,
  type AccessMethod,
} from '../../lib/accessType'

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
  const [editMode, setEditMode] = useState<'update'|'correct'|'share'>('update')
  const [editEntry, setEditEntry] = useState<AccessEditState>({pin:'',accessible:false,customersOnly:false,method:'no_code_needed'})
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState('')
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
    if (filter==='pin') return restroomHasAccessInfo(r)
    if (filter==='baby') return r.has_baby_changing === true
    return true
  })

  const formatDist = (d:number) => unit==='mi'?`${d.toFixed(1)} mi`:`${(d*1.609).toFixed(1)} km`
  const statusColor = (s:string) => s==='green'?'#1D9E75':s==='amber'?'#D97706':'#DC2626'
  const statusLabel = (s:string) => s==='green'?'Community verified':s==='amber'?'Needs update':'Access info unknown'
  const openDirections = (r:any) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}&travelmode=driving`,'_blank')

  const localizedMethodChips = ACCESS_METHOD_CHIPS.map(chip => ({
    ...chip,
    label:
      chip.id === 'keypad_code' ? t.chipKeypad
      : chip.id === 'no_code_needed' ? t.chipOpen
      : chip.id === 'ask_staff' ? t.chipAskStaff
      : t.chipLocked,
  }))

  const selectAccessMethod = (method: AccessMethod) => {
    setEditEntry(p => ({
      ...p,
      method,
      customersOnly: method === 'locked' ? false : p.customersOnly,
      pin: method === 'keypad_code' ? p.pin : '',
    }))
  }

  const toggleCustomersOnly = () => {
    setEditEntry(p => ({
      ...p,
      customersOnly: p.method === 'locked' ? false : !p.customersOnly,
    }))
  }

  const closeEditForm = () => {
    setShowEditForm(false)
    setEditTarget(null)
    setEditMode('update')
    setEditError('')
  }

  const findExistingRestroomId = async (target: any) => {
    const { data } = await supabase
      .from('restroom')
      .select('id')
      .ilike('name', target.name)
      .gte('lat', target.lat - 0.0005)
      .lte('lat', target.lat + 0.0005)
      .gte('lng', target.lng - 0.0005)
      .lte('lng', target.lng + 0.0005)
      .limit(1)
      .maybeSingle()
    return data?.id ?? null
  }

  const persistAccessUpdate = async (target: any, entry: typeof editEntry) => {
    const payload = buildAccessPayload(entry)

    if (hasDbRestroomId(target.id)) {
      const { error } = await supabase
        .from('restroom')
        .update(payload)
        .eq('id', target.id)
      if (error) throw error
      return { ...target, ...payload }
    }

    const insertRow = {
      name: target.name,
      address: target.address,
      lat: target.lat,
      lng: target.lng,
      type: target.type || 'other',
      source: target.source || 'google',
      score: 0,
      stars: 0,
      ...payload,
    }

    const { data, error } = await supabase
      .from('restroom')
      .insert(insertRow)
      .select('id')
      .maybeSingle()

    if (!error && data?.id) {
      return { ...target, ...payload, id: data.id, distance: target.distance }
    }

    const existingId = await findExistingRestroomId(target)
    if (existingId) {
      const { error: updateError } = await supabase
        .from('restroom')
        .update(payload)
        .eq('id', existingId)
      if (updateError) throw updateError
      return { ...target, ...payload, id: existingId, distance: target.distance }
    }

    if (error) throw error
    return { ...target, ...payload, distance: target.distance }
  }

  const handleEditOpen = (r: any, e: React.MouseEvent, mode: 'update' | 'correct' | 'share' = 'update') => {
    e.stopPropagation()
    const parsed = parseAccessEditState(r)
    setEditTarget(r)
    setEditMode(mode)
    setEditError('')
    setEditEntry({
      ...parsed,
      pin: mode === 'correct' ? '' : parsed.pin,
      method: mode === 'share' && parsed.method === 'no_code_needed' ? 'no_code_needed' : parsed.method,
    })
    setShowEditForm(true)
  }

  const handleAccessAction = (r: any, e: React.MouseEvent) => {
    e.stopPropagation()
    if (restroomHasAccessInfo(r)) {
      setPromoTarget(r)
      setShowPromo(true)
    } else {
      handleEditOpen(r, e, 'share')
    }
  }

  const handleEditSave = async () => {
    if (!editTarget || savingEdit) return
    if (editEntry.method === 'keypad_code' && !editEntry.pin.trim()) {
      setEditError(t.enterPinError)
      return
    }

    const target = editTarget
    const entry = editEntry
    setSavingEdit(true)
    setEditError('')

    try {
      const updated = await persistAccessUpdate(target, entry)
      const payload = buildAccessPayload(entry)

      setRestrooms(prev => {
        const idx = prev.findIndex(r => r.id === target.id)
        if (idx < 0) return [...prev, updated]
        const next = [...prev]
        next[idx] = { ...prev[idx], ...updated, distance: prev[idx].distance }
        return next
      })

      closeEditForm()
      setSelected(updated)
      setShowPin(true)
      const badge = getAccessListLabel(updated)
      setSuccessMsg(`${t.liveNow} — ${badge.label} · ${formatUpdatedAt(payload.pin_updated_at)}`)
      setTimeout(() => setSuccessMsg(''), 5000)
    } catch {
      setEditError(t.saveError)
    } finally {
      setSavingEdit(false)
    }
  }

  const renderAccessPanel = (r: any) => {
    const parsed = parseAccessRecord(r)
    const updatedAt = r.pin_updated_at ? formatUpdatedAt(r.pin_updated_at) : null
    const updatedLine = updatedAt ? `${t.updated} ${updatedAt}` : (r.verified || null)

    if (parsed.method === 'unknown') {
      return (
        <div style={{background:'#FEE2E2',borderRadius:'10px',padding:'14px',textAlign:'center',marginBottom:'10px'}}>
          <p style={{fontSize:'15px',fontWeight:'700',color:'#DC2626',margin:0}}>{t.unknownAccess}</p>
          <p style={{fontSize:'13px',color:'#888',margin:'4px 0 0'}}>{t.unknownDesc}</p>
          <button onClick={e=>handleEditOpen(r,e,'share')} style={{marginTop:'12px',background:'#1D9E75',color:'white',border:'none',padding:'10px 16px',borderRadius:'8px',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>{t.shareAccess}</button>
        </div>
      )
    }

    if (parsed.method === 'locked') {
      return (
        <div style={{background:'#FEE2E2',borderRadius:'10px',padding:'14px',textAlign:'center',marginBottom:'10px'}}>
          <p style={{fontSize:'17px',fontWeight:'700',color:'#991B1B',margin:0}}>{t.locked}</p>
          <p style={{fontSize:'13px',color:'#DC2626',margin:'4px 0 0'}}>{t.lockedDesc}</p>
          {updatedLine&&<p style={{fontSize:'12px',color:'#888',margin:'8px 0 0'}}>{updatedLine}</p>}
        </div>
      )
    }

    return (
      <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'10px'}}>
        {parsed.customersOnly && (
          <div style={{background:'#EEF2FF',borderRadius:'10px',padding:'12px 14px',textAlign:'center'}}>
            <p style={{fontSize:'16px',fontWeight:'700',color:'#4338CA',margin:0}}>{t.customersOnly}</p>
            <p style={{fontSize:'13px',color:'#6366F1',margin:'4px 0 0'}}>{t.customersOnlyDesc}</p>
          </div>
        )}
        {parsed.method === 'keypad_code' && parsed.displayPin && (
          <div style={{background:'#E1F5EE',borderRadius:'10px',padding:'16px',textAlign:'center'}}>
            <p style={{fontSize:'12px',color:'#0F6E56',fontWeight:'600',margin:'0 0 4px',letterSpacing:'1px'}}>{t.customerCode}</p>
            <p style={{fontSize:'42px',fontWeight:'700',color:'#085041',letterSpacing:'10px',margin:'10px 0'}}>{parsed.displayPin}</p>
          </div>
        )}
        {parsed.method === 'no_code_needed' && (
          <div style={{background:'#D1FAE5',borderRadius:'10px',padding:'14px',textAlign:'center'}}>
            <p style={{fontSize:'17px',fontWeight:'700',color:'#065F46',margin:0}}>🚪 {t.openAccess}</p>
            <p style={{fontSize:'13px',color:'#047857',margin:'4px 0 0'}}>{t.openDesc}</p>
          </div>
        )}
        {parsed.method === 'ask_staff' && (
          <div style={{background:'#FEF3C7',borderRadius:'10px',padding:'14px',textAlign:'center'}}>
            <p style={{fontSize:'17px',fontWeight:'700',color:'#92400E',margin:0}}>{t.askStaff}</p>
            <p style={{fontSize:'13px',color:'#B45309',margin:'4px 0 0'}}>{t.askStaffDesc}</p>
          </div>
        )}
        {parsed.method === 'keypad_code' && !parsed.displayPin && (
          <div style={{background:'#FEE2E2',borderRadius:'10px',padding:'14px',textAlign:'center'}}>
            <p style={{fontSize:'15px',fontWeight:'700',color:'#DC2626',margin:0}}>{t.unknownAccess}</p>
            <p style={{fontSize:'13px',color:'#888',margin:'4px 0 0'}}>{t.unknownDesc}</p>
          </div>
        )}
        {updatedLine&&<p style={{fontSize:'12px',color:'#888',margin:0,textAlign:'center'}}>{updatedLine}</p>}
      </div>
    )
  }

  const renderAccessActions = (r: any) => {
    const parsed = parseAccessRecord(r)
    const hasPin = parsed.method === 'keypad_code' && !!parsed.displayPin
    const hasInfo = restroomHasAccessInfo(r)

    return (
      <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
        {hasPin && (
          <button onClick={e=>{e.stopPropagation();setRatingTarget({...r,_pinWorked:true});setShowRating(true)}} style={{flex:1,minWidth:'100px',background:'#f0faf6',color:'#1D9E75',border:'1px solid #9FE1CB',padding:'10px',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}}>{t.codeWorked}</button>
        )}
        {(hasPin || hasInfo) && (
          <button onClick={e=>handleEditOpen(r,e,'correct')} style={{flex:1,minWidth:'100px',background:'#FEE2E2',color:'#DC2626',border:'1px solid #FCA5A5',padding:'10px',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}}>{hasPin ? t.codeChanged : t.wrongInfo}</button>
        )}
        <button onClick={e=>handleEditOpen(r,e,'update')} style={{flex:1,minWidth:'100px',background:'#FEF3C7',color:'#D97706',border:'1px solid #FCD34D',padding:'10px',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}}>{t.update}</button>
      </div>
    )
  }

  const editFormTitle = editTarget
    ? `${editMode === 'correct' ? t.correctAccessTitle : editMode === 'share' ? t.shareAccessTitle : t.updateAccessTitle}: ${editTarget.name}`
    : ''

  const inputStyle = {width:'100%',padding:'12px 14px',borderRadius:'8px',border:'1px solid #e0e0e0',fontSize:'16px',boxSizing:'border-box' as const,outline:'none',fontFamily:"'Inter',system-ui,sans-serif",color:'#1a1a1a'}
  const labelStyle = {fontSize:'14px',fontWeight:'600' as const,color:'#555',marginBottom:'6px',display:'block' as const}

  return (
    <div style={{minHeight:'100vh',background:'#f8f9fa',fontFamily:"'Inter',system-ui,sans-serif"}}>
      <nav style={{background:'white',borderBottom:'1px solid #f0f0f0',padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:10}}>
        <Logo height={32} />
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
                    {(() => {
                      const badge = getAccessListLabel(r)
                      const hasInfo = restroomHasAccessInfo(r)
                      if (hasInfo) {
                        return (
                          <>
                            <span style={{fontSize:'12px',background:badge.bg,color:badge.color,padding:'3px 9px',borderRadius:'10px',fontWeight:'600'}}>{badge.label}</span>
                            {r.pin_updated_at&&<span style={{fontSize:'11px',color:'#888'}}>{formatUpdatedAt(r.pin_updated_at)}</span>}
                          </>
                        )
                      }
                      return <span style={{fontSize:'12px',background:'#FEE2E2',color:statusColor('red'),padding:'3px 9px',borderRadius:'10px',fontWeight:'600'}}>{statusLabel('red')}</span>
                    })()}
                  </div>
                </div>
                <div style={{textAlign:'right',flexShrink:0,marginLeft:'12px',display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'6px'}}>
                  <p style={{fontSize:'15px',fontWeight:'700',color:'#0A2E1F',margin:'0 0 2px'}}>{formatDist(r.distance)}</p>
                  <p style={{fontSize:'12px',color:'#bbb',margin:0}}>away</p>
                  <button onClick={e=>handleEditOpen(r,e,'update')} style={{background:'#f5f5f5',border:'none',borderRadius:'6px',padding:'5px 9px',fontSize:'12px',fontWeight:'600',color:'#555',cursor:'pointer'}}>{t.edit}</button>
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
                      <button onClick={e=>handleAccessAction(r,e)} style={{flex:1,background:'#1D9E75',color:'white',border:'none',padding:'12px',borderRadius:'9px',fontSize:'15px',fontWeight:'700',cursor:'pointer'}}>{restroomHasAccessInfo(r)?t.viewAccess:t.shareAccess}</button>
                      <button onClick={e=>{e.stopPropagation();setRatingTarget({...r,_pinWorked:undefined});setShowRating(true)}} style={{flex:1,background:'#F59E0B',color:'white',border:'none',padding:'12px',borderRadius:'9px',fontSize:'15px',fontWeight:'700',cursor:'pointer'}}>{t.rate}</button>
                      <button onClick={e=>{e.stopPropagation();openDirections(r)}} style={{flex:1,background:'#0A2E1F',color:'white',border:'none',padding:'12px',borderRadius:'9px',fontSize:'15px',fontWeight:'700',cursor:'pointer'}}>{t.go}</button>
                    </>)}
                  </div>
                ):(
                  <div onClick={e=>e.stopPropagation()}>
                    {renderAccessPanel(r)}
                    {renderAccessActions(r)}
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
        <div onClick={()=>{if(!savingEdit)closeEditForm()}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:50,display:'flex',alignItems:'flex-end'}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'white',borderRadius:'20px 20px 0 0',padding:'24px 20px',width:'100%',maxHeight:'85vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
              <h2 style={{margin:0,fontSize:'19px',fontWeight:'700',color:'#0A2E1F'}}>{editFormTitle}</h2>
              <button type="button" onClick={()=>{if(!savingEdit)closeEditForm()}} disabled={savingEdit} style={{background:'none',border:'none',fontSize:'26px',cursor:savingEdit?'not-allowed':'pointer',color:'#999',opacity:savingEdit?0.4:1}}>✕</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {editMode === 'correct' && (
                <p style={{fontSize:'14px',color:'#DC2626',margin:0,fontWeight:'600',lineHeight:1.5}}>{t.correctAccessDesc}</p>
              )}
              <div>
                <label style={labelStyle}>{t.whoCanUse}</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginTop:'8px'}}>
                  <button
                    type="button"
                    onClick={toggleCustomersOnly}
                    disabled={editEntry.method === 'locked'}
                    style={{
                      background: editEntry.customersOnly ? '#EEF2FF' : '#f5f5f5',
                      color: editEntry.customersOnly ? '#4338CA' : '#555',
                      border: editEntry.customersOnly ? '2px solid #6366F1' : '2px solid transparent',
                      padding:'10px 12px',
                      borderRadius:'10px',
                      fontSize:'13px',
                      fontWeight:'600',
                      cursor: editEntry.method === 'locked' ? 'not-allowed' : 'pointer',
                      opacity: editEntry.method === 'locked' ? 0.45 : 1,
                    }}
                  >
                    🧾 {t.chipCustomers}
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>{t.howDoesAccess}</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginTop:'8px'}}>
                  {localizedMethodChips.map(chip=>(
                    <button key={chip.id} type="button" onClick={()=>selectAccessMethod(chip.id)} style={{background:editEntry.method===chip.id?'#E1F5EE':'#f5f5f5',color:editEntry.method===chip.id?'#085041':'#555',border:editEntry.method===chip.id?'2px solid #1D9E75':'2px solid transparent',padding:'10px 12px',borderRadius:'10px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}}>{chip.emoji} {chip.label}</button>
                  ))}
                </div>
              </div>
              {editEntry.method==='keypad_code'&&(
                <div><label style={labelStyle}>{t.accessPinLabel}</label><input style={inputStyle} placeholder={t.accessPinPlaceholder} value={editEntry.pin} onChange={e=>setEditEntry(p=>({...p,pin:e.target.value}))}/></div>
              )}
              {editMode !== 'correct' && (
                <p style={{fontSize:'13px',color:'#888',margin:0,lineHeight:1.5}}>{t.correctAccessDesc}</p>
              )}
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <input type="checkbox" id="acc-edit" checked={editEntry.accessible} onChange={e=>setEditEntry(p=>({...p,accessible:e.target.checked}))} style={{width:'18px',height:'18px',cursor:'pointer'}}/>
                <label htmlFor="acc-edit" style={{fontSize:'15px',color:'#555',cursor:'pointer'}}>{t.wheelchair}</label>
              </div>
              {editError&&<p style={{fontSize:'14px',color:'#DC2626',margin:0,fontWeight:'600'}}>{editError}</p>}
              <button type="button" onClick={handleEditSave} disabled={savingEdit} style={{background:savingEdit?'#9CA3AF':'#1D9E75',color:'white',border:'none',padding:'16px',borderRadius:'10px',fontSize:'16px',fontWeight:'700',cursor:savingEdit?'wait':'pointer'}}>{savingEdit?t.publishing:t.publishNow}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
