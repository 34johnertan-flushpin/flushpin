'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import CounterSection from '../components/CounterSection'
import Logo from '../components/Logo'
import { useLang } from '../lib/LanguageContext'
import { APP_STORE_URL } from '../lib/site'
import { SOCAL_SHOWCASE_CITIES } from '../lib/siteStats'

const COLOR_OPTIONS = [
  '#E74C3C','#E67E22','#F1C40F','#2ECC71','#1ABC9C',
  '#3498DB','#9B59B6','#E91E63','#FF5722','#00BCD4',
  '#8BC34A','#FF9800','#795548','#607D8B','#0A2E1F',
]

export default function Home() {
  const { lang, setLang, t } = useLang()
  const [user, setUser] = useState<any>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'signin'|'signup'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [selectedColor, setSelectedColor] = useState('#1D9E75')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [liveCities, setLiveCities] = useState<string[]>([...SOCAL_SHOWCASE_CITIES])

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => { if (d.cityList?.length) setLiveCities(d.cityList) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'https://www.flushpin.com' } })
  }

  const handleSignUp = async () => {
    if (!fullName.trim()) { setMessage('Please enter your full name.'); return }
    setLoading(true); setMessage('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName.trim(), profile_color: selectedColor } }
    })
    if (error) setMessage(error.message.includes('already registered') ? '⚠️ This email is already registered. Please sign in.' : error.message)
    else setMessage('✅ Check your email to confirm your account!')
    setLoading(false)
  }

  const handleSignIn = async () => {
    setLoading(true); setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else { setShowAuth(false); setMessage('') }
    setLoading(false)
  }

  const handleSignOut = async () => { await supabase.auth.signOut(); setUser(null) }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/map?q=${encodeURIComponent(searchQuery.trim())}`
    } else {
      window.location.href = '/map'
    }
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const profileColor = user?.user_metadata?.profile_color || '#1D9E75'

  const inputStyle = { width:'100%', padding:'13px 16px', borderRadius:'9px', border:'1px solid #e0e0e0', fontSize:'16px', fontFamily:"'Inter',system-ui,sans-serif", outline:'none', boxSizing:'border-box' as const, color:'#1a1a1a', background:'white' }
  const labelStyle = { fontSize:'14px', fontWeight:'600' as const, color:'#444', marginBottom:'8px', display:'block' as const }

  return (
    <main style={{margin:0,padding:0,fontFamily:"'Inter',system-ui,sans-serif",background:"#fff",minHeight:"100vh"}}>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>

      <nav style={{background:"white",borderBottom:"1px solid #f0f0f0",padding:"16px 20px",position:"sticky",top:0,zIndex:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <Logo height={36} />

          <div style={{display:"flex",gap:"10px",alignItems:"center"}} className="desktop-nav">
            <div style={{display:"flex",background:"#f5f5f5",borderRadius:"8px",padding:"3px"}}>
              <button onClick={()=>setLang('en')} style={{padding:"6px 12px",borderRadius:"6px",border:"none",fontSize:"13px",fontWeight:"700",cursor:"pointer",background:lang==='en'?"white":"transparent",color:lang==='en'?"#0A2E1F":"#999"}}>🇺🇸</button>
              <button onClick={()=>setLang('es')} style={{padding:"6px 12px",borderRadius:"6px",border:"none",fontSize:"13px",fontWeight:"700",cursor:"pointer",background:lang==='es'?"white":"transparent",color:lang==='es'?"#0A2E1F":"#999"}}>🇲🇽</button>
            </div>
            <a href="/business" style={{color:"#555",textDecoration:"none",fontSize:"15px",fontWeight:"500"}}>{t.forBusinesses}</a>
            {user ? (
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <div style={{width:"28px",height:"28px",borderRadius:"50%",background:profileColor,flexShrink:0}}/>
                <span style={{fontSize:"15px",color:"#0A2E1F",fontWeight:"600"}}>{displayName}</span>
                <button onClick={handleSignOut} style={{background:"#f5f5f5",border:"none",padding:"9px 16px",borderRadius:"8px",fontSize:"14px",fontWeight:"600",cursor:"pointer",color:"#555"}}>{t.signOut}</button>
              </div>
            ) : (
              <div style={{display:"flex",gap:"8px"}}>
                <button onClick={()=>{setShowAuth(true);setAuthMode('signin');setMessage('')}} style={{background:"white",color:"#0A2E1F",padding:"10px 20px",borderRadius:"9px",border:"1.5px solid #e0e0e0",fontSize:"15px",fontWeight:"600",cursor:"pointer"}}>{t.signIn}</button>
                <button onClick={()=>{setShowAuth(true);setAuthMode('signup');setMessage('')}} style={{background:"#1D9E75",color:"white",padding:"10px 20px",borderRadius:"9px",border:"none",fontSize:"15px",fontWeight:"600",cursor:"pointer"}}>{t.signUp}</button>
              </div>
            )}
            <a href="/map" style={{background:"#0A2E1F",color:"white",padding:"10px 20px",borderRadius:"9px",textDecoration:"none",fontSize:"15px",fontWeight:"600"}}>{t.findRestroom}</a>
          </div>

          <button onClick={()=>setMenuOpen(!menuOpen)} style={{background:"none",border:"none",cursor:"pointer",padding:"6px",display:"none"}} className="mobile-menu-btn">
            <div style={{width:"24px",height:"2px",background:"#0A2E1F",marginBottom:"6px",borderRadius:"2px"}}/>
            <div style={{width:"24px",height:"2px",background:"#0A2E1F",marginBottom:"6px",borderRadius:"2px"}}/>
            <div style={{width:"24px",height:"2px",background:"#0A2E1F",borderRadius:"2px"}}/>
          </button>
        </div>

        {menuOpen && (
          <div style={{borderTop:"1px solid #f0f0f0",paddingTop:"16px",marginTop:"16px",display:"flex",flexDirection:"column",gap:"12px"}}>
            <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
              <span style={{fontSize:"14px",color:"#555",fontWeight:"500"}}>Language:</span>
              <div style={{display:"flex",background:"#f5f5f5",borderRadius:"8px",padding:"3px"}}>
                <button onClick={()=>setLang('en')} style={{padding:"6px 14px",borderRadius:"6px",border:"none",fontSize:"13px",fontWeight:"700",cursor:"pointer",background:lang==='en'?"white":"transparent",color:lang==='en'?"#0A2E1F":"#999"}}>🇺🇸</button>
                <button onClick={()=>setLang('es')} style={{padding:"6px 14px",borderRadius:"6px",border:"none",fontSize:"13px",fontWeight:"700",cursor:"pointer",background:lang==='es'?"white":"transparent",color:lang==='es'?"#0A2E1F":"#999"}}>🇲🇽</button>
              </div>
            </div>
            {user ? (
              <>
                <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"4px 0"}}>
                  <div style={{width:"28px",height:"28px",borderRadius:"50%",background:profileColor}}/>
                  <span style={{fontSize:"15px",color:"#0A2E1F",fontWeight:"600"}}>{displayName}</span>
                </div>
                <button onClick={handleSignOut} style={{background:"#f5f5f5",border:"none",padding:"13px",borderRadius:"9px",fontSize:"15px",fontWeight:"600",cursor:"pointer",color:"#555",textAlign:"left"}}>{t.signOut}</button>
              </>
            ) : (
              <>
                <button onClick={()=>{setShowAuth(true);setAuthMode('signin');setMessage('');setMenuOpen(false)}} style={{background:"white",color:"#0A2E1F",padding:"13px",borderRadius:"9px",border:"1.5px solid #e0e0e0",fontSize:"15px",fontWeight:"600",cursor:"pointer"}}>{t.signIn}</button>
                <button onClick={()=>{setShowAuth(true);setAuthMode('signup');setMessage('');setMenuOpen(false)}} style={{background:"#1D9E75",color:"white",padding:"13px",borderRadius:"9px",border:"none",fontSize:"15px",fontWeight:"600",cursor:"pointer"}}>{t.signUp}</button>
              </>
            )}
            <a href="/business" onClick={()=>setMenuOpen(false)} style={{color:"#555",textDecoration:"none",fontSize:"15px",fontWeight:"500",padding:"4px 0"}}>{t.forBusinesses}</a>
            <a href="/map" onClick={()=>setMenuOpen(false)} style={{background:"#0A2E1F",color:"white",padding:"13px",borderRadius:"9px",textDecoration:"none",fontSize:"15px",fontWeight:"600",textAlign:"center"}}>{t.findRestroom}</a>
          </div>
        )}
      </nav>

      {!user && (
        <div style={{background:"#E1F5EE",borderBottom:"1px solid #9FE1CB",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"10px"}}>
          <p style={{margin:0,fontSize:"15px",color:"#0F6E56",fontWeight:"500"}}>🚽 {t.bannerText}</p>
          <button onClick={()=>{setShowAuth(true);setAuthMode('signup')}} style={{background:"#1D9E75",color:"white",border:"none",padding:"10px 20px",borderRadius:"8px",fontSize:"15px",fontWeight:"700",cursor:"pointer",whiteSpace:"nowrap"}}>{t.joinFree}</button>
        </div>
      )}

      {user && (
        <div style={{background:"#E1F5EE",borderBottom:"1px solid #9FE1CB",padding:"14px 20px",display:"flex",alignItems:"center",gap:"10px"}}>
          <div style={{width:"10px",height:"10px",borderRadius:"50%",background:profileColor}}/>
          <p style={{margin:0,fontSize:"15px",color:"#0F6E56",fontWeight:"600"}}>{t.welcomeBack}, {displayName}! {t.thankYou}</p>
        </div>
      )}

      <section style={{textAlign:"center",padding:"70px 20px 60px",background:"linear-gradient(180deg,#f0faf6 0%,#fff 100%)"}}>
        <div style={{display:"inline-block",background:"#E1F5EE",color:"#0F6E56",fontSize:"14px",padding:"7px 20px",borderRadius:"20px",marginBottom:"24px",fontWeight:"600"}}>{t.badge}</div>
        <h1 style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"clamp(36px,7vw,56px)",fontWeight:"700",color:"#0A2E1F",lineHeight:"1.15",marginBottom:"20px",letterSpacing:"-1.5px"}}>
          {t.heroTitle1}<br/><span style={{color:"#1D9E75"}}>{t.heroTitle2}</span>
        </h1>
        <p style={{fontSize:"clamp(17px,3vw,20px)",color:"#666",maxWidth:"500px",margin:"0 auto 40px",lineHeight:"1.7"}}>{t.heroDesc}</p>

        <div style={{maxWidth:"560px",margin:"0 auto 32px",display:"flex",gap:"0",boxShadow:"0 4px 20px rgba(0,0,0,0.1)",borderRadius:"14px",overflow:"hidden",border:"2px solid #1D9E75"}}>
          <input
            type="text"
            placeholder={lang==='es'?"Busca Starbucks, Walmart, McDonald's...":"Search Starbucks, Walmart, McDonald's..."}
            value={searchQuery}
            onChange={e=>setSearchQuery(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleSearch()}
            style={{flex:1,padding:"18px 20px",fontSize:"17px",border:"none",outline:"none",fontFamily:"'Inter',system-ui,sans-serif",color:"#1a1a1a",background:"white"}}
          />
          <button onClick={handleSearch} style={{background:"#1D9E75",color:"white",border:"none",padding:"18px 28px",fontSize:"17px",fontWeight:"700",cursor:"pointer",whiteSpace:"nowrap"}}>
            🔍 {lang==='es'?'Buscar':'Find'}
          </button>
        </div>

        <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap",marginBottom:"20px"}}>
          <a href="/map" style={{background:"#1D9E75",color:"white",padding:"15px 34px",borderRadius:"11px",textDecoration:"none",fontSize:"17px",fontWeight:"700"}}>{t.findBtn}</a>
          <a href="/business" style={{background:"white",color:"#0A2E1F",padding:"15px 34px",borderRadius:"11px",textDecoration:"none",fontSize:"17px",border:"1.5px solid #e0e0e0",fontWeight:"600"}}>{t.businessBtn}</a>
        </div>

        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}>
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" style={{lineHeight:0}}>
            <img
              src="/apple.png"
              alt={t.downloadIos}
              width={600}
              height={600}
              style={{width:"156px",height:"auto",display:"block"}}
            />
          </a>
          <span style={{fontSize:"11px",color:"#999",letterSpacing:"0.02em"}}>{t.appStoreComingSoon}</span>
        </div>
      </section>

      <section style={{padding:"0 20px 56px",maxWidth:"920px",margin:"0 auto"}}>
        <h2 style={{textAlign:"center",fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"clamp(24px,5vw,32px)",fontWeight:"700",color:"#0A2E1F",marginBottom:"8px",letterSpacing:"-0.5px"}}>{t.howTitle}</h2>
        <p style={{textAlign:"center",color:"#999",marginBottom:"28px",fontSize:"16px"}}>{t.howSub}</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"16px"}}>
          {[
            {title:t.howStep1Title,desc:t.howStep1Desc,icon:"🗺️"},
            {title:t.howStep2Title,desc:t.howStep2Desc,icon:"📊"},
            {title:t.howStep3Title,desc:t.howStep3Desc,icon:"🤝"},
          ].map((step,i)=>(
            <div key={i} style={{background:"#f8f8f8",borderRadius:"16px",padding:"24px",border:"1px solid #eee"}}>
              <div style={{fontSize:"28px",marginBottom:"12px"}}>{step.icon}</div>
              <div style={{fontSize:"16px",fontWeight:"700",color:"#0A2E1F",marginBottom:"8px"}}>{step.title}</div>
              <div style={{fontSize:"14px",color:"#666",lineHeight:"1.65"}}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <CounterSection/>

      <section style={{padding:"0 20px 48px",maxWidth:"920px",margin:"0 auto",textAlign:"center"}}>
        <h2 style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"clamp(20px,4vw,26px)",fontWeight:"700",color:"#0A2E1F",marginBottom:"8px"}}>{t.whoTitle}</h2>
        <p style={{color:"#666",fontSize:"16px",lineHeight:"1.7",maxWidth:"560px",margin:"0 auto"}}>{t.whoSub}</p>
      </section>

      <section style={{padding:"0 20px 60px",maxWidth:"920px",margin:"0 auto"}}>
        <div style={{background:"#E1F5EE",borderRadius:"18px",padding:"24px",border:"1px solid #9FE1CB"}}>
          <p style={{fontSize:"15px",color:"#0F6E56",fontWeight:"600",marginBottom:"6px"}}>
            {lang==='es'?'Ejemplos de listados — Irvine, CA':'Example listings — Irvine, CA'}
          </p>
          <p style={{fontSize:"12px",color:"#5DCAA5",marginBottom:"16px"}}>
            {lang==='es'?'Vista previa ilustrativa. Abre el mapa para datos en vivo.':'Illustrative preview. Open the map for live data.'}
          </p>
          <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
            {[
              {name:"Philz Coffee",area:"Irvine Spectrum · 0.1 mi",pin:"2580",stars:"★★★★★",score:"5.0",dot:"#1D9E75",blur:false},
              {name:"Panera Bread",area:"Culver Dr · 0.4 mi",pin:"1379",stars:"★★★☆☆",score:"3.1",dot:"#D97706",blur:false},
              {name:"Barnes & Noble",area:"Alton Pkwy · 0.7 mi",pin:"????",stars:"",score:"",dot:"#DC2626",blur:true},
            ].map((r,i)=>(
              <div key={i} style={{background:"white",borderRadius:"13px",padding:"18px",flex:"1",minWidth:"150px",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
                  <div style={{width:"10px",height:"10px",borderRadius:"50%",background:r.dot,flexShrink:0}}/>
                  <span style={{fontSize:"15px",fontWeight:"700",color:"#0A2E1F"}}>{r.name}</span>
                </div>
                <div style={{fontSize:"13px",color:"#999",marginBottom:"10px"}}>{r.area}</div>
                <div style={{background:r.blur?"#f5f5f5":"#E1F5EE",color:r.blur?"#bbb":"#085041",fontSize:"16px",fontWeight:"700",padding:"7px 14px",borderRadius:"8px",display:"inline-block",letterSpacing:"2px",filter:r.blur?"blur(4px)":"none"}}>{r.pin}</div>
                {r.blur&&<div style={{fontSize:"13px",color:"#DC2626",marginTop:"8px",fontWeight:"500"}}>{lang==='es'?'Código desconocido. Toca para reportar.':'PIN unknown. Tap to report.'}</div>}
                {r.stars&&<div style={{color:"#D97706",fontSize:"14px",marginTop:"8px"}}>{r.stars} {r.score}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:"0 20px 60px",maxWidth:"920px",margin:"0 auto"}}>
        <h2 style={{textAlign:"center",fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"clamp(26px,5vw,34px)",fontWeight:"700",color:"#0A2E1F",marginBottom:"10px",letterSpacing:"-1px"}}>
          {lang==='es'?'Todo lo que necesitas en el mapa.':'Everything you need on the map.'}
        </h2>
        <p style={{textAlign:"center",color:"#999",marginBottom:"36px",fontSize:"16px"}}>{t.footerSlogan}</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"14px"}}>
          {[
            {icon:"🔑",title:lang==='es'?'Encuentra acceso':'Find access',desc:lang==='es'?'Información de acceso al baño de negocios cercanos.':'Restroom access information for nearby businesses.'},
            {icon:"⭐",title:lang==='es'?'Puntuación de limpieza':'Cleanliness score',desc:lang==='es'?'Calificaciones reales de personas que estuvieron ahí.':'Real ratings from real people who were just there.'},
            {icon:"📍",title:lang==='es'?'Vista de mapa':'Map view',desc:lang==='es'?'Filtra por distancia, calificación y accesibilidad.':'Filter by distance, rating, and accessibility.'},
            {icon:"🚨",title:lang==='es'?'Modo urgente':'Urgent mode',desc:lang==='es'?'¿Lo necesitas ya? Encuentra el baño verificado más cercano.':'Need one now? Get the nearest verified restroom fast.'},
          ].map((f,i)=>(
            <div key={i} style={{background:"#f8f8f8",borderRadius:"14px",padding:"24px",border:"1px solid #eee"}}>
              <div style={{fontSize:"30px",marginBottom:"12px"}}>{f.icon}</div>
              <div style={{fontSize:"16px",fontWeight:"700",color:"#0A2E1F",marginBottom:"8px"}}>{f.title}</div>
              <div style={{fontSize:"14px",color:"#888",lineHeight:"1.6"}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:"0 20px 60px",maxWidth:"920px",margin:"0 auto"}}>
        <div style={{background:"#0A2E1F",borderRadius:"18px",padding:"32px 28px"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:"16px",marginBottom:"20px",flexWrap:"wrap"}}>
            <div style={{fontSize:"36px",flexShrink:0}}>⚖️</div>
            <div style={{flex:1,minWidth:"200px"}}>
              <div style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"22px",fontWeight:"700",color:"white",marginBottom:"10px"}}>
                {lang==='es'?'¿Eres dueño de un negocio?':'Are you a business owner?'}
              </div>
              <div style={{fontSize:"15px",color:"#9FE1CB",lineHeight:"1.8",marginBottom:"8px"}}>
                {lang==='es'
                  ?'FlushPin es una plataforma comunitaria. Si prefieres que tu negocio no aparezca en nuestra lista, respetamos tu decisión al instante.'
                  :'FlushPin is a community platform that helps people find nearby restroom access. If you prefer your business not to be listed, we fully respect that decision.'
                }
              </div>
              <div style={{fontSize:"15px",color:"#9FE1CB",lineHeight:"1.8",marginBottom:"16px"}}>
                {lang==='es'
                  ?'Al completar el formulario, tu negocio aparecerá marcado como "Baño no disponible al público" — documentado con tu nombre como representante autorizado.'
                  :'By completing our opt-out form, your business will be marked as "Restroom not available to the public" — documented with your name and title as authorized representative.'
                }
              </div>
              <div style={{background:"rgba(255,255,255,0.07)",borderRadius:"10px",padding:"16px",marginBottom:"20px",border:"1px solid rgba(255,255,255,0.1)"}}>
                <p style={{fontSize:"14px",color:"#9FE1CB",margin:0,lineHeight:"1.7"}}>
                  {lang==='es'
                    ?'📋 Su solicitud queda registrada oficialmente como evidencia de su decisión voluntaria.'
                    :'📋 Your request is officially logged as evidence of your voluntary decision — protecting both you and FlushPin legally.'
                  }
                </p>
              </div>
              <a href="/optout" style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"#1D9E75",color:"white",padding:"13px 26px",borderRadius:"10px",textDecoration:"none",fontSize:"15px",fontWeight:"700"}}>
                {lang==='es'?'Solicitar exclusión →':'Request opt-out →'}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section style={{padding:"0 20px 60px",maxWidth:"920px",margin:"0 auto",textAlign:"center"}}>
        <p style={{fontSize:"13px",fontWeight:"600",color:"#bbb",marginBottom:"8px",letterSpacing:"1px"}}>
          {lang==='es'?'COBERTURA EN EL SUR DE CALIFORNIA':'SOUTHERN CALIFORNIA COVERAGE'}
        </p>
        <p style={{fontSize:"12px",color:"#ccc",marginBottom:"14px"}}>
          {lang==='es'?'Ciudades con lugares en el mapa de FlushPin':'Cities with locations on the FlushPin map'}
        </p>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap",justifyContent:"center"}}>
          {liveCities.map((c,i)=>(
            <span key={c} style={{background:"#E1F5EE",color:"#0F6E56",border:"1px solid #9FE1CB",borderRadius:"20px",fontSize:"14px",padding:"7px 18px",fontWeight:i<3?"600":"400"}}>{c}</span>
          ))}
        </div>
      </section>

      <footer style={{background:"#0A2E1F",padding:"36px 20px",textAlign:"center"}}>
        <a href="/" style={{textDecoration:"none",display:"block",marginBottom:"10px"}}>
          <span style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"22px",fontWeight:"700",color:"#ffffff",letterSpacing:"-0.5px"}}>flushpin</span>
        </a>
        <div style={{fontSize:"13px",color:"#5DCAA5",marginBottom:"6px"}}>flushpin.com — California</div>
        <div style={{fontSize:"13px",color:"#2D6A4F",marginBottom:"14px"}}>{t.footerSlogan}</div>
        <div style={{display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap"}}>
          <a href="/privacy" style={{color:"#5DCAA5",fontSize:"13px",textDecoration:"none"}}>{t.privacy}</a>
          <a href="/terms" style={{color:"#5DCAA5",fontSize:"13px",textDecoration:"none"}}>{t.terms}</a>
          <a href="/safety" style={{color:"#5DCAA5",fontSize:"13px",textDecoration:"none"}}>{t.safety}</a>
          <a href="/contact" style={{color:"#5DCAA5",fontSize:"13px",textDecoration:"none"}}>{t.contact}</a>
        </div>
        <p style={{color:"#2D6A4F",fontSize:"12px",marginTop:"12px"}}>© 2026 FlushPin. All rights reserved.</p>
      </footer>

      {showAuth && (
        <div onClick={()=>{setShowAuth(false);setMessage('')}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:"20px",padding:"30px 26px",width:"100%",maxWidth:"400px",maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}>
              <h2 style={{margin:0,fontSize:"22px",fontWeight:"700",color:"#0A2E1F"}}>{authMode==='signup'?t.joinFlushPin:t.welcomeBack}</h2>
              <button onClick={()=>{setShowAuth(false);setMessage('')}} style={{background:"none",border:"none",fontSize:"26px",cursor:"pointer",color:"#999"}}>✕</button>
            </div>

            <div style={{display:"flex",background:"#f5f5f5",borderRadius:"10px",padding:"4px",marginBottom:"20px"}}>
              <button onClick={()=>{setAuthMode('signup');setMessage('')}} style={{flex:1,padding:"10px",borderRadius:"8px",border:"none",fontSize:"15px",fontWeight:"600",cursor:"pointer",background:authMode==='signup'?"white":"transparent",color:authMode==='signup'?"#0A2E1F":"#666",boxShadow:authMode==='signup'?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>{t.signUp}</button>
              <button onClick={()=>{setAuthMode('signin');setMessage('')}} style={{flex:1,padding:"10px",borderRadius:"8px",border:"none",fontSize:"15px",fontWeight:"600",cursor:"pointer",background:authMode==='signin'?"white":"transparent",color:authMode==='signin'?"#0A2E1F":"#666",boxShadow:authMode==='signin'?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>{t.signIn}</button>
            </div>

            <button onClick={handleGoogleSignIn} style={{width:"100%",background:"white",color:"#333",border:"1.5px solid #e0e0e0",padding:"13px",borderRadius:"10px",fontSize:"15px",fontWeight:"600",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",marginBottom:"16px"}}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              {t.continueGoogle}
            </button>

            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"16px"}}>
              <div style={{flex:1,height:"1px",background:"#f0f0f0"}}/>
              <span style={{fontSize:"13px",color:"#bbb"}}>or</span>
              <div style={{flex:1,height:"1px",background:"#f0f0f0"}}/>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
              {authMode==='signup' && (
                <>
                  <div>
                    <label style={labelStyle}>{t.fullName}</label>
                    <input style={inputStyle} placeholder="Jane Smith" value={fullName} onChange={e=>setFullName(e.target.value)}/>
                  </div>
                  <div>
                    <label style={labelStyle}>{t.profileColor}</label>
                    <p style={{fontSize:"13px",color:"#999",margin:"0 0 8px"}}>{t.colorDesc}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
                      {COLOR_OPTIONS.map(color=>(
                        <div key={color} onClick={()=>setSelectedColor(color)} style={{width:"30px",height:"30px",borderRadius:"50%",background:color,cursor:"pointer",border:selectedColor===color?"3px solid #0A2E1F":"3px solid transparent",boxSizing:"border-box",transform:selectedColor===color?"scale(1.15)":"scale(1)"}}/>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <div>
                <label style={labelStyle}>{t.email}</label>
                <input style={inputStyle} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
              </div>
              <div>
                <label style={labelStyle}>{t.password}</label>
                <input style={inputStyle} type="password" placeholder={t.passwordPlaceholder} value={password} onChange={e=>setPassword(e.target.value)}/>
              </div>
              {message && <p style={{fontSize:"14px",color:message.startsWith('✅')?'#1D9E75':message.startsWith('⚠️')?'#D97706':'#DC2626',margin:0,fontWeight:"500"}}>{message}</p>}
              <button onClick={authMode==='signup'?handleSignUp:handleSignIn} disabled={loading} style={{background:"#1D9E75",color:"white",border:"none",padding:"16px",borderRadius:"10px",fontSize:"17px",fontWeight:"700",cursor:"pointer",opacity:loading?0.7:1}}>
                {loading?'...':(authMode==='signup'?t.createAccount:t.signIn)}
              </button>
              {authMode==='signin' && <button onClick={()=>setAuthMode('signup')} style={{background:"none",border:"none",color:"#1D9E75",fontSize:"14px",fontWeight:"600",cursor:"pointer",padding:0}}>{t.forgotAccount}</button>}
              {authMode==='signup' && <p style={{fontSize:"13px",color:"#888",margin:0,textAlign:"center",lineHeight:"1.6"}}>{t.disclaimer}</p>}
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
