import Logo from '../../components/Logo'

export default function PrivacyPage() {
  const h2 = {
    fontFamily: "'Space Grotesk','Inter',sans-serif",
    fontSize: "20px",
    fontWeight: "700" as const,
    color: "#0A2E1F",
    marginBottom: "12px",
  };
  const h3 = {
    fontFamily: "'Space Grotesk','Inter',sans-serif",
    fontSize: "16px",
    fontWeight: "700" as const,
    color: "#0A2E1F",
    marginTop: "16px",
    marginBottom: "8px",
  };
  const link = { color: "#1D9E75" };

  return (
    <main style={{ margin: 0, padding: 0, fontFamily: "'Inter',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #f0f0f0", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20 }}>
        <Logo height={32} />
        <a href="/" style={{ color: "#555", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>← Back to home</a>
      </nav>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: "clamp(28px,5vw,40px)", fontWeight: "700", color: "#0A2E1F", marginBottom: "8px" }}>Privacy Policy</h1>
        <p style={{ color: "#999", fontSize: "14px", marginBottom: "40px" }}>Last updated: June 11, 2026. Effective date: June 11, 2026.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px", color: "#444", lineHeight: "1.8", fontSize: "15px" }}>

          <section>
            <h2 style={h2}>1. Who we are</h2>
            <p>FlushPin (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website at www.flushpin.com and the FlushPin mobile app. FlushPin is a community platform that helps users find restroom access information at nearby businesses. We are based in Orange County, California, United States.</p>
            <p style={{ marginTop: "8px" }}>Contact: <a href="mailto:admin@flushpin.com" style={link}>admin@flushpin.com</a></p>
          </section>

          <section>
            <h2 style={h2}>2. Information we collect</h2>
            <h3 style={h3}>Information you provide:</h3>
            <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>Email address and name when you create an account</li>
              <li>Restroom access codes, ratings, corrections, and feedback you submit</li>
              <li>PIN submissions and access type reports</li>
              <li>Business name, contact name, email address, phone number, and other information if you submit a business claim, correction, or removal request</li>
              <li>Messages or reports you send to us, including safety reports, outdated information reports, or abuse reports</li>
            </ul>
            <h3 style={h3}>Information collected automatically:</h3>
            <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>Approximate or current device location when you grant permission, to show nearby restroom listings and calculate distance. We do not store your precise GPS coordinates.</li>
              <li>Restroom searches and app interactions</li>
              <li>Access code view logs, including user account, restroom listing, and timestamp, for abuse prevention, business opt-out enforcement, platform safety, and data quality</li>
              <li>PIN submissions, feedback, and report history</li>
              <li>Device type, browser, operating system, and app environment</li>
              <li>IP address, access timestamps, and limited technical information for security and fraud prevention</li>
              <li>Moderation, audit, and abuse prevention logs</li>
            </ul>
            <h3 style={h3}>Information from third parties:</h3>
            <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>If you sign in with Google or Apple, we may receive your name, email address, and authentication identifier from those providers</li>
            </ul>
          </section>

          <section>
            <h2 style={h2}>3. How we use your information</h2>
            <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>To create, authenticate, and manage your account</li>
              <li>To show you restroom listings near your location</li>
              <li>To calculate distance to nearby restroom listings</li>
              <li>To display, review, and improve community-submitted restroom access information</li>
              <li>To log and attribute access code views, submissions, confirmations, and reports</li>
              <li>To process business claim, correction, opt-out, or removal requests</li>
              <li>To detect and prevent fraud, spam, false submissions, misuse, scraping, or platform abuse</li>
              <li>To enforce our <a href="/terms" style={link}>Terms of Service</a> and <a href="/safety" style={link}>Safety Notice</a></li>
              <li>To send you account-related emails, including confirmation, password reset, security, or service notices</li>
              <li>To comply with legal obligations and respond to lawful requests</li>
            </ul>
            <p style={{ marginTop: "16px" }}>We do not sell your personal information. We do not share your personal information for cross-context behavioral advertising. We do not use your personal information for third-party advertising.</p>
          </section>

          <section>
            <h2 style={h2}>4. Community content license</h2>
            <p>By submitting restroom access codes, ratings, corrections, feedback, or any other content to FlushPin, you grant FlushPin a non-exclusive, worldwide, royalty-free, perpetual license to use, display, store, reproduce, modify, and distribute that content solely for the purpose of operating, improving, and providing the FlushPin service. You retain ownership of your submissions. We will not sell your individually attributed submissions to third parties.</p>
          </section>

          <section>
            <h2 style={h2}>5. Data sharing</h2>
            <p style={{ marginBottom: "8px" }}>We share information only as necessary to operate and protect FlushPin:</p>
            <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Supabase</strong> — authentication, database, and backend services</li>
              <li><strong>Vercel</strong> — website hosting provider</li>
              <li><strong>Google / Apple</strong> — only if you choose to sign in with those providers</li>
              <li><strong>Form service providers</strong> — if you submit a contact form, business claim, correction request, or removal request through a third-party form service</li>
              <li><strong>Law enforcement, courts, or legal authorities</strong> — if required by applicable law, subpoena, court order, or to protect rights, safety, and security</li>
            </ul>
            <p style={{ marginTop: "16px" }}>We do not currently use third-party analytics providers. If this changes, we will update this policy before any data is shared. We do not allow service providers to use your personal information for their own advertising purposes.</p>
          </section>

          <section>
            <h2 style={h2}>6. Business claim and removal data</h2>
            <p>If you submit a business claim, correction, opt-out, or removal request, we may use your contact information to verify your relationship to the business, respond to the request, maintain claim records, prevent fraudulent claims, enforce business opt-out requests, and protect the integrity of the platform. Business claim records may be retained as needed to document requests, prevent repeated misuse, and enforce listing restrictions.</p>
          </section>

          <section>
            <h2 style={h2}>7. Location data</h2>
            <p>FlushPin requests access to your device location only to show nearby restroom listings and calculate distances. Location access is optional. You can disable location access through your device settings at any time.</p>
            <p style={{ marginTop: "8px" }}>We do not store your precise GPS coordinates. If you do not grant location permission, FlushPin may still show general restroom listings, but nearby sorting and distance accuracy may be limited.</p>
          </section>

          <section>
            <h2 style={h2}>8. Access code views and community submissions</h2>
            <p>FlushPin logs when an authenticated user views an access code. These logs include the user account, restroom listing, timestamp, and limited technical information. We use these logs for abuse prevention, business opt-out enforcement, safety investigations, moderation, and data quality improvement.</p>
            <p style={{ marginTop: "8px" }}>Community-submitted restroom information may be reviewed, accepted, rejected, edited, hidden, or removed for safety, accuracy, business-owner request, legal, or platform integrity reasons.</p>
          </section>

          <section>
            <h2 style={h2}>9. Data retention and deletion</h2>
            <p>We retain your account information for as long as your account is active or as needed to provide the Service and comply with legal obligations.</p>
            <p style={{ marginTop: "8px" }}>You may request deletion of your account and associated personal information by contacting us at <a href="mailto:admin@flushpin.com" style={link}>admin@flushpin.com</a>. We will process deletion requests within 30 days unless a longer period is required by law.</p>
            <p style={{ marginTop: "8px" }}>Community-submitted restroom information may remain on the platform in de-identified, aggregated, or non-account-linked form after account deletion, unless removal is required by law or approved through our moderation process.</p>
            <p style={{ marginTop: "8px" }}>Abuse prevention and moderation logs may be retained for up to 12 months for platform safety purposes.</p>
          </section>

          <section>
            <h2 style={h2}>10. Data breach notification</h2>
            <p>In the event of a data breach that affects your personal information, we will notify affected users within 72 hours of becoming aware of the breach, to the extent required by applicable California law. Notification will be sent to the email address associated with your account.</p>
            <p style={{ marginTop: "8px" }}>If you believe your account has been compromised, contact us immediately at <a href="mailto:admin@flushpin.com" style={link}>admin@flushpin.com</a>.</p>
          </section>

          <section>
            <h2 style={h2}>11. California privacy rights</h2>
            <p style={{ marginBottom: "8px" }}>If you are a California resident, you have the following rights under California law:</p>
            <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Right to know/access</strong> — request information about the personal information we collect, use, disclose, and retain</li>
              <li><strong>Right to delete</strong> — request deletion of your personal information, subject to legal exceptions</li>
              <li><strong>Right to correct</strong> — request correction of inaccurate personal information</li>
              <li><strong>Right to opt out of sale or sharing</strong> — we do not sell personal information and do not share for cross-context behavioral advertising</li>
              <li><strong>Right to limit use of sensitive personal information</strong> — where applicable, you may request limits on certain uses of sensitive personal information</li>
              <li><strong>Right to non-discrimination</strong> — we will not discriminate against you for exercising your privacy rights</li>
            </ul>
            <p style={{ marginTop: "16px" }}>To exercise these rights, you or an authorized agent may email us at <a href="mailto:admin@flushpin.com" style={link}>admin@flushpin.com</a>. We will respond within 45 days as required by applicable law.</p>
          </section>

          <section>
            <h2 style={h2}>12. Security</h2>
            <p>We use reasonable administrative, technical, and organizational safeguards designed to protect personal information, including encrypted connections, secure authentication, access controls, and database security rules.</p>
            <p style={{ marginTop: "8px" }}>No online service can guarantee absolute security. Real PIN codes and access codes are only accessible through authenticated, controlled access flows and are not exposed in public API responses.</p>
          </section>

          <section>
            <h2 style={h2}>13. Dispute resolution</h2>
            <p>This Privacy Policy is governed by the laws of the State of California, without regard to conflict of law principles. Any dispute arising from this policy or your use of FlushPin shall be resolved exclusively in the state or federal courts located in Orange County, California. By using FlushPin, you consent to the personal jurisdiction of these courts.</p>
          </section>

          <section>
            <h2 style={h2}>14. Children</h2>
            <p>FlushPin is not directed to children under 13. Users under 13 may not create accounts, submit information, or use interactive features of the Service. We do not knowingly collect personal information from children under 13. If we learn that we have collected such information, we may delete the account and associated information.</p>
            <p style={{ marginTop: "8px" }}>If you believe a child under 13 has created an account, please contact us at <a href="mailto:admin@flushpin.com" style={link}>admin@flushpin.com</a>.</p>
          </section>

          <section>
            <h2 style={h2}>15. Third-party links and services</h2>
            <p>FlushPin may contain links to third-party websites, businesses, maps, or external services. We are not responsible for the privacy practices or content of third-party services. Your use of third-party services is governed by their own terms and privacy policies.</p>
          </section>

          <section>
            <h2 style={h2}>16. Changes to this policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify users of material changes by posting a notice on our website with an updated effective date. Continued use of FlushPin after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 style={h2}>17. Contact us</h2>
            <p><strong>FlushPin</strong><br />Orange County, California, USA<br />Email: <a href="mailto:admin@flushpin.com" style={link}>admin@flushpin.com</a></p>
          </section>

        </div>
      </div>

      <footer style={{ background: "#0A2E1F", padding: "28px 20px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/privacy" style={{ color: "#5DCAA5", fontSize: "13px", textDecoration: "none" }}>Privacy Policy</a>
          <a href="/terms" style={{ color: "#5DCAA5", fontSize: "13px", textDecoration: "none" }}>Terms of Service</a>
          <a href="/safety" style={{ color: "#5DCAA5", fontSize: "13px", textDecoration: "none" }}>Safety Notice</a>
          <a href="/contact" style={{ color: "#5DCAA5", fontSize: "13px", textDecoration: "none" }}>Contact</a>
        </div>
        <p style={{ color: "#2D6A4F", fontSize: "11px", marginTop: "12px" }}>© 2026 FlushPin. All rights reserved.</p>
      </footer>
    </main>
  );
}
