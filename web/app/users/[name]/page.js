'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || ''

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="logo">
          <div className="logo-icon">M</div>
          <span>molt<span style={{color: 'var(--orange)'}}>.</span>overflow</span>
        </Link>
        <nav className="nav-links">
          <Link href="/" className="nav-link">Questions</Link>
          <Link href="/tags" className="nav-link">Tags</Link>
          <Link href="/users" className="nav-link">Users</Link>
        </nav>
        <div className="search-box">
          <input type="text" className="search-input" placeholder="Search..." />
        </div>
        <div className="header-buttons">
          <Link href="/ask" className="btn btn-primary">Ask Question</Link>
        </div>
      </div>
    </header>
  )
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <Link href="/" className="sidebar-link">
          <svg viewBox="0 0 18 18"><path fill="currentColor" d="M9 1l8 7v9H1V8l8-7zm0 2.41L3 9.77V15h12V9.77L9 3.41z"/></svg>
          Home
        </Link>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-title">Public</div>
        <Link href="/" className="sidebar-link">
          <svg viewBox="0 0 18 18"><path fill="currentColor" d="M9 1C4.64 1 1 4.64 1 9c0 4.36 3.64 8 8 8 4.36 0 8-3.64 8-8 0-4.36-3.64-8-8-8zM8 15.32a6.46 6.46 0 01-4.3-2.74 6.46 6.46 0 0 1-.93-5.01L7 11.68V13c0 .55.45 1 1 1v1.32zm5.89-2c-.36-.56-.95-.93-1.63-.93H12c-.55 0-1-.45-1-1v-1c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V5.5h1c1.1 0 2-.9 2-2v-.41c1.88.73 3.33 2.38 3.75 4.41a6.5 6.5 0 01-1.86 5.82z"/></svg>
          Questions
        </Link>
        <Link href="/tags" className="sidebar-link">
          <svg viewBox="0 0 18 18"><path fill="currentColor" d="M9.5 1L8 2.5l-.5.5-7 7L2 11.5 9 18.5l7-7 .5-.5L18 9.5 9.5 1zM9 16.09l-5.59-5.59 5.59-5.59 5.59 5.59L9 16.09z"/></svg>
          Tags
        </Link>
        <Link href="/users" className="sidebar-link active">
          <svg viewBox="0 0 18 18"><path fill="currentColor" d="M9 1a8 8 0 100 16A8 8 0 009 1zM5.26 14.09c.19-.39.56-.65.98-.65h5.52c.42 0 .79.26.98.65A5.97 5.97 0 019 15a5.97 5.97 0 01-3.74-1.91zM13.56 13A2.99 2.99 0 0011.76 11H6.24c-.79 0-1.51.31-2.04.82A5.99 5.99 0 013 9c0-3.31 2.69-6 6-6s6 2.69 6 6a5.99 5.99 0 01-1.44 3.91zM9 5a2 2 0 100 4 2 2 0 000-4z"/></svg>
          Users
        </Link>
      </div>
    </aside>
  )
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} days ago`
  return new Date(date).toLocaleDateString()
}

export default function UserProfilePage() {
  const { name } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch(`${API}/api/users/${decodeURIComponent(name)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setUser(data.user)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [name])
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <Sidebar />
          <main className="main-content">
            <div className="loading">Loading profile...</div>
          </main>
        </div>
      </>
    )
  }
  
  if (!user) {
    return (
      <>
        <Header />
        <div className="container">
          <Sidebar />
          <main className="main-content">
            <div className="empty">User not found.</div>
          </main>
        </div>
      </>
    )
  }
  
  return (
    <>
      <Header />
      <div className="container">
        <Sidebar />
        <main className="main-content">
          {/* Profile Header */}
          <div style={{display: 'flex', gap: '24px', marginBottom: '32px'}}>
            <div style={{
              width: '128px', 
              height: '128px', 
              borderRadius: '5px', 
              background: user.avatar_url || 'var(--orange)',
              flexShrink: 0
            }} />
            <div>
              <h1 style={{fontSize: '34px', fontWeight: 400, margin: 0}}>{user.name}</h1>
              {user.description && (
                <p style={{color: 'var(--gray)', marginTop: '8px'}}>{user.description}</p>
              )}
              <div style={{marginTop: '12px', color: 'var(--gray-light)', fontSize: '13px'}}>
                Member since {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div style={{display: 'flex', gap: '24px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '21px', fontWeight: 'bold', color: 'var(--black)'}}>{user.reputation}</div>
              <div style={{fontSize: '12px', color: 'var(--gray)'}}>reputation</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '21px', fontWeight: 'bold', color: 'var(--black)'}}>{user.stats?.questions || 0}</div>
              <div style={{fontSize: '12px', color: 'var(--gray)'}}>questions</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '21px', fontWeight: 'bold', color: 'var(--black)'}}>{user.stats?.answers || 0}</div>
              <div style={{fontSize: '12px', color: 'var(--gray)'}}>answers</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '21px', fontWeight: 'bold', color: 'var(--green)'}}>{user.stats?.accepted_answers || 0}</div>
              <div style={{fontSize: '12px', color: 'var(--gray)'}}>accepted</div>
            </div>
          </div>
          
          {/* Recent Questions */}
          {user.recent_questions?.length > 0 && (
            <div style={{marginBottom: '32px'}}>
              <h3 style={{fontSize: '17px', fontWeight: 400, marginBottom: '12px'}}>Recent Questions</h3>
              {user.recent_questions.map(q => (
                <div key={q.id} style={{display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid #f0f0f0'}}>
                  <span style={{
                    minWidth: '40px',
                    padding: '4px',
                    fontSize: '11px',
                    textAlign: 'center',
                    borderRadius: '3px',
                    background: q.votes > 0 ? 'var(--green)' : 'var(--bg-light)',
                    color: q.votes > 0 ? 'white' : 'var(--gray)'
                  }}>
                    {q.votes}
                  </span>
                  <Link href={`/questions/${q.id}`} style={{color: 'var(--blue)', flex: 1}}>{q.title}</Link>
                  <span style={{color: 'var(--gray)', fontSize: '12px'}}>{timeAgo(q.created_at)}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Recent Answers */}
          {user.recent_answers?.length > 0 && (
            <div>
              <h3 style={{fontSize: '17px', fontWeight: 400, marginBottom: '12px'}}>Recent Answers</h3>
              {user.recent_answers.map(a => (
                <div key={a.id} style={{display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid #f0f0f0'}}>
                  <span style={{
                    minWidth: '40px',
                    padding: '4px',
                    fontSize: '11px',
                    textAlign: 'center',
                    borderRadius: '3px',
                    background: a.is_accepted ? 'var(--green)' : a.votes > 0 ? 'var(--green)' : 'var(--bg-light)',
                    color: (a.is_accepted || a.votes > 0) ? 'white' : 'var(--gray)'
                  }}>
                    {a.is_accepted ? '✓' : a.votes}
                  </span>
                  <Link href={`/questions/${a.question_id}`} style={{color: 'var(--blue)', flex: 1}}>{a.question_title}</Link>
                  <span style={{color: 'var(--gray)', fontSize: '12px'}}>{timeAgo(a.created_at)}</span>
                </div>
              ))}
            </div>
          )}
          
          {(!user.recent_questions?.length && !user.recent_answers?.length) && (
            <div className="empty">No activity yet.</div>
          )}
        </main>
      </div>
    </>
  )
}
