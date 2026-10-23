import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { api } from '../lib/api'
import { demoProjects } from '../lib/demoData'

export function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(() => demoProjects.find((item) => item.slug === slug))

  useEffect(() => {
    api.getProject(slug).then(setProject).catch(() => {})
  }, [slug])

  if (!project) return <div className="page-container empty-state"><p>Project not found.</p><Link to="/projects">Back to work</Link></div>

  return (
    <article className="project-detail page-container">
      <Link className="back-link" to="/projects">← Back to selected work</Link>
      <div className="detail-heading">
        <div>
          <span className="eyebrow">Case study / {project.accent || 'field note'}</span>
          <h1>{project.title}</h1>
        </div>
        <p>{project.summary}</p>
      </div>
      <div className={`detail-art accent-${project.accent || 'lime'}`}>
        <div className="detail-art-lines" />
        <span>PROJECT / {project.slug}</span>
        <strong>↗</strong>
      </div>
      <div className="detail-content">
        <div>
          <span className="eyebrow">The idea</span>
          <p className="detail-lead">{project.description}</p>
        </div>
        <div className="detail-sidebar">
          <div><span className="eyebrow">Stack</span><div className="detail-tags">{project.technologies?.map((item) => <span className="tag" key={item}>{item}</span>)}</div></div>
          <div><span className="eyebrow">Cloud surface</span><div className="detail-tags">{project.cloud_services?.map((item) => <span className="tag tag-dark" key={item}>{item}</span>)}</div></div>
          {project.architecture && <div><span className="eyebrow">Architecture</span><p className="architecture">{project.architecture}</p></div>}
          <div className="detail-links">
            {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer">Repository ↗</a>}
            {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">Live demo ↗</a>}
          </div>
        </div>
      </div>
    </article>
  )
}

