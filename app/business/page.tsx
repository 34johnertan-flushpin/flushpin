'use client'
import { useState } from 'react'

const FORMSPREE_ID = 'maqkrnep'

const Logo = () => (
  <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <div style={{ width: '34px', height: '34px', background: '#1D9E75', borderRadius: '9px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', flexShrink: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px', width: '18px' }}>
        {[1, 1, 1, 1, 1, 1, 0, 1, 0].map((v, i) => (
          <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: v ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)' }} />
        ))}
      </div>
      <div style={{ width: 0, height: 0, borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderTop: '5px solid #1D9E75', marginTop: '-1px' }} />
    </div>
    <span style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: '18px', fontWeight: '700', color: '#0A2E1F' }}>
      Flush<span style={{ color: '#1D9E75' }}>Pin</span>
    </span>
  </a>
)

const valueProps = [
  {
    icon: '📊',
    title: 'Foot Traffic Intelligence',
    desc: 'Understand restroom demand, peak times, customer behavior signals, and location trends — so you know when opportunity is walking through your door.',
  },
  {
    icon: '🔄',
    title: 'Customer Recovery',
    desc: 'Someone came for the restroom. Give them a reason to stay, buy, or return — before they walk away to a competitor.',
  },
  {
    icon: '✨',
    title: 'Restroom Experience Management',
    desc: 'Improve restroom experience, reduce complaints, keep information accurate, and build trust with every visit.',
  },
]

const businessFeatures = [
  'Verified restroom information',
  'Restroom access management',
  'Incorrect info priority fixes',
  'Monthly restroom intelligence reports',
  'Promo visibility before restroom access',
  'Demand trends & peak restroom hours',
  'Trust / reliability score',
]

const proFeatures = [
  'Everything in Business',
  'Multi-location dashboard',
  'Regional comparison',
  'Chain analytics',
  'Benchmarking across locations',
  'Corporate reporting exports',
  'Dedicated account support',
]

const insightRows = [
  { label: 'Restroom demand signals', value: 'Trending up', note: 'vs. prior 30 days' },
  { label: 'Peak restroom hours', value: '11am – 2pm', note: 'weekday pattern' },
  { label: 'Access interest', value: 'High intent', note: 'people searched or viewed restroom access' },
  { label: 'Estimated engagement', value: 'Promo opportunity', note: 'before restroom access' },
]

const faqs = [
  {
    q: 'What kind of data does FlushPin provide?',
    a: 'FlushPin surfaces restroom demand signals, access interest, peak hour patterns, and estimated engagement — helping you understand when people are looking for your restroom and where customer opportunity exists.',
  },
  {
    q: 'How does customer recovery work?',
    a: 'When someone visits for restroom access, FlushPin gives you a moment to present a relevant offer, message, or reason to stay — turning restroom intent traffic into a customer opportunity.',
  },
  {
    q: 'Do you track exact visit counts or guaranteed conversions?',
    a: 'No. We report restroom demand, intent traffic, and estimated engagement — not hard conversion guarantees. Our language reflects what we can responsibly measure.',
  },
  {
    q: 'Can I manage multiple locations?',
    a: 'Yes. Business Pro includes a multi-location dashboard with regional comparison, chain analytics, benchmarking, and corporate reporting.',
  },
  {
    q: 'What if my restroom information is wrong on the map?',
    a: 'Business subscribers get priority fixes for incorrect listings. Keeping restroom info accurate protects trust and reduces customer frustration.',
  },
  {
    q: 'Is there a contract?',
    a: 'No long-term contracts. Plans are billed monthly per location. Cancel anytime.',
  },
]

