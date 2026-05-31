'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

const ADMIN_EMAIL = '34johnertan@gmail.com'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

const BAD_WORDS = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'crap', 'piss', 'cock', 'dick',
  'pussy', 'cunt', 'bastard', 'whore', 'slut', 'nigga', 'nigger', 'negro',
  'faggot', 'retard', 'spic', 'chink', 'kike', 'wetback', 'beaner',
  'kill', 'rape', 'bomb', 'terrorist', 'hate',
  'sik', 'orospu', 'pic', 'got', 'amk', 'bok', 'yarrak', 'sikis'
]

function containsBadWord(text: string): { found: boolean; words: string[] } {
  if (!text) return { found: false, words: [] }
  const lower = text.toLowerCase()
  const found = BAD_WORDS.filter(w => lower.includes(w))
  return { found: found.length > 0, words: found }
}

type TabType = 'overview' | 'pins' | 'flagged' | 'optout' | 'logs'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalToday: 0, pending: 0, approved: 0, rejected: 0,
    optoutRequests: 0, flaggedCount: 0, totalRestrooms: 0,
  })
  const [recentPins, setRecentPins] = useState<any[]>([])
  const [flaggedItems, setFlaggedItems] = useState<any[]>([])
  const [optoutItems, setOptoutItems] = useState<any[]>([])
  const [adminLogs, setAdminLogs] = useState<any[]>([])
  const [cityStats, setCityStats] = useState<any[]>([])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.push('/')
        return
      }
      await loadAllData()
      setLoading(false)
    }
    checkAuth()
  }, [])

  const logAction = async (action: string, targetType: string, targetId: string) => {
    await supabase.from('admin_logs').insert({
      admin_email: ADMIN_EMAIL, action, target_type: targetType, target_id: targetId,
    })
  }

  const loadAllData = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: restrooms } = await supabase.from('restroom').select('*')
    const { data: optouts } = await supabase.from('optout_requests').select('*')
    const { data: flagged } = await supabase.from('flagged_content').select('*').eq('status', 'pending')

    const todayRestrooms = restrooms?.filter(r => new Date(r.created_at) >= today) || []

    const cityMap: Record<string, number> = {}
    restrooms?.forEach(r => {
      const city = r.city || 'Unknown'
      cityMap[city] = (cityMap[city] || 0) + 1
    })
    setCityStats(Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([city, count]) => ({ city, count })))

    setStats({
      totalToday: todayRestrooms.length,
      pending: restrooms?.filter(r => r.status === 'pending').length || 0,
      approved: restrooms?.filter(r => r.status === 'approved' || !r.status).length || 0,
      rejected: restrooms?.filter(r => r.status === 'rejected').length || 0,
      optoutRequests: optouts?.filter(o => o.status === 'pending').length || 0,
      flaggedCount: flagged?.length || 0,
      totalRestrooms: restrooms?.length || 0,
    })

    const recentWithFlags = (restrooms || [])
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 50)
      .map(r => {
        const pinCheck = containsBadWord(r.access_code || '')
        const nameCheck = containsBadWord(r.name || '')
        return { ...r, isFlagged: pinCheck.found || nameCheck.found, flagWords: [...pinCheck.words, ...nameCheck.words] }
      })
    setRecentPins(recentWithFlags)
    setFlaggedItems(flagged || [])
    setOptoutItems(optouts?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [])

    const { data: logs } = await supabase.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(50)
    setAdminLogs(logs || [])
  }

  const handleApprove = async (id: string) => {
    await supabase.from('restroom').update({ status: 'approved' }).eq('id', id)
    await logAction('approve', 'restroom', id)
    await loadAllData()
  }

  const handleReject = async (id: string) => {
    await supabase.from('restroom').update({ status: 'rejected' }).eq('id', id)
    await logAction('reject', 'restroom', id)
    await loadAllData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return
    await supabase.from('restroom').delete().eq('id', id)
    await logAction('delete', 'restroom', id)
    await loadAllData()
  }

  const handleOptoutResolve = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('optout_requests').update({ status }).eq('id', id)
    await logAction('optout_' + status, 'optout', id)
    await loadAllData()
  }

  const handleFlaggedReview = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('flagged_content').update({ status, reviewed_by: ADMIN_EMAIL, reviewed_at: new Date().toISOString() }).eq('id', id)
    await logAction('flagged_' + status, 'flagged_content', id)
    await loadAllData()
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a' }}>
        <div style={{ color: '#60a5fa', fontSize: '18px' }}>Loading Admin Panel...</div>
      </div>
    )
  }

  const tabs: { key: TabType; label: string; badge?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'pins', label: 'Pins' },
    { key: 'flagged', label: 'Flagged', badge: stats.flaggedCount },
    { key: 'optout', label: 'Opt-Out', badge: stats.optoutRequests },
    { key: 'logs', label: 'Logs' },
  ]

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1e293b', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', position: 'sticky', top: 0, zIndex: 100 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#60a5fa' }}>FlushPin Admin</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>John Ertan</div>
        </div>
        <button onClick={loadAllData} style={{ background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '13px' }}>Refresh</button>
      </div>

      <div style={{ display: 'flex', overflowX: 'auto', background: '#1e293b', borderBottom: '1px solid #334155' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '12px 16px', border: 'none', background: activeTab === tab.key ? '#0f172a' : 'transparent', color: activeTab === tab.key ? '#60a5fa' : '#64748b', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap', borderBottom: activeTab === tab.key ? '2px solid #60a5fa' : '2px solid transparent' }}>
            {tab.label}
            {tab.badge ? <span style={{ background: '#ef4444', color: 'white', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', marginLeft: '4px' }}>{tab.badge}</span> : null}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>

        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Total Restrooms', value: stats.totalRestrooms, color: '#60a5fa' },
                { label: 'Added Today', value: stats.totalToday, color: '#34d399' },
                { label: 'Opt-Out Requests', value: stats.optoutRequests, color: '#f59e0b' },
                { label: 'Flagged Content', value: stats.flaggedCount, color: '#ef4444' },
              ].map(s => (
                <div key={s.label} style={{ background: '#1e293b', borderRadius: '12px', padding: '16px', border: '1px solid #334155' }}>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '16px', border: '1px solid #334155' }}>
              <div style={{ fontWeight: 600, marginBottom: '12px', color: '#94a3b8' }}>Top Cities</div>
              {cityStats.map((c, i) => (
                <div key={c.city} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < cityStats.length - 1 ? '1px solid #334155' : 'none' }}>
                  <span style={{ color: '#e2e8f0' }}>{c.city}</span>
                  <span style={{ color: '#60a5fa', fontWeight: 600 }}>{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pins' && (
          <div>
            <div style={{ marginBottom: '12px', color: '#64748b', fontSize: '13px' }}>Son {recentPins.length} kayit</div>
            {recentPins.map(pin => (
              <div key={pin.id} style={{ background: pin.isFlagged ? '#2d1b1b' : '#1e293b', borderRadius: '12px', padding: '14px', marginBottom: '10px', border: '1px solid ' + (pin.isFlagged ? '#ef4444' : '#334155') }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: pin.isFlagged ? '#fca5a5' : '#e2e8f0', marginBottom: '6px' }}>
                  {pin.name || 'Unknown'}
                  {pin.isFlagged && <span style={{ marginLeft: '8px', fontSize: '11px', background: '#ef4444', color: 'white', borderRadius: '4px', padding: '1px 6px' }}>FLAGGED</span>}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{pin.city || '-'} - {pin.address || '-'}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>PIN: <span style={{ color: '#fbbf24', fontFamily: 'monospace' }}>{pin.access_code || '-'}</span></div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>{new Date(pin.created_at).toLocaleString()} - {pin.status || 'active'}</div>
                {pin.isFlagged && <div style={{ fontSize: '11px', color: '#ef4444', marginBottom: '8px' }}>Detected: {pin.flagWords.join(', ')}</div>}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleApprove(pin.id)} style={{ background: '#065f46', color: '#34d399', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>Approve</button>
                  <button onClick={() => handleReject(pin.id)} style={{ background: '#7c2d12', color: '#fb923c', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>Reject</button>
                  <button onClick={() => handleDelete(pin.id)} style={{ background: '#1e1b4b', color: '#a5b4fc', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'flagged' && (
          <div>
            {flaggedItems.length === 0
              ? <div style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No flagged content</div>
              : flaggedItems.map(item => (
                <div key={item.id} style={{ background: '#2d1b1b', borderRadius: '12px', padding: '14px', marginBottom: '10px', border: '1px solid #ef4444' }}>
                  <div style={{ fontWeight: 600, color: '#fca5a5', marginBottom: '6px' }}>{item.content_type} - {item.flag_reason}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>{item.content_text}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>{new Date(item.created_at).toLocaleString()}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleFlaggedReview(item.id, 'approved')} style={{ background: '#065f46', color: '#34d399', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>Allow</button>
                    <button onClick={() => handleFlaggedReview(item.id, 'rejected')} style={{ background: '#7c2d12', color: '#fb923c', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === 'optout' && (
          <div>
            {optoutItems.length === 0
              ? <div style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No opt-out requests</div>
              : optoutItems.map(item => (
                <div key={item.id} style={{ background: '#1e293b', borderRadius: '12px', padding: '14px', marginBottom: '10px', border: '1px solid ' + (item.status === 'pending' ? '#f59e0b' : '#334155') }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{item.business_name || 'Unknown'}</div>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: item.status === 'pending' ? '#451a03' : '#052e16', color: item.status === 'pending' ? '#fbbf24' : '#34d399' }}>{item.status}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{item.city || '-'}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{item.reason || item.request_type || '-'}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>{item.contact_email || '-'} - {new Date(item.created_at).toLocaleDateString()}</div>
                  {item.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleOptoutResolve(item.id, 'approved')} style={{ background: '#065f46', color: '#34d399', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>Approve</button>
                      <button onClick={() => handleOptoutResolve(item.id, 'rejected')} style={{ background: '#7c2d12', color: '#fb923c', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>Reject</button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            {adminLogs.length === 0
              ? <div style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No logs yet</div>
              : adminLogs.map(log => (
                <div key={log.id} style={{ background: '#1e293b', borderRadius: '8px', padding: '12px', marginBottom: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ color: '#60a5fa', fontWeight: 600, fontSize: '13px' }}>{log.action}</span>
                      <span style={{ color: '#64748b', fontSize: '12px', marginLeft: '8px' }}>{log.target_type}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{new Date(log.created_at).toLocaleString()}</div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
