import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { api } from '../lib/api'

const emptyProject = {
  title: '', slug: '', summary: '', description: '', technologies: [], cloud_services: [], architecture: '', image_url: '', github_url: '', live_url: '', accent: 'lime', featured: false, published: true,
}

export function AdminDashboard() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [messages, setMessages] = useState([])
  const [form, setForm] = useState(emptyProject)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.me(), api.getAdminProjects(), api.getMessages()])
      .then(([, projectData, messageData]) => { setProjects(projectData); setMessages(messageData) })
      .catch(() => navigate('/admin/login'))
  }, [navigate])

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  function updateList(event) {
    setForm({ ...form, [event.target.name]: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })
  }

  function edit(project) {
    setEditingId(project.id)
    setForm(project)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function save(event) {
    event.preventDefault()
    setError('')
    try {
      const payload = {
        ...form,
        image_url: form.image_url || null,
        github_url: form.github_url || null,
        live_url: form.live_url || null,
      }
      const saved = editingId ? await api.updateProject(editingId, payload) : await api.createProject(payload)
      setProjects((current) => editingId ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current])
      setForm(emptyProject)
      setEditingId(null)
    } catch (saveError) {
      setError(saveError.message)
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this project?')) return
    await api.deleteProject(id)
    setProjects((current) => current.filter((item) => item.id !== id))
  }

  async function logout() {
    await api.logout()
    navigate('/')
  }

  return (
    <main className="admin-page page-container">
      <div className="admin-topbar">
        <Link className="brand" to="/"><span className="brand-mark">M/</span><span>Migara / admin</span></Link>
        <div><Link className="text-link" to="/">View site ↗</Link><button className="button button-small" onClick={logout}>Log out</button></div>
      </div>
      <div className="admin-heading"><div><span className="eyebrow">Private workspace</span><h1>Shape the archive.</h1></div><span className="admin-count">{projects.length} projects / {messages.length} messages</span></div>
      <div className="admin-grid">
        <form className="admin-form" onSubmit={save}>
          <div className="admin-form-heading"><span className="eyebrow">{editingId ? 'Edit project' : 'New project'}</span><h2>{editingId ? 'Refine the details.' : 'Add to the story.'}</h2></div>
          <label>Title<input name="title" value={form.title} onChange={updateField} required /></label>
          <label>Slug<input name="slug" value={form.slug} onChange={updateField} placeholder="my-project" required /></label>
          <label>Summary<input name="summary" value={form.summary} onChange={updateField} required /></label>
          <label>Description<textarea name="description" value={form.description} onChange={updateField} rows="5" required /></label>
          <label>Technologies <span className="label-hint">comma separated</span><input name="technologies" value={form.technologies.join(', ')} onChange={updateList} /></label>
          <label>Cloud services <span className="label-hint">comma separated</span><input name="cloud_services" value={form.cloud_services.join(', ')} onChange={updateList} /></label>
          <label>Architecture<input name="architecture" value={form.architecture || ''} onChange={updateField} /></label>
          <div className="form-row"><label>Accent<select name="accent" value={form.accent} onChange={updateField}><option value="lime">Lime</option><option value="blue">Blue</option><option value="coral">Coral</option></select></label><label>Live URL<input name="live_url" value={form.live_url || ''} onChange={updateField} placeholder="https://" /></label></div>
          <label>GitHub URL<input name="github_url" value={form.github_url || ''} onChange={updateField} placeholder="https://github.com/..." /></label>
          <div className="check-row"><label><input type="checkbox" name="featured" checked={form.featured} onChange={updateField} /> Featured</label><label><input type="checkbox" name="published" checked={form.published} onChange={updateField} /> Published</label></div>
          {error && <div className="form-error">{error}</div>}
          <div className="admin-actions"><button className="button button-dark" type="submit">{editingId ? 'Save changes ↗' : 'Publish project ↗'}</button>{editingId && <button className="button button-ghost" type="button" onClick={() => { setEditingId(null); setForm(emptyProject) }}>Cancel</button>}</div>
        </form>
        <section className="admin-list"><div className="admin-form-heading"><span className="eyebrow">Archive</span><h2>Current projects.</h2></div>{projects.map((project) => <div className="admin-project" key={project.id}><div><strong>{project.title}</strong><span>{project.published ? 'Published' : 'Draft'} · {project.slug}</span></div><div className="admin-project-actions"><button onClick={() => edit(project)}>Edit</button><button onClick={() => remove(project.id)}>Delete</button></div></div>)}</section>
      </div>
    </main>
  )
}

