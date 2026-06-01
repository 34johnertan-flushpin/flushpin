'use client'
import { useState } from 'react'

const Logo = () => (
  <a href="/" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:"10px"}}>
    <div style={{width:"38px",height:"38px",background:"#1D9E75",borderRadius:"10px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"3px",flexShrink:0}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"2px",width:"20px"}}>
        {[1,1,1,1,1,1,0,1,0].map((v,i)=>(<div key={i} style={{width:"5px",height:"5px",borderRadius:"50%",background:v?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.15)"}}/>))}
      </div>
      <div style={{width:0,height:0,borderLeft:"4px solid transparent",borderRight:"4px solid transparent",borderTop:"6px solid #1D9E75",marginTop:"-1px"}}/>
    </div>
    <span style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"20px",fontWeight:"700",color:"#0A2E1F",letterSpacing:"-0.5px"}}>Flush<span style={{color:"#1D9E75"}}>Pin</span></span>
  </a>
)

const plans = [
  {
    name: "Free",
    price: 0,
    color: "#f5f5f5",
    textColor: "#555",
    badge: "",
    features: [
      "Basic listing on FlushPin map",
      "Add & update your PIN code",
      "Customer cleanliness ratings",
      "1 location",
    ],
    cta: "Get started free",
    ctaBg: "#0A2E1F",
    popular: false,
  },
  {
    name: "Silver",
    price: 19,
    color: "#E1F5EE",
    textColor: "#0F6E56",
    badge: "",
    features: [
      "Everything in Free",
      "✓ Verified Business badge",
      "Monthly cleanliness report",
      "PIN update history & analytics",
      "Priority listing in search",
      "Email support",
    ],
    cta: "Start Silver",
    ctaBg: "#1D9E75",
    popular: false,
  },
  {
    name: "Gold",
    price: 49,
    color: "#FEF3C7",
    textColor: "#92400E",
    badge: "Most Popular",
    features: [
      "Everything in Silver",
      "⭐ Featured placement on map",
      "QR code sticker pack (mailed)",
      "Respond to customer reviews",
      "Weekly performance reports",
      "Custom PIN update alerts",
      "Phone & email support",
    ],
    cta: "Start Gold",
    ctaBg: "#D97706",
    popular: true,
  },
  {
    name: "Platinum",
    price: 99,
    color: "#0A2E1F",
    textColor: "#9FE1CB",
    badge: "Enterprise",
    features: [
      "Everything in Gold",
      "🏆 FlushPin Award eligibility",
      "Multi-location management",
      "Branded door sticker (certified)",
      "Dedicated account manager",
      "API access for POS integration",
      "Custom reporting dashboard",
      "SLA & priority support",
    ],
    cta: "Contact us",
    ctaBg: "#1D9E75",
    popular: false,
  },
]

const faqs = [
  {q:"How does the PIN verification work?", a:"Your staff updates the PIN through your business dashboard. FlushPin users confirm it works after each visit — keeping it accurate in real time."},
  {q:"What is the FlushPin Award?", a:"Businesses with a sustained FlushScore of 4.8 or above earn a certified clean badge. We mail you a door sticker your customers can trust."},
  {q:"Can I manage multiple locations?", a:"Yes — Platinum plan includes multi-location management from a single dashboard. Perfect for chains and franchises."},
  {q:"Is there a contract?", a:"No contracts, cancel anytime. All plans are billed monthly."},
  {q:"How do I get the QR code sticker?", a:"Gold and Platinum subscribers receive a physical QR sticker pack by mail. Customers scan it to see your live PIN and cleanliness score."},
  {q:"What is the free door sticker?", a:"Any business can request a complimentary FlushPin door sticker — no subscription required. We mail it to you free. It lets your customers know your restroom is listed and verified on FlushPin."},
]

export default function BusinessPage() {
  const [billing, setBilling] = useState<'monthly'|'yearly'>('monthly')
  const [openFaq, setOpenFaq] = useState<number|null>(null)
  const [showContact, setShowContact] = useState(false)
  const [showStickerForm, setShowStickerForm] = useState(false)
  const [form, setForm] = useState({name:'',business:'',email:'',plan:'Gold',message:''})
  const [stickerForm, setStickerForm] = useState({name:'',business:'',address:'',city:'',zip:'',email:''})
  const [sent, setSent] = useState(false)
  const [stickerSent, setStickerSent] = useState(false)

  const price = (p:number) => billing==='yearly' ? Math.round(p*0.8) : p

  const inputStyle = {width:'100%',padding:'11px 14px',borderRadius:'9px',border:'1px solid #e0e0e0',fontSize:'14px',outline:'none',boxSizing:'border-box' as const,color:'#1a1a1a',fontFamily:"'Inter',system-ui,sans-serif"}
  const labelStyle = {fontSize:'12px',fontWeight:'600' as const,color:'#444',marginBottom:'6px',display:'block' as const}

  return (
    <main style={{margin:0,padding:0,fontFamily:"'Inter',system-ui,sans-serif",background:"#fff",minHeight:"100vh"}}>

      {/* NAV */}
      <nav style={{background:"white",borderBottom:"1px solid #f0f0f0",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:20}}>
        <Logo/>
        <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
          <a href="/map" style={{color:"#555",textDecoration:"none",fontSize:"14px",fontWeight:"500"}}>Find a Restroom</a>
          <button onClick={()=>setShowContact(true)} style={{background:"#1D9E75",color:"white",border:"none",padding:"9px 18px",borderRadius:"9px",fontSize:"14px",fontWeight:"600",cursor:"pointer"}}>Get started</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{textAlign:"center",padding:"70px 20px 60px",background:"linear-gradient(180deg,#f0faf6 0%,#fff 100%)"}}>
        <div style={{display:"inline-block",background:"#E1F5EE",color:"#0F6E56",fontSize:"13px",padding:"6px 18px",borderRadius:"20px",marginBottom:"24px",fontWeight:"600"}}>For Businesses</div>
        <h1 style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"clamp(28px,6vw,48px)",fontWeight:"700",color:"#0A2E1F",lineHeight:"1.2",marginBottom:"20px",letterSpacing:"-1.5px"}}>
          Your restroom is part<br/>of your brand.
        </h1>
        <p style={{fontSize:"clamp(15px,3vw,18px)",color:"#666",maxWidth:"520px",margin:"0 auto 40px",lineHeight:"1.7"}}>
          Customers judge your business by your restroom. FlushPin helps you keep it verified, clean, and trusted — while putting you on the map for thousands of nearby users.
        </p>
        <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>setShowContact(true)} style={{background:"#1D9E75",color:"white",padding:"14px 32px",borderRadius:"11px",border:"none",fontSize:"16px",fontWeight:"700",cursor:"pointer"}}>List your business →</button>
          <button onClick={()=>{const el=document.getElementById('sticker-section');el?.scrollIntoView({behavior:'smooth'})}} style={{background:"white",color:"#0A2E1F",padding:"14px 32px",borderRadius:"11px",fontSize:"16px",border:"1.5px solid #e0e0e0",fontWeight:"600",cursor:"pointer"}}>Get free sticker 🏷️</button>
        </div>
      </section>

      {/* STATS */}
      <section style={{padding:"0 20px 60px",maxWidth:"860px",margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"16px"}}>
          {[
            {num:"847+",label:"PIN codes tracked",sub:"across Orange County"},
            {num:"124+",label:"venues listed",sub:"and growing daily"},
            {num:"4.8★",label:"average FlushScore",sub:"for verified businesses"},
            {num:"6+",label:"cities covered",sub:"expanding monthly"},
          ].map((s,i)=>(
            <div key={i} style={{background:"#f8f8f8",borderRadius:"14px",padding:"22px 18px",textAlign:"center",border:"1px solid #eee"}}>
              <div style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"28px",fontWeight:"700",color:"#0A2E1F"}}>{s.num}</div>
              <div style={{fontSize:"13px",fontWeight:"600",color:"#555",marginTop:"4px"}}>{s.label}</div>
              <div style={{fontSize:"11px",color:"#999",marginTop:"2px"}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FREE STICKER SECTION */}
      <section id="sticker-section" style={{padding:"0 20px 80px",maxWidth:"960px",margin:"0 auto"}}>
        <div style={{background:"linear-gradient(135deg,#0A2E1F 0%,#1a4a32 100%)",borderRadius:"24px",overflow:"hidden",position:"relative"}}>
          
          {/* Background decoration */}
          <div style={{position:"absolute",top:"-40px",right:"-40px",width:"200px",height:"200px",borderRadius:"50%",background:"rgba(29,158,117,0.15)"}}/>
          <div style={{position:"absolute",bottom:"-20px",left:"-20px",width:"120px",height:"120px",borderRadius:"50%",background:"rgba(29,158,117,0.1)"}}/>

          <div style={{display:"flex",flexWrap:"wrap",gap:"0",position:"relative",zIndex:1}}>
            
            {/* Left: Sticker visual */}
            <div style={{flex:"1",minWidth:"280px",padding:"48px 40px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
              
              {/* Sticker mockup */}
              <div style={{position:"relative",marginBottom:"28px"}}>
                {/* Door frame */}
                <div style={{width:"180px",height:"220px",background:"#8B6914",borderRadius:"8px 8px 0 0",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"4px 4px 20px rgba(0,0,0,0.4)"}}>
                  <div style={{width:"160px",height:"200px",background:"#A0783A",borderRadius:"6px 6px 0 0",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                    
                    {/* Door panel detail */}
                    <div style={{position:"absolute",top:"20px",left:"10px",right:"10px",height:"70px",border:"2px solid rgba(255,255,255,0.1)",borderRadius:"4px"}}/>
                    <div style={{position:"absolute",bottom:"40px",left:"10px",right:"10px",height:"60px",border:"2px solid rgba(255,255,255,0.1)",borderRadius:"4px"}}/>
                    
                    {/* Door knob */}
                    <div style={{position:"absolute",right:"12px",top:"50%",width:"14px",height:"14px",borderRadius:"50%",background:"#C8A84B",boxShadow:"0 2px 4px rgba(0,0,0,0.3)"}}/>
                    
                    {/* STICKER on door */}
                    <div style={{
                      position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
                      width:"90px",height:"90px",
                      background:"linear-gradient(135deg,#1D9E75,#0A5C42)",
                      borderRadius:"12px",
                      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                      gap:"4px",
                      boxShadow:"0 4px 16px rgba(0,0,0,0.4)",
                      border:"3px solid rgba(255,255,255,0.3)"
                    }}>
                      {/* Mini logo dots */}
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"2px",width:"20px",marginBottom:"2px"}}>
                        {[1,1,1,1,1,1,0,1,0].map((v,i)=>(<div key={i} style={{width:"5px",height:"5px",borderRadius:"50%",background:v?"white":"rgba(255,255,255,0.2)"}}/>))}
                      </div>
                      <div style={{width:0,height:0,borderLeft:"4px solid transparent",borderRight:"4px solid transparent",borderTop:"6px solid rgba(255,255,255,0.9)",marginTop:"-2px"}}/>
                      <div style={{fontSize:"9px",fontWeight:"800",color:"white",letterSpacing:"0.5px",marginTop:"3px"}}>FlushPin</div>
                      <div style={{fontSize:"7px",color:"rgba(255,255,255,0.7)",letterSpacing:"0.3px"}}>VERIFIED ✓</div>
                    </div>
                  </div>
                </div>
                {/* Floor */}
                <div style={{width:"180px",height:"10px",background:"#5a4520",borderRadius:"0 0 4px 4px"}}/>
              </div>

              <p style={{fontSize:"13px",color:"rgba(255,255,255,0.5)",textAlign:"center",margin:0,fontStyle:"italic"}}>Your door. Your trust signal.</p>
            </div>

            {/* Right: Content + form */}
            <div style={{flex:"1.4",minWidth:"280px",padding:"48px 40px 48px 20px"}}>
              <div style={{display:"inline-block",background:"rgba(29,158,117,0.25)",color:"#9FE1CB",fontSize:"12px",padding:"5px 14px",borderRadius:"20px",marginBottom:"16px",fontWeight:"600",letterSpacing:"0.5px"}}>
                🏷️ FREE — NO SUBSCRIPTION NEEDED
              </div>
              <h2 style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"clamp(22px,4vw,32px)",fontWeight:"700",color:"white",marginBottom:"14px",lineHeight:"1.2",letterSpacing:"-0.5px"}}>
                Get your free<br/>FlushPin door sticker
              </h2>
              <p style={{fontSize:"15px",color:"#9FE1CB",lineHeight:"1.7",marginBottom:"24px"}}>
                Let your customers know you're on FlushPin. We'll mail you a professional door sticker — completely free, no strings attached.
              </p>

              {/* Benefits */}
              <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"28px"}}>
                {[
                  {icon:"👁️", text:"Customers see you're verified before they walk in"},
                  {icon:"📱", text:"QR code links directly to your FlushPin listing"},
                  {icon:"🏆", text:"Builds instant trust — clean restroom = caring business"},
                  {icon:"📬", text:"Mailed to your door, anywhere in California"},
                ].map((b,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"10px"}}>
                    <span style={{fontSize:"16px",flexShrink:0,marginTop:"1px"}}>{b.icon}</span>
                    <span style={{fontSize:"14px",color:"rgba(255,255,255,0.8)",lineHeight:"1.5"}}>{b.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={()=>setShowStickerForm(true)}
                style={{
                  background:"#1D9E75",color:"white",border:"none",
                  padding:"15px 32px",borderRadius:"11px",
                  fontSize:"16px",fontWeight:"700",cursor:"pointer",
                  boxShadow:"0 4px 16px rgba(29,158,117,0.4)",
                  display:"flex",alignItems:"center",gap:"8px"
                }}
              >
                📬 Request my free sticker
              </button>
              <p style={{fontSize:"12px",color:"rgba(255,255,255,0.35)",marginTop:"12px",margin:"12px 0 0"}}>
                Free for all California businesses. Ships within 5–7 business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section style={{padding:"0 20px 60px",maxWidth:"860px",margin:"0 auto"}}>
        <h2 style={{textAlign:"center",fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"clamp(22px,4vw,30px)",fontWeight:"700",color:"#0A2E1F",marginBottom:"10px"}}>Why businesses join FlushPin</h2>
        <p style={{textAlign:"center",color:"#999",marginBottom:"36px",fontSize:"15px"}}>A clean restroom builds trust. FlushPin makes it visible.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"16px"}}>
          {[
            {icon:"📍",title:"Be found when it matters",desc:"Customers actively searching for clean restrooms nearby find your business first."},
            {icon:"🔑",title:"Keep your PIN current",desc:"Real-time PIN verification means customers always have the right code — no frustration at the door."},
            {icon:"⭐",title:"Turn cleanliness into reputation",desc:"High FlushScores appear on your profile and help you stand out from competitors."},
            {icon:"🏆",title:"Earn the FlushPin Award",desc:"A 4.8+ score earns our certified clean badge — displayed digitally and as a physical door sticker."},
            {icon:"📊",title:"Actionable insights",desc:"See how customers rate your restroom, what they say, and where you can improve."},
            {icon:"🤝",title:"Show customers you care",desc:"Verified businesses signal that cleanliness and customer experience are a priority."},
          ].map((f,i)=>(
            <div key={i} style={{background:"#f8f8f8",borderRadius:"14px",padding:"22px",border:"1px solid #eee"}}>
              <div style={{fontSize:"26px",marginBottom:"10px"}}>{f.icon}</div>
              <div style={{fontSize:"14px",fontWeight:"700",color:"#0A2E1F",marginBottom:"6px"}}>{f.title}</div>
              <div style={{fontSize:"13px",color:"#888",lineHeight:"1.6"}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{padding:"0 20px 60px",maxWidth:"980px",margin:"0 auto"}}>
        <h2 style={{textAlign:"center",fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"clamp(22px,4vw,30px)",fontWeight:"700",color:"#0A2E1F",marginBottom:"10px"}}>Simple, transparent pricing</h2>
        <p style={{textAlign:"center",color:"#999",marginBottom:"24px",fontSize:"15px"}}>No hidden fees. Cancel anytime.</p>
        <div style={{display:"flex",justifyContent:"center",marginBottom:"36px"}}>
          <div style={{display:"flex",background:"#f5f5f5",borderRadius:"10px",padding:"4px",gap:"4px"}}>
            <button onClick={()=>setBilling('monthly')} style={{padding:"8px 20px",borderRadius:"8px",border:"none",fontSize:"13px",fontWeight:"600",cursor:"pointer",background:billing==='monthly'?"white":"transparent",color:billing==='monthly'?"#0A2E1F":"#999",boxShadow:billing==='monthly'?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>Monthly</button>
            <button onClick={()=>setBilling('yearly')} style={{padding:"8px 20px",borderRadius:"8px",border:"none",fontSize:"13px",fontWeight:"600",cursor:"pointer",background:billing==='yearly'?"white":"transparent",color:billing==='yearly'?"#0A2E1F":"#999",boxShadow:billing==='yearly'?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>
              Yearly <span style={{background:"#1D9E75",color:"white",fontSize:"11px",padding:"2px 6px",borderRadius:"10px",marginLeft:"4px",fontWeight:"700"}}>Save 20%</span>
            </button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:"16px",alignItems:"start"}}>
          {plans.map((plan,i)=>(
            <div key={i} style={{background:plan.color,borderRadius:"18px",padding:"24px 20px",position:"relative",border:plan.popular?"2px solid #D97706":"2px solid transparent"}}>
              {plan.badge && (
                <div style={{position:"absolute",top:"-12px",left:"50%",transform:"translateX(-50%)",background:plan.popular?"#D97706":"#1D9E75",color:"white",fontSize:"11px",fontWeight:"700",padding:"4px 12px",borderRadius:"20px",whiteSpace:"nowrap"}}>{plan.badge}</div>
              )}
              <div style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"18px",fontWeight:"700",color:plan.name==="Platinum"?"white":"#0A2E1F",marginBottom:"6px"}}>{plan.name}</div>
              <div style={{marginBottom:"20px"}}>
                {plan.price===0 ? (
                  <span style={{fontSize:"32px",fontWeight:"700",color:plan.name==="Platinum"?"white":"#0A2E1F"}}>Free</span>
                ) : (
                  <>
                    <span style={{fontSize:"32px",fontWeight:"700",color:plan.name==="Platinum"?"white":"#0A2E1F"}}>${price(plan.price)}</span>
                    <span style={{fontSize:"14px",color:plan.textColor}}>/mo</span>
                    {billing==='yearly' && <div style={{fontSize:"11px",color:plan.textColor,marginTop:"2px"}}>billed annually</div>}
                  </>
                )}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"24px"}}>
                {plan.features.map((f,j)=>(
                  <div key={j} style={{display:"flex",alignItems:"flex-start",gap:"8px"}}>
                    <span style={{color:"#1D9E75",fontWeight:"700",flexShrink:0,marginTop:"1px"}}>✓</span>
                    <span style={{fontSize:"13px",color:plan.name==="Platinum"?"#9FE1CB":"#555",lineHeight:"1.5"}}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={()=>setShowContact(true)} style={{width:"100%",background:plan.ctaBg,color:"white",border:"none",padding:"12px",borderRadius:"10px",fontSize:"14px",fontWeight:"700",cursor:"pointer"}}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section style={{padding:"0 20px 60px",maxWidth:"680px",margin:"0 auto",textAlign:"center"}}>
        <div style={{background:"#0A2E1F",borderRadius:"18px",padding:"36px 28px"}}>
          <div style={{fontSize:"32px",marginBottom:"16px"}}>🏆</div>
          <p style={{fontSize:"clamp(16px,3vw,20px)",color:"white",fontWeight:"600",lineHeight:"1.6",margin:"0 0 20px",fontFamily:"'Space Grotesk','Inter',sans-serif"}}>
            "Our customers noticed the FlushPin badge on our door immediately. It tells them we take hygiene seriously — before they even walk in."
          </p>
          <p style={{fontSize:"13px",color:"#5DCAA5",margin:0}}>— Verified FlushPin Business, Irvine CA</p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding:"0 20px 60px",maxWidth:"680px",margin:"0 auto"}}>
        <h2 style={{textAlign:"center",fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"clamp(22px,4vw,28px)",fontWeight:"700",color:"#0A2E1F",marginBottom:"32px"}}>Frequently asked questions</h2>
        <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
          {faqs.map((faq,i)=>(
            <div key={i} style={{background:"#f8f8f8",borderRadius:"12px",overflow:"hidden",border:"1px solid #eee"}}>
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{width:"100%",background:"none",border:"none",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",textAlign:"left"}}>
                <span style={{fontSize:"14px",fontWeight:"600",color:"#0A2E1F"}}>{faq.q}</span>
                <span style={{fontSize:"20px",color:"#1D9E75",fontWeight:"700",flexShrink:0,marginLeft:"12px"}}>{openFaq===i?'−':'+'}</span>
              </button>
              {openFaq===i && (
                <div style={{padding:"0 20px 16px"}}>
                  <p style={{fontSize:"14px",color:"#666",lineHeight:"1.7",margin:0}}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"0 20px 80px",maxWidth:"680px",margin:"0 auto",textAlign:"center"}}>
        <div style={{background:"linear-gradient(135deg,#0A2E1F 0%,#1a4a32 100%)",borderRadius:"20px",padding:"48px 28px"}}>
          <h2 style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"clamp(22px,4vw,30px)",fontWeight:"700",color:"white",marginBottom:"14px"}}>Ready to get listed?</h2>
          <p style={{color:"#9FE1CB",fontSize:"15px",marginBottom:"28px",lineHeight:"1.6"}}>Join the businesses building trust with FlushPin. Start free, upgrade anytime.</p>
          <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>setShowContact(true)} style={{background:"#1D9E75",color:"white",border:"none",padding:"15px 36px",borderRadius:"11px",fontSize:"16px",fontWeight:"700",cursor:"pointer"}}>List your business for free →</button>
            <button onClick={()=>setShowStickerForm(true)} style={{background:"rgba(255,255,255,0.1)",color:"white",border:"1.5px solid rgba(255,255,255,0.2)",padding:"15px 36px",borderRadius:"11px",fontSize:"16px",fontWeight:"600",cursor:"pointer"}}>Get free sticker 🏷️</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#0A2E1F",padding:"32px 20px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",marginBottom:"10px"}}>
          <div style={{width:"30px",height:"30px",background:"#1D9E75",borderRadius:"8px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"2px"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"2px",width:"16px"}}>
              {[1,1,1,1,1,1,0,1,0].map((v,i)=>(<div key={i} style={{width:"4px",height:"4px",borderRadius:"50%",background:v?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.15)"}}/>))}
            </div>
            <div style={{width:0,height:0,borderLeft:"3px solid transparent",borderRight:"3px solid transparent",borderTop:"5px solid #1D9E75",marginTop:"-1px"}}/>
          </div>
          <span style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontSize:"18px",fontWeight:"700",color:"white"}}>FlushPin</span>
        </div>
        <div style={{fontSize:"12px",color:"#5DCAA5",marginBottom:"6px"}}>flushpin.com — California</div>
        <div style={{fontSize:"11px",color:"#2D6A4F"}}>Find it. Rate it. Flush it.</div>
      </footer>

      {/* STICKER FORM MODAL */}
      {showStickerForm && (
        <div onClick={()=>{setShowStickerForm(false);setStickerSent(false)}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:"20px",padding:"28px 24px",width:"100%",maxWidth:"440px",maxHeight:"90vh",overflowY:"auto"}}>
            {stickerSent ? (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:"56px",marginBottom:"16px"}}>📬</div>
                <h2 style={{fontSize:"22px",fontWeight:"700",color:"#0A2E1F",marginBottom:"12px"}}>Sticker on its way!</h2>
                <p style={{fontSize:"15px",color:"#555",lineHeight:"1.7",marginBottom:"8px"}}>
                  We'll send your free FlushPin door sticker to <strong>{stickerForm.address}, {stickerForm.city}</strong> within 5–7 business days.
                </p>
                <p style={{fontSize:"13px",color:"#999"}}>Check your email at <strong>{stickerForm.email}</strong> for confirmation.</p>
                <button onClick={()=>{setShowStickerForm(false);setStickerSent(false)}} style={{marginTop:"24px",background:"#1D9E75",color:"white",border:"none",padding:"12px 28px",borderRadius:"10px",fontSize:"15px",fontWeight:"700",cursor:"pointer"}}>Done ✓</button>
              </div>
            ) : (
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                  <h2 style={{margin:0,fontSize:"20px",fontWeight:"700",color:"#0A2E1F"}}>Get your free sticker</h2>
                  <button onClick={()=>setShowStickerForm(false)} style={{background:"none",border:"none",fontSize:"24px",cursor:"pointer",color:"#999"}}>✕</button>
                </div>
                <p style={{fontSize:"13px",color:"#999",marginBottom:"22px"}}>Fill in your details and we'll mail it to your business — completely free.</p>

                {/* Sticker preview */}
                <div style={{background:"linear-gradient(135deg,#0A2E1F,#1a4a32)",borderRadius:"14px",padding:"20px",marginBottom:"22px",display:"flex",alignItems:"center",gap:"16px"}}>
                  <div style={{width:"60px",height:"60px",background:"linear-gradient(135deg,#1D9E75,#0A5C42)",borderRadius:"10px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"3px",flexShrink:0,border:"2px solid rgba(255,255,255,0.2)"}}>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"2px",width:"16px"}}>
                      {[1,1,1,1,1,1,0,1,0].map((v,i)=>(<div key={i} style={{width:"4px",height:"4px",borderRadius:"50%",background:v?"white":"rgba(255,255,255,0.2)"}}/>))}
                    </div>
                    <div style={{width:0,height:0,borderLeft:"3px solid transparent",borderRight:"3px solid transparent",borderTop:"5px solid rgba(255,255,255,0.9)",marginTop:"-1px"}}/>
                    <div style={{fontSize:"7px",fontWeight:"700",color:"white",letterSpacing:"0.3px"}}>FlushPin</div>
                  </div>
                  <div>
                    <div style={{fontSize:"14px",fontWeight:"700",color:"white",marginBottom:"4px"}}>FlushPin Verified ✓</div>
                    <div style={{fontSize:"12px",color:"#9FE1CB"}}>Professional vinyl sticker · 3×3 inch</div>
                    <div style={{fontSize:"12px",color:"#9FE1CB"}}>Weather-resistant · QR code included</div>
                  </div>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                  {[
                    {label:"Your name",key:"name",placeholder:"John Smith",type:"text"},
                    {label:"Business name",key:"business",placeholder:"e.g. Main Street Café",type:"text"},
                    {label:"Business address",key:"address",placeholder:"123 Main St",type:"text"},
                    {label:"City",key:"city",placeholder:"Irvine",type:"text"},
                    {label:"ZIP code",key:"zip",placeholder:"92612",type:"text"},
                    {label:"Email address",key:"email",placeholder:"you@business.com",type:"email"},
                  ].map(field=>(
                    <div key={field.key}>
                      <label style={labelStyle}>{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={stickerForm[field.key as keyof typeof stickerForm]}
                        onChange={e=>setStickerForm(p=>({...p,[field.key]:e.target.value}))}
                        style={inputStyle}
                      />
                    </div>
                  ))}

                  <button
                    onClick={()=>{
                      if(stickerForm.name&&stickerForm.business&&stickerForm.address&&stickerForm.city&&stickerForm.email)
                        setStickerSent(true)
                    }}
                    style={{background:"#1D9E75",color:"white",border:"none",padding:"14px",borderRadius:"10px",fontSize:"15px",fontWeight:"700",cursor:"pointer"}}
                  >
                    Send me my free sticker 📬
                  </button>
                  <p style={{fontSize:"11px",color:"#aaa",margin:0,textAlign:"center"}}>Free for California businesses. No credit card. No subscription.</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CONTACT MODAL */}
      {showContact && (
        <div onClick={()=>{setShowContact(false);setSent(false)}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:"20px",padding:"28px 24px",width:"100%",maxWidth:"420px",maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px"}}>
              <h2 style={{margin:0,fontSize:"20px",fontWeight:"700",color:"#0A2E1F"}}>{sent?'✅ Message sent!':'List your business'}</h2>
              <button onClick={()=>{setShowContact(false);setSent(false)}} style={{background:"none",border:"none",fontSize:"24px",cursor:"pointer",color:"#999"}}>✕</button>
            </div>
            {sent ? (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:"48px",marginBottom:"16px"}}>🎉</div>
                <p style={{fontSize:"15px",color:"#555",lineHeight:"1.7"}}>Thank you! We'll reach out to <strong>{form.email}</strong> within 24 hours to get your business listed on FlushPin.</p>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                {[
                  {label:"Your name",key:"name",placeholder:"John Smith",type:"text"},
                  {label:"Business name",key:"business",placeholder:"e.g. Starbucks on Culver Dr",type:"text"},
                  {label:"Email address",key:"email",placeholder:"you@business.com",type:"email"},
                ].map(field=>(
                  <div key={field.key}>
                    <label style={labelStyle}>{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={e=>setForm(p=>({...p,[field.key]:e.target.value}))}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>Interested plan</label>
                  <select value={form.plan} onChange={e=>setForm(p=>({...p,plan:e.target.value}))} style={inputStyle}>
                    <option>Free</option><option>Silver</option><option>Gold</option><option>Platinum</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Message (optional)</label>
                  <textarea value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="Tell us about your business..." style={{...inputStyle,resize:"none",height:"80px"}}/>
                </div>
                <button onClick={()=>{if(form.name&&form.email&&form.business)setSent(true)}} style={{background:"#1D9E75",color:"white",border:"none",padding:"14px",borderRadius:"10px",fontSize:"15px",fontWeight:"700",cursor:"pointer"}}>
                  Send request →
                </button>
                <p style={{fontSize:"11px",color:"#aaa",margin:0,textAlign:"center"}}>We'll respond within 24 hours. No commitment required.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  )
}
