import Logo from '../../components/Logo'

export default function SafetyPage() {
  const h2 = {
    fontFamily: "'Space Grotesk','Inter',sans-serif",
    fontSize: '20px',
    fontWeight: '700' as const,
    color: '#0A2E1F',
    marginBottom: '12px',
  }
  const link = { color: '#1D9E75' }

  return (
    <main style={{ margin: 0, padding: 0, fontFamily: "'Inter',system-ui,sans-serif", background: '#fff', minHeight: '100vh' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #f0f0f0', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
        <Logo height={32} />
        <a href="/" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>← Back to home</a>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 'clamp(28px,5vw,40px)', fontWeight: '700', color: '#0A2E1F', marginBottom: '8px' }}>Safety Notice</h1>
        <p style={{ color: '#999', fontSize: '14px', marginBottom: '40px' }}>Last updated: June 12, 2026. Effective date: June 12, 2026.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', color: '#444', lineHeight: '1.8', fontSize: '15px' }}>

          <section>
            <h2 style={h2}>Not for emergencies</h2>
            <p>FlushPin is not a medical, emergency, or safety service. Do not rely on FlushPin in health emergencies, urgent medical situations, or situations where immediate assistance is required. If you have a medical emergency, contact local emergency services.</p>
          </section>

          <section>
            <h2 style={h2}>Community-reported information</h2>
            <p>Restroom access information on FlushPin may be submitted by community members, businesses, or data partners. Information may be inaccurate, outdated, incomplete, or unavailable. Labels such as &quot;verified&quot; or similar status indicators reflect platform review or reporting status — not a guarantee of accuracy, availability, cleanliness, safety, or ADA compliance.</p>
          </section>

          <section>
            <h2 style={h2}>Respect business policies</h2>
            <p>Restroom access is controlled by businesses. Always follow posted rules, staff directions, customer-only restrictions, and local law. Do not trespass, bypass security, or use access information in a way that violates business policies or applicable law.</p>
          </section>

          <section>
            <h2 style={h2}>Use access information responsibly</h2>
            <p>Only share restroom access details that are publicly available to customers or that you are authorized to share. Do not post private security credentials, employee-only codes, or information intended to bypass business controls.</p>
          </section>

          <section>
            <h2 style={h2}>Report problems</h2>
            <p>If you see incorrect, unsafe, abusive, or inappropriate information, report it through the app or contact us at <a href="mailto:admin@flushpin.com" style={link}>admin@flushpin.com</a>. Business owners may request corrections or opt out through our <a href="/optout" style={link}>business opt-out page</a>.</p>
          </section>

          <section>
            <h2 style={h2}>Your responsibility</h2>
            <p>You use FlushPin at your own risk. FlushPin does not guarantee that any listed restroom will be open, accessible, safe, or suitable for your needs. Use good judgment, especially in unfamiliar locations or urgent situations.</p>
          </section>

        </div>
      </div>

      <footer style={{ background: '#0A2E1F', padding: '28px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/privacy" style={{ color: '#5DCAA5', fontSize: '13px', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms" style={{ color: '#5DCAA5', fontSize: '13px', textDecoration: 'none' }}>Terms of Service</a>
          <a href="/safety" style={{ color: '#5DCAA5', fontSize: '13px', textDecoration: 'none' }}>Safety Notice</a>
          <a href="/contact" style={{ color: '#5DCAA5', fontSize: '13px', textDecoration: 'none' }}>Contact</a>
        </div>
        <p style={{ color: '#2D6A4F', fontSize: '11px', marginTop: '12px' }}>© 2026 FlushPin. All rights reserved.</p>
      </footer>
    </main>
  )
}
