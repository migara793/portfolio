import { Link } from 'react-router-dom'

export function NotFound() {
  return <div className="page-container empty-state"><span className="eyebrow">404</span><h1>That page wandered off.</h1><Link className="arrow-link" to="/">Return home ↗</Link></div>
}

