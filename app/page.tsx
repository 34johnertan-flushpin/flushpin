'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'


export default function HomeScreen() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <main style={{margin:0,padding:0,fontFamily:"'Inter',system-ui,sans-serif",background:"#fff",color:"#0A2E1F"}}>

      {/* NAV */}
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 24px",borderBottom:"1px solid #eee",position:"sticky",top:0,background:"#fff",zIndex:100}}>
        <span style={{fontWeight:800,fontSize:"20px",color:"#1D9E75"}}>FlushPin</span>
        <div style={{display:"flex",gap:"12px"}}>
          <button onClick={()=>router.push('/map')} style={{background:"none",border:"1px solid #1D9E75",color:"#1D9E75",padding:"8px 16px",borderRadius:"8px",fontWeight:"600",cursor:"pointer"}}>Find a Restroom</button>
          <button onClick={()=>router.push('/signup')} style={{background:"#1D9E75",border:"none",color:"white",padding:"8px 16px",borderRadius:"8px",fontWeight:"600",cursor:"pointer"}}>Sign Up Free</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{padding:"64px 24px 48px",textAlign:"center",maxWidth:"720px",margin:"0 auto"}}>
        <p style={{fontSize:"13px",fontWeight:"700",color:"#1D9E75",letterSpacing:"2px",margin:"0 0 16px"}}>🌎 NOW IN CALIFORNIA</p>
        <h1 style={{fontSize:"clamp(32px,6vw,56px)",fontWeight:"900",lineHeight:1.1,margin:"0 0 20px",color:"#0A2E1F"}}>
          Find Restroom PIN Codes.<br/>
          <span style={{color:"#1D9E75"}}>Fast. Free. Dignified.</span>
        </h1>
        <p style={{fontSize:"18px",color:"#444",lineHeight:1.7,margin:"0 0 32px"}}>
          FlushPin is the community-powered app that finds restroom access codes at Starbucks, Panera, Target, and thousands of businesses near you. No more awkward asking.
        </p>
        <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>router.push('/map')} style={{background:"#1D9E75",color:"white",border:"none",padding:"16px 32px",borderRadius:"12px",fontSize:"17px",fontWeight:"700",cursor:"pointer"}}>
            🔍 Find a Restroom Now
          </button>
          <button onClick={()=>router.push('/signup')} style={{background:"white",color:"#1D9E75",border:"2px solid #1D9E75",padding:"16px 32px",borderRadius:"12px",fontSize:"17px",fontWeight:"700",cursor:"pointer"}}>
            Join Free →
          </button>
        </div>
      </section>

      {/* VISION STRIP */}
      <section style={{background:"#0A2E1F",color:"white",padding:"32px 24px",textAlign:"center"}}>
        <p style={{margin:0,fontSize:"16px",fontWeight:"600",letterSpacing:"1px"}}>
          🚀 Starting in California &nbsp;·&nbsp; Coming to New York, Chicago, Miami, Istanbul &amp; beyond
        </p>
      </section>

      {/* FEATURES */}
      <section style={{padding:"64px 24px",maxWidth:"900px",margin:"0 auto"}}>
        <h2 style={{textAlign:"center",fontSize:"32px",fontWeight:"800",marginBottom:"48px"}}>Everything you need on the map.</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"24px"}}>
          {[
            {icon:"🔑",title:"Find Access",desc:"Restroom PIN codes for nearby businesses, updated by the community."},
            {icon:"⭐",title:"Cleanliness Score",desc:"Real ratings from real people who were just there."},
            {icon:"📍",title:"Map View",desc:"Filter by distance, rating, and accessibility."},
            {icon:"🚨",title:"Urgent Mode",desc:"Need one now? Get the nearest verified restroom fast."},
          ].map(f=>(
            <div key={f.title} style={{background:"#f8fdf9",borderRadius:"16px",padding:"28px 20px",textAlign:"center"}}>
              <div style={{fontSize:"36px",marginBottom:"12px"}}>{f.icon}</div>
              <h3 style={{fontSize:"18px",fontWeight:"700",margin:"0 0 8px"}}>{f.title}</h3>
              <p style={{fontSize:"14px",color:"#555",margin:0,lineHeight:1.6}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <section style={{background:"#f0faf5",padding:"48px 24px",textAlign:"center"}}>
        <p style={{fontSize:"22px",fontStyle:"italic",color:"#0A2E1F",maxWidth:"600px",margin:"0 auto",lineHeight:1.6}}>
          "Finally, I don't have to ask the barista anymore."
        </p>
        <p style={{fontSize:"14px",color:"#888",marginTop:"12px"}}>— FlushPin user, California</p>
      </section>

      {/* OPT OUT */}
      <section style={{padding:"48px 24px",maxWidth:"680px",margin:"0 auto",textAlign:"center"}}>
        <div style={{background:"#fff8e1",borderRadius:"16px",padding:"32px",border:"1px solid #ffe082"}}>
          <h3 style={{fontSize:"20px",fontWeight:"700",marginBottom:"12px"}}>⚖️ Are you a business owner?</h3>
          <p style={{fontSize:"15px",color:"#555",lineHeight:1.7,marginBottom:"20px"}}>
            FlushPin respects your policies. If you prefer your business not to be listed, simply request an opt-out — your decision will be officially documented.
          </p>
          <button onClick={()=>router.push('/optout')} style={{background:"#0A2E1F",color:"white",border:"none",padding:"12px 28px",borderRadius:"10px",fontSize:"15px",fontWeight:"600",cursor:"pointer"}}>
            Request Opt-Out →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:"1px solid #eee",padding:"32px 24px",textAlign:"center",color:"#888",fontSize:"13px"}}>
        <p style={{fontWeight:"700",color:"#1D9E75",fontSize:"16px",margin:"0 0 8px"}}>FlushPin</p>
        <p style={{margin:"0 0 12px"}}>Find it. Rate it. Flush it.</p>
        <div style={{display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap"}}>
          <a href="/privacy" style={{color:"#888",textDecoration:"none"}}>Privacy Policy</a>
          <a href="/terms" style={{color:"#888",textDecoration:"none"}}>Terms of Service</a>
          <a href="/contact" style={{color:"#888",textDecoration:"none"}}>Contact</a>
          <a href="/business" style={{color:"#888",textDecoration:"none"}}>For Businesses</a>
        </div>
        <p style={{margin:"16px 0 0",color:"#bbb"}}>© 2025 FlushPin. All rights reserved.</p>
      </footer>

    </main>
  )
}