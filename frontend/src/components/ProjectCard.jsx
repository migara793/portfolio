import { Link } from 'react-router-dom'

export function ProjectCard({ project, index = 0 }) {
  return (
    <Link className={`project-card accent-${project.accent || 'lime'}`} to={`/projects/${project.slug}`}>
      <div className="project-card-top">
        <span className="project-number">0{index + 1}</span>
        <span className="project-arrow">↗</span>
      </div>
      <div className="project-art" aria-hidden="true">
        <div className="art-grid" />
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <span className="art-label">{project.cloud_services?.[0] || 'Cloud systems'}</span>
      </div>
      <div className="project-card-copy">
        <div className="tag-row">
          {(project.technologies || []).slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
        </div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
      </div>
    </Link>
  )
}

