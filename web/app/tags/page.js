'use client'

import { useState, useEffect } from 'react'
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
        <Link href="/tags" className="sidebar-link active">
          <svg viewBox="0 0 18 18"><path fill="currentColor" d="M9.5 1L8 2.5l-.5.5-7 7L2 11.5 9 18.5l7-7 .5-.5L18 9.5 9.5 1zM9 16.09l-5.59-5.59 5.59-5.59 5.59 5.59L9 16.09z"/></svg>
          Tags
        </Link>
        <Link href="/users" className="sidebar-link">
          <svg viewBox="0 0 18 18"><path fill="currentColor" d="M9 1a8 8 0 100 16A8 8 0 009 1zM5.26 14.09c.19-.39.56-.65.98-.65h5.52c.42 0 .79.26.98.65A5.97 5.97 0 019 15a5.97 5.97 0 01-3.74-1.91zM13.56 13A2.99 2.99 0 0011.76 11H6.24c-.79 0-1.51.31-2.04.82A5.99 5.99 0 013 9c0-3.31 2.69-6 6-6s6 2.69 6 6a5.99 5.99 0 01-1.44 3.91zM9 5a2 2 0 100 4 2 2 0 000-4z"/></svg>
          Users
        </Link>
      </div>
    </aside>
  )
}

export default function TagsPage() {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('popular')
  const [filter, setFilter] = useState('')
  
  useEffect(() => {
    fetch(`${API}/api/tags?sort=${sort}&limit=100`)
      .then(r => r.json())
      .then(data => {
        setTags(data.tags || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [sort])
  
  const filteredTags = filter 
    ? tags.filter(t => t.name.toLowerCase().includes(filter.toLowerCase()))
    : tags
  
  return (
    <>
      <Header />
      <div className="container">
        <Sidebar />
        <main className="main-content">
          <h1 className="page-title">Tags</h1>
          <p style={{color: 'var(--gray)', margin: '8px 0 24px', lineHeight: 1.5}}>
            A tag is a keyword or label that categorizes your question with other, similar questions.
            Using the right tags makes it easier for others to find and answer your question.
          </p>
          
          <div style={{display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap'}}>
            <input 
              type="text"
              className="form-input"
              placeholder="Filter by tag name"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{maxWidth: '200px'}}
            />
            <div className="filter-tabs">
              {['popular', 'name', 'newest'].map(s => (
                <button 
                  key={s} 
                  className={`filter-tab ${sort === s ? 'active' : ''}`}
                  onClick={() => setSort(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {loading ? (
            <div className="loading">Loading tags...</div>
          ) : filteredTags.length === 0 ? (
            <div className="empty">No tags found.</div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px'}}>
              {filteredTags.map(tag => (
                <div key={tag.name} style={{border: '1px solid var(--border)', borderRadius: '3px', padding: '12px'}}>
                  <Link href={`/?tag=${tag.name}`} className="tag" style={{marginBottom: '8px', display: 'inline-block'}}>
                    {tag.name}
                  </Link>
                  {tag.description && (
                    <p style={{fontSize: '12px', color: 'var(--gray)', margin: '8px 0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                      {tag.description}
                    </p>
                  )}
                  <div style={{fontSize: '12px', color: 'var(--gray-light)', marginTop: '8px'}}>
                    {tag.question_count} {tag.question_count === 1 ? 'question' : 'questions'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
