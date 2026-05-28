export default function Home() {
  return (
    <main style={{margin:0,padding:0,fontFamily:"-apple-system,'Inter',sans-serif",background:"#fff",minHeight:"100vh"}}>

      {/* NAV */}
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 40px",borderBottom:"1px solid #f0f0f0",background:"#fff"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="11" fill="#0A2E1F"/>
            <ellipse cx="24" cy="18" rx="9" ry="9" fill="white"/>
            <ellipse cx="24" cy="18" rx="5" ry="5" fill="#1D9E75"/>
            <path d="M24 27 L16 40 Q24 48 32 40 Z" fill="white"/>
            <path d="M15 42 Q24 52 33 42" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
          <span style={{fontSize:"20px",fontWeight:"700",color:"#0A2E1F",letterSpacing:"-0.5px"}}>FlushPin</span>
        </div>
        <div style={{display:"flex",gap:"16px",alignItems:"center"}}>
          <a href="#" style={{color:"#555",textDecoration:"none",fontSize:"14px"}}>For Businesses</a>
          <a href="#" style={{background:"#1D9E75",color:"white",padding:"9px 22px",borderRadius:"8px",textDecoration:"none",fontSize:"14px",fontWeight:"600"}}>Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{textAlign:"center",padding:"80px 20px 60px",background:"linear-gradient(180deg,#f0faf6 0%,#fff 100%)"}}>
        <div style={{display:"inline-block",background:"#E1F5EE",color:"#0F6E56",fontSize:"13px",padding:"6px 16px",borderRadius:"20px",marginBottom:"24px",fontWeight:"600"}}>
          📍 Now in Orange County, CA
        </div>
        <h1 style={{fontSize:"52px",fontWeight:"700",color:"#0A2E1F",lineHeight:"1.2",marginBottom:"20px",letterSpacing:"-1.5px"}}>
          Find the code.<br/>
          <span style={{color:"#1D9E75"}}>Use a clean restroom.</span>
        </h1>
        <p style={{fontSize:"18px",color:"#666",maxWidth:"480px",margin:"0 auto 40px",lineHeight:"1.7"}}>
          Unlock restroom PIN codes at nearby businesses, see real cleanliness scores, and help your community.
        </p>
        <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
          <a href="#" style={{background:"#1D9E75",color:"white",padding:"14px 32px",borderRadius:"10px",textDecoration:"none",fontSize:"16px",fontWeight:"700",boxShadow:"0 4px 14px rgba(29,158,117,0.3)"}}>Find a Restroom →</a>
          <a href="#" style={{background:"white",color:"#0A2E1F",padding:"14px 32px",borderRadius:"10px",textDecoration:"none",fontSize:"16px",border:"1.5px solid #ddd",fontWeight:"500"}}>For Businesses</a>
        </div>
      </section>

      {/* MAP PREVIEW */}
      <section style={{padding:"0 40px 60px",maxWidth:"860px",margin:"0 auto"}}>
        <div style={{background:"#E1F5EE",borderRadius:"16px",padding:"24px",border:"1px solid #9FE1CB"}}>
          <p style={{fontSize:"13px",color:"#0F6E56",fontWeight:"600",marginBottom:"16px",margin:"0 0 16px"}}>📍 Restrooms near you — Irvine, CA</p>
          <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
            {[
              {name:"Philz Coffee",area:"Irvine Spectrum · 0.1 mi",code:"2580",stars:"★★★★★",score:"5.0",dot:"#1D9E75",blur:false},
              {name:"Panera Bread",area:"Culver Dr · 0.4 mi",code:"1379",stars:"★★★☆☆",score:"3.1",dot:"#D97706",blur:false},
              {name:"Barnes & Noble",area:"Alton Pkwy · 0.7 mi",code:"????",stars:"",score:"",dot:"#DC2626",blur:true},
            ].map((r,i)=>(
              <div key={i} style={{background:"white",borderRadius:"12px",padding:"14px 16px",flex:"1",minWidth:"160px",boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
                  <div style={{width:"10px",height:"10px",borderRadius:"50%",background:r.dot,flexShrink:0}}></div>
                  <span style={{fontSize:"13px",fontWeight:"600",color:"#0A2E1F"}}>{r.name}</span>
                </div>
                <div style={{fontSize:"11px",color:"#999",marginBottom:"10px"}}>{r.area}</div>
                <div style={{background:r.blur?"#f5f5f5":"#E1F5EE",color:r.blur?"#bbb":"#085041",fontSize:"14px",fontWeight:"700",padding:"5px 12px",borderRadius:"7px",display:"inline-block",letterSpacing:"2px",filter:r.blur?"blur(4px)":"none"}}>{r.code}</div>
                {r.blur && <div style={{fontSize:"11px",color:"#DC2626",marginTop:"6px"}}>⚠ Code unknown — tap to report</div>}
                {r.stars && <div style={{color:"#D97706",fontSize:"11px",marginTop:"6px"}}>{r.stars} {r.score}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:"20px 40px 60px",maxWidth:"860px",margin:"0 auto"}}>
        <h2 style={{textAlign:"center",fontSize:"28px",fontWeight:"700",color:"#0A2E1F",marginBottom:"8px",letterSpacing:"-0.5px"}}>Everything you need, right on the map</h2>
        <p style={{textAlign:"center",color:"#999",marginBottom:"36px",fontSize:"15px"}}>Find it. Rate it. Flush it.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"16px"}}>
          {[
            {icon:"🔒",title:"Get the code",desc:"Instantly see the PIN for any listed restroom near you."},
            {icon:"⭐",title:"Cleanliness score",desc:"Rate restrooms and upload photos to help others decide."},
            {icon:"🗺️",title:"Map view",desc:"See all nearby options filtered by distance and rating."},
            {icon:"🔄",title:"Report & update",desc:"Code changed? Report it and keep the community accurate."},
          ].map((f,i)=>(
            <div key={i} style={{background:"#f9f9f9",borderRadius:"12px",padding:"22px",border:"1px solid #eee"}}>
              <div style={{fontSize:"28px",marginBottom:"12px"}}>{f.icon}</div>
              <div style={{fontSize:"14px",fontWeight:"600",color:"#0A2E1F",marginBottom:"6px"}}>{f.title}</div>
              <div style={{fontSize:"12px",color:"#888",lineHeight:"1.7"}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AWARD */}
      <section style={{padding:"0 40px 60px",maxWidth:"860px",margin:"0 auto"}}>
        <div style={{background:"#0A2E1F",borderRadius:"16px",padding:"28px 32px",display:"flex",alignItems:"center",gap:"24px"}}>
          <div style={{flexShrink:0}}>
            <svg width="54" height="54" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="11" fill="#1D9E75"/>
              <ellipse cx="24" cy="18" rx="9" ry="9" fill="white"/>
              <ellipse cx="24" cy="18" rx="5" ry="5" fill="#1D9E75"/>
              <path d="M24 27 L16 40 Q24 48 32 40 Z" fill="white"/>
              <path d="M15 42 Q24 52 33 42" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{fontSize:"18px",fontWeight:"700",color:"white",marginBottom:"6px"}}>The FlushPin Award 🏆</div>
            <div style={{fontSize:"13px",color:"#9FE1CB",lineHeight:"1.7",marginBottom:"12px"}}>
              Businesses with a FlushScore of 4.8+ earn our Golden Badge — displayed on their profile and as a door sticker customers can trust.
            </div>
            <div style={{display:"inline-flex",alignItems:"center",gap:"6px",background:"#1D9E75",color:"white",fontSize:"12px",padding:"6px 14px",borderRadius:"20px",fontWeight:"600"}}>
              ⭐ FlushScore 4.8 or above
            </div>
          </div>
        </div>
      </section>

      {/* CITIES */}
      <section style={{padding:"0 40px 60px",maxWidth:"860px",margin:"0 auto",textAlign:"center"}}>
        <p style={{fontSize:"13px",fontWeight:"600",color:"#999",marginBottom:"12px"}}>Starting in Orange County</p>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap",justifyContent:"center"}}>
          {["Irvine","Newport Beach","Anaheim","Santa Ana","Huntington Beach","Costa Mesa","+ more coming"].map((c,i)=>(
            <span key={i} style={{background:i<2?"#E1F5EE":"#f5f5f5",color:i<2?"#0F6E56":"#888",border:i<2?"1px solid #9FE1CB":"1px solid #eee",borderRadius:"20px",fontSize:"13px",padding:"6px 16px",fontWeight:i<2?"600":"400"}}>{c}</span>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#0A2E1F",padding:"32px 40px",textAlign:"center",marginTop:"20px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",marginBottom:"8px"}}>
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="11" fill="#1D9E75"/>
            <ellipse cx="24" cy="18" rx="9" ry="9" fill="white"/>
            <ellipse cx="24" cy="18" rx="5" ry="5" fill="#1D9E75"/>
            <path d="M24 27 L16 40 Q24 48 32 40 Z" fill="white"/>
            <path d="M15 42 Q24 52 33 42" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
          <span style={{fontSize:"18px",fontWeight:"700",color:"white"}}>FlushPin</span>
        </div>
        <div style={{fontSize:"12px",color:"#5DCAA5",letterSpacing:"0.5px"}}>flushpin.com · Orange County, California</div>
        <div style={{fontSize:"11px",color:"#2D6A4F",marginTop:"6px"}}>Find it. Rate it. Flush it.</div>
      </footer>

    </main>
  )
}
