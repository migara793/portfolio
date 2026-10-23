import { useEffect, useState } from 'react'

import { ProjectCard } from '../components/ProjectCard'
import { SectionHeading } from '../components/SiteShell'
import { api } from '../lib/api'
import { demoProjects } from '../lib/demoData'

export function Projects() {
  const [projects, setProjects] = useState(demoProjects)

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => {})
  }, [])

  return (
    <section className="page-container archive-page">
      <div className="archive-heading">
        <SectionHeading eyebrow="Selected work / 2026" title="A working archive." description="Experiments and case studies across cloud infrastructure, developer experience, and product systems." />
        <span className="archive-count">{String(projects.length).padStart(2, '0')} projects</span>
      </div>
      <div className="project-grid archive-grid">
        {projects.map((project, index) => <ProjectCard key={project.id || project.slug} project={project} index={index} />)}
      </div>
    </section>
  )
}

