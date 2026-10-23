import { Link, NavLink } from 'react-router-dom'

export function SiteShell({ children }) {
  return (
    <div className="site-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">M/</span>
          <span>Migara</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/projects">Work</NavLink>
          <a href="/#about">About</a>
          <a href="/#contact">Contact</a>
        </nav>
        <Link className="nav-pill" to="/admin/login">Admin <span>↗</span></Link>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} Migara</span>
        <span>Built with React / FastAPI / Docker</span>
        <a href="mailto:hello@example.com">hello@example.com ↗</a>
      </footer>
    </div>
  )
}

export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

export function ArrowLink({ children, to, href }) {
  const className = 'arrow-link'
  if (href) return <a className={className} href={href}>{children} <span>↗</span></a>
  return <Link className={className} to={to}>{children} <span>↗</span></Link>
}

