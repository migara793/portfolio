import { useState } from 'react'

import { api } from '../lib/api'

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await api.sendMessage(form)
      setForm({ name: '', email: '', message: '' })
      setStatus('success')
    } catch (submitError) {
      setError(submitError.message)
      setStatus('error')
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row">
        <label>Name<input name="name" value={form.name} onChange={updateField} placeholder="Your name" required /></label>
        <label>Email<input type="email" name="email" value={form.email} onChange={updateField} placeholder="you@example.com" required /></label>
      </div>
      <label>Message<textarea name="message" value={form.message} onChange={updateField} placeholder="Tell me what you are building..." rows="5" required /></label>
      <div className="form-submit-row">
        <button className="button button-dark" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send message ↗'}
        </button>
        {status === 'success' && <span className="form-success">Message received. Thank you.</span>}
        {status === 'error' && <span className="form-error">{error}</span>}
      </div>
    </form>
  )
}