export default function BusinessPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showDemo, setShowDemo] = useState(false)
  const [form, setForm] = useState({ name: '', business: '', email: '', locations: '1', plan: 'Business', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '9px', border: '1px solid #e0e0e0',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const, color: '#1a1a1a',
    fontFamily: "'Inter',system-ui,sans-serif",
  }
  const labelStyle = { fontSize: '12px', fontWeight: '600' as const, color: '#444', marginBottom: '6px', display: 'block' as const }

  const scrollToInsights = () => {
    document.getElementById('insights-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDemoSubmit = async () => {
    if (!form.name || !form.email || !form.business) return
    setSending(true)
    try {
      await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: `FlushPin Business Demo Request — ${form.business}`,
          type: 'Business Demo Request',
          name: form.name,
          business: form.business,
          email: form.email,
          locations: form.locations,
          plan: form.plan,
          message: form.message || '—',
        }),
      })
      setSent(true)
    } catch {
      alert('Something went wrong. Please try again.')
    }
    setSending(false)
  }

  const sectionTitle = {
    fontFamily: "'Space Grotesk','Inter',sans-serif",
    fontSize: 'clamp(22px,4vw,32px)',
    fontWeight: '700' as const,
    color: '#0A2E1F',
    marginBottom: '10px',
    textAlign: 'center' as const,
  }

  return (
    <main style={{ margin: 0, padding: 0, fontFamily: "'Inter',system-ui,sans-serif", background: '#fff', minHeight: '100vh' }}>

      <nav style={{ background: 'white', borderBottom: '1px solid #f0f0f0', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
        <Logo />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href="/map" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Find a Restroom</a>
          <button onClick={() => setShowDemo(true)} style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '9px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Book a Demo
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '72px 24px 64px', background: 'linear-gradient(180deg,#f0faf6 0%,#fff 100%)' }}>
        <div style={{ display: 'inline-block', background: '#E1F5EE', color: '#0F6E56', fontSize: '13px', padding: '6px 18px', borderRadius: '20px', marginBottom: '24px', fontWeight: '600' }}>
          Restroom Intelligence + Customer Recovery
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 'clamp(28px,6vw,48px)', fontWeight: '700', color: '#0A2E1F', lineHeight: '1.15', marginBottom: '20px', letterSpacing: '-1px', maxWidth: '720px', margin: '0 auto 20px' }}>
          Turn restroom traffic into customer opportunity
        </h1>
        <p style={{ fontSize: 'clamp(15px,3vw,18px)', color: '#666', maxWidth: '560px', margin: '0 auto 36px', lineHeight: '1.7' }}>
          Understand restroom demand, recover missed customers, and improve customer experience before people walk away.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setShowDemo(true)} style={{ background: '#1D9E75', color: 'white', padding: '14px 32px', borderRadius: '11px', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
            Book a Demo →
          </button>
          <button onClick={scrollToInsights} style={{ background: 'white', color: '#0A2E1F', padding: '14px 32px', borderRadius: '11px', fontSize: '16px', border: '1.5px solid #e0e0e0', fontWeight: '600', cursor: 'pointer' }}>
            See Business Insights
          </button>
        </div>
      </section>

      {/* Value props */}
      <section style={{ padding: '0 24px 72px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '20px' }}>
          {valueProps.map((v, i) => (
            <div key={i} style={{ background: '#f8f8f8', borderRadius: '16px', padding: '28px 24px', border: '1px solid #eee' }}>
              <div style={{ fontSize: '28px', marginBottom: '14px' }}>{v.icon}</div>
              <div style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: '18px', fontWeight: '700', color: '#0A2E1F', marginBottom: '10px' }}>{v.title}</div>
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.7' }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Positioning */}
      <section style={{ padding: '0 24px 72px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ background: '#0A2E1F', borderRadius: '20px', padding: '40px 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 'clamp(20px,4vw,28px)', fontWeight: '700', color: 'white', marginBottom: '16px', lineHeight: '1.3' }}>
            Map is a commodity.<br />
            <span style={{ color: '#5DCAA5' }}>FlushPin data is the product.</span>
          </p>
          <p style={{ fontSize: '15px', color: '#9FE1CB', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto' }}>
            We don&apos;t sell restroom codes or bathroom passwords. We help businesses understand restroom demand, recover customers, and turn restroom visitors into real opportunity.
          </p>
        </div>
      </section>

      {/* Insights preview */}
      <section id="insights-section" style={{ padding: '0 24px 72px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={sectionTitle}>Restroom intelligence, not guesswork</h2>
        <p style={{ textAlign: 'center', color: '#999', marginBottom: '36px', fontSize: '15px', maxWidth: '520px', margin: '0 auto 36px', lineHeight: '1.6' }}>
          Monthly reports built on restroom demand signals and access interest — responsibly worded, actionable for your team.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '24px', alignItems: 'start' }}>
          <div style={{ background: '#f8f8f8', borderRadius: '16px', padding: '28px', border: '1px solid #eee' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#1D9E75', letterSpacing: '0.5px', marginBottom: '16px', textTransform: 'uppercase' }}>Sample intelligence snapshot</div>
            {insightRows.map((row, i) => (
              <div key={i} style={{ padding: '14px 0', borderBottom: i < insightRows.length - 1 ? '1px solid #eee' : 'none' }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>{row.label}</div>
                <div style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: '18px', fontWeight: '700', color: '#0A2E1F' }}>{row.value}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{row.note}</div>
              </div>
            ))}
            <p style={{ fontSize: '11px', color: '#aaa', marginTop: '16px', lineHeight: '1.5', fontStyle: 'italic' }}>
              Illustrative example. Actual reports reflect your location&apos;s restroom demand trends and access interest.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { title: 'Demand trends', desc: 'See when restroom intent traffic rises and falls — weekdays, weekends, seasons.' },
              { title: 'Customer opportunity', desc: 'Identify moments to present offers, loyalty prompts, or reasons to stay before access.' },
              { title: 'Trust & reliability', desc: 'Keep restroom information accurate and your reliability score strong across FlushPin.' },
              { title: 'Promo visibility', desc: 'Reach people at the right moment — when restroom demand is highest at your location.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '20px 22px', border: '1px solid #eee' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2E1F', marginBottom: '6px' }}>{item.title}</div>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '0 24px 72px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={sectionTitle}>Plans built for business owners</h2>
        <p style={{ textAlign: 'center', color: '#999', marginBottom: '36px', fontSize: '15px' }}>Per location · No long-term contracts · Cancel anytime</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px', alignItems: 'start' }}>
          <div style={{ background: '#E1F5EE', borderRadius: '20px', padding: '32px 28px', border: '2px solid #1D9E75', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#1D9E75', color: 'white', fontSize: '11px', fontWeight: '700', padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
              Sweet spot
            </div>
            <div style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: '22px', fontWeight: '700', color: '#0A2E1F', marginBottom: '8px' }}>Business</div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: '40px', fontWeight: '700', color: '#0A2E1F' }}>$49</span>
              <span style={{ fontSize: '15px', color: '#0F6E56' }}>/location/mo</span>
            </div>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '24px' }}>
              For single-location owners who want restroom intelligence and customer recovery tools.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {businessFeatures.map((f, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#1D9E75', fontWeight: '700', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '14px', color: '#444', lineHeight: '1.5' }}>{f}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setForm(p => ({ ...p, plan: 'Business' })); setShowDemo(true) }} style={{ width: '100%', background: '#1D9E75', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
              Book a Demo
            </button>
          </div>

          <div style={{ background: '#0A2E1F', borderRadius: '20px', padding: '32px 28px', border: '2px solid transparent' }}>
            <div style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>Business Pro</div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: '40px', fontWeight: '700', color: 'white' }}>$149</span>
              <span style={{ fontSize: '15px', color: '#9FE1CB' }}>/location/mo</span>
            </div>
            <p style={{ fontSize: '14px', color: '#9FE1CB', lineHeight: '1.6', marginBottom: '24px' }}>
              For chains and multi-location operators who need regional and corporate-level analytics.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {proFeatures.map((f, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#5DCAA5', fontWeight: '700', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '14px', color: '#9FE1CB', lineHeight: '1.5' }}>{f}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setForm(p => ({ ...p, plan: 'Business Pro' })); setShowDemo(true) }} style={{ width: '100%', background: '#1D9E75', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      {/* Goal statement */}
      <section style={{ padding: '0 24px 72px', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: '#f8f8f8', borderRadius: '18px', padding: '36px 28px', border: '1px solid #eee' }}>
          <p style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 'clamp(17px,3vw,22px)', color: '#0A2E1F', fontWeight: '600', lineHeight: '1.6', margin: 0 }}>
            &ldquo;FlushPin helps me turn restroom visitors into customers and gives me useful traffic intelligence.&rdquo;
          </p>
          <p style={{ fontSize: '13px', color: '#999', marginTop: '16px' }}>The outcome every smart business owner should instantly understand.</p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 24px 72px', maxWidth: '680px', margin: '0 auto' }}>
        <h2 style={{ ...sectionTitle, marginBottom: '32px' }}>Frequently asked questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: '#f8f8f8', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0A2E1F' }}>{faq.q}</span>
                <span style={{ fontSize: '20px', color: '#1D9E75', fontWeight: '700', flexShrink: 0, marginLeft: '12px' }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 16px' }}>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7', margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '0 24px 80px', maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg,#0A2E1F 0%,#1a4a32 100%)', borderRadius: '20px', padding: '48px 28px' }}>
          <h2 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 'clamp(22px,4vw,30px)', fontWeight: '700', color: 'white', marginBottom: '14px' }}>
            Ready to turn restroom traffic into opportunity?
          </h2>
          <p style={{ color: '#9FE1CB', fontSize: '15px', marginBottom: '28px', lineHeight: '1.6' }}>
            See how FlushPin intelligence works for your location — book a demo with our team.
          </p>
          <button onClick={() => setShowDemo(true)} style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '15px 36px', borderRadius: '11px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
            Book a Demo →
          </button>
        </div>
      </section>

      <footer style={{ background: '#0A2E1F', padding: '28px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/privacy" style={{ color: '#5DCAA5', fontSize: '13px', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms" style={{ color: '#5DCAA5', fontSize: '13px', textDecoration: 'none' }}>Terms of Service</a>
          <a href="/contact" style={{ color: '#5DCAA5', fontSize: '13px', textDecoration: 'none' }}>Contact</a>
        </div>
        <p style={{ color: '#2D6A4F', fontSize: '11px', marginTop: '12px' }}>© 2026 FlushPin. All rights reserved.</p>
      </footer>

      {/* Demo modal */}
      {showDemo && (
        <div onClick={() => { setShowDemo(false); setSent(false) }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '28px 24px', width: '100%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#0A2E1F', fontFamily: "'Space Grotesk','Inter',sans-serif" }}>
                {sent ? '✅ Request received!' : 'Book a Demo'}
              </h2>
              <button onClick={() => { setShowDemo(false); setSent(false) }} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}>✕</button>
            </div>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.7' }}>
                  Thanks! We&apos;ll reach out to <strong>{form.email}</strong> within 24 hours to schedule your demo.
                </p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '13px', color: '#999', marginBottom: '22px' }}>
                  Tell us about your business and we&apos;ll show you how FlushPin intelligence works.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { label: 'Your name', key: 'name', placeholder: 'Jane Smith', type: 'text' },
                    { label: 'Business name', key: 'business', placeholder: 'e.g. Main Street Café', type: 'text' },
                    { label: 'Email address', key: 'email', placeholder: 'you@business.com', type: 'email' },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={labelStyle}>{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.key as keyof typeof form]}
                        onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>Number of locations</label>
                    <select value={form.locations} onChange={e => setForm(p => ({ ...p, locations: e.target.value }))} style={inputStyle}>
                      <option value="1">1 location</option>
                      <option value="2-5">2–5 locations</option>
                      <option value="6-20">6–20 locations</option>
                      <option value="20+">20+ locations</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Interested plan</label>
                    <select value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))} style={inputStyle}>
                      <option>Business</option>
                      <option>Business Pro</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Message (optional)</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="What would you like to learn about?"
                      style={{ ...inputStyle, resize: 'none', height: '80px' }}
                    />
                  </div>
                  <button onClick={handleDemoSubmit} disabled={sending} style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', opacity: sending ? 0.7 : 1 }}>
                    {sending ? 'Sending...' : 'Request demo →'}
                  </button>
                  <p style={{ fontSize: '11px', color: '#aaa', margin: 0, textAlign: 'center' }}>No commitment required. We respond within 24 hours.</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </main>
  )
}
