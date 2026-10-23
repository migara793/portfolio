import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { ContactForm } from '../components/ContactForm'
import { ArrowLink, SectionHeading } from '../components/SiteShell'
import { ProjectCard } from '../components/ProjectCard'
import { api } from '../lib/api'
import { demoProjects } from '../lib/demoData'

const services = ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI / CD']

export function Home() {
  const [projects, setProjects] = useState(demoProjects)

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => {})
  }, [])

  const featured = projects.filter((project) => project.featured).slice(0, 2)

  return (
    <>
      <section className="hero page-container">
        <div className="hero-kicker"><span className="status-dot" /> Available for thoughtful systems</div>
        <div className="hero-grid">
          <div>
            <h1>Cloud systems,<br /><em>made human.</em></h1>
          </div>
          <div className="hero-aside">
            <p className="hero-intro">I design and build calm, reliable digital products at the intersection of product thinking and cloud engineering.</p>
            <div className="hero-actions">
              <ArrowLink to="/projects">Explore selected work</ArrowLink>
              <a className="text-link" href="#contact">Start a conversation ↓</a>
            </div>
          </div>
        </div>
        <div className="hero-stamp" aria-hidden="true"><span>BUILD / SHIP / LEARN</span><strong>∞</strong></div>
      </section>

      <section className="signal-band">
        <div className="page-container signal-inner">
          <span className="eyebrow">Working across</span>
          <div className="signal-list">{services.map((service) => <span key={service}>{service}</span>)}</div>
        </div>
      </section>

      <section className="page-container section-block" id="work">
        <div className="section-row">
          <SectionHeading eyebrow="01 / Selected work" title="Systems with a point of view." description="A few explorations in infrastructure, delivery, and the interfaces that help teams stay oriented." />
          <ArrowLink to="/projects">View all projects</ArrowLink>
        </div>
        <div className="project-grid featured-grid">
          {featured.map((project, index) => <ProjectCard key={project.id || project.slug} project={project} index={index} />)}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="page-container about-grid">
          <div className="about-marker">02</div>
          <div>
            <span className="eyebrow">A little context</span>
            <h2>Good infrastructure should feel like <em>momentum.</em></h2>
          </div>
          <div className="about-copy">
            <p>I care about the layer beneath the interface: the workflows, APIs, deployment paths, and small decisions that make a product dependable.</p>
            <p>This portfolio is a living lab for those ideas — part notebook, part working system, always being refined.</p>
            <Link className="button button-light" to="/projects">See the field notes ↗</Link>
          </div>
        </div>
      </section>

      <section className="page-container section-block" id="contact">
        <div className="contact-grid">
          <div>
            <span className="eyebrow">03 / Contact</span>
            <h2>Have a knot<br />worth untying?</h2>
            <p className="contact-note">Tell me what you are building, where it feels stuck, or what you want to explore next.</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}

