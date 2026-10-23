import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { api } from '../lib/api'

export function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setError('')
    try {
      await api.login(form)
      navigate('/admin')
    } catch (loginError) {
      setError(loginError.message)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link className="brand" to="/"><span className="brand-mark">M/</span><span>Migara</span></Link>
        <span className="eyebrow">Private workspace</span>
        <h1>Welcome back.</h1>
        <p>Sign in to update your portfolio.</p>
        <form onSubmit={submit} className="auth-form">
          <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="button button-dark" type="submit">Enter dashboard ↗</button>
        </form>
        <Link className="back-link" to="/">← Return to portfolio</Link>
      </div>
    </main>
  )
}

