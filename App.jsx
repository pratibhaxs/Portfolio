import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

const projects = [
  {
    title: 'Netflix Clone',
    description: `A responsive clone of the Netflix homepage built using pure HTML and CSS. This project replicates the design and layout of Netflix's official landing page.`,
    link: 'https://pratibhaxs.github.io/NetflixClone/',
  },
  {
    title: 'JeevanSetu Health Profile App',
    description: `A modern web application for creating, managing, and verifying emergency health profiles using a unique JeevanSetu ID. Built with HTML, CSS, JavaScript, Node.js, Express, MySQL, and Tailwind CSS.`,
    link: 'https://pratibhaxs.github.io/JeevanSetu/',
  },
  {
    title: 'Personal Portfolio Website',
    description: `My personal portfolio website built with HTML, CSS, and JavaScript. This project showcases my skills, projects, and contact information.`,
    link: 'https://pratibhaxs.github.io/Portfolio/',
  },
];

const skills = [
  'HTML',
  'CSS',
  'JavaScript',
  'Tailwind CSS',
  'MySQL',
  'Java',
  'NodeJs',
  'C',
  'Git/Github',
];

function useDarkMode() {
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [dark]);
  return [dark, setDark];
}

function App() {
  const [dark, setDark] = useDarkMode();
  return (
    <div className="bg-background dark:bg-darkbg text-gunmetal dark:text-[#F9FAFB] min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#181A20]/90 backdrop-blur shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex justify- items-center h-16">
          
          <nav className="hidden md:flex gap-6 text-base font-medium">
            <a href="#about" className="hover:text-primary dark:hover:text-secondary transition">About</a>
            <a href="#projects" className="hover:text-primary dark:hover:text-secondary transition">Projects</a>
            <a href="#contact" className="hover:text-primary dark:hover:text-secondary transition">Contact</a>
          </nav>
          <button
            aria-label="Toggle dark mode"
            className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-[#23263A] text-primary dark:text-secondary hover:bg-gray-300 dark:hover:bg-[#23263A]/80 transition"
            onClick={() => setDark((d) => !d)}
          >
            {dark ? (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.75 15.5a7.25 7.25 0 01-7.25-7.25c0-1.61.52-3.1 1.41-4.3A.75.75 0 0011.2 2.2a9 9 0 1010.6 10.6.75.75 0 00-1.75-.29c-1.2.89-2.69 1.41-4.3 1.41z"/></svg>
            ) : (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 18a6 6 0 100-12 6 6 0 000 12zm0 2a8 8 0 100-16 8 8 0 000 16zm0-10a2 2 0 110 4 2 2 0 010-4z"/></svg>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 pt-12 pb-8 bg-gradient-to-br from-background via-white to-background dark:from-[#181A20] dark:via-[#111827] dark:to-[#181A20] relative overflow-hidden fade-in">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" /> <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <img src="/Pratibha Dit.jpg" alt="Pratibha Swami" className="w-40 h-40 rounded-full shadow-2xl mb-6 object-cover border-4 border-white dark:border-[#181A20]" />
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-center text-gunmetal dark:text-[#F9FAFB]">Pratibha Swami</h1>
        <p className="text-xl font-medium text-primary dark:text-secondary mb-6 text-center">Full Stack Developer & AI Enthusiast</p>
        <a href="/Pratibha_Swami_Resume.pdf" download className="inline-block px-8 py-3 bg-primary dark:bg-secondary text-white dark:text-gunmetal font-bold rounded-lg shadow-lg hover:bg-secondary hover:dark:bg-primary hover:text-gunmetal hover:dark:text-white hover:scale-105 transition-all duration-200">Resume</a>
      </section>

      {/* About Me Section */}
      <section id="about" className="max-w-4xl mx-auto px-4 py-16 fade-in">
        <div className="bg-white dark:bg-[#181A20] rounded-2xl shadow-md p-8 flex flex-col items-center gap-8">
          <div className="flex-1 w-full flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-2 text-center text-gunmetal dark:text-[#F9FAFB]">About Me</h2>
            <p className="text-base text-coolgray dark:text-[#A1A1AA] mb-4 text-center">I'm a 3rd-year B.Tech CSE student passionate about building impactful digital solutions. I love working on full-stack projects and exploring the world of AI/ML. My goal is to create technology that makes a difference.</p>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {skills.map((skill) => (
                <span key={skill} className="bg-secondary/20 dark:bg-[#23263A] text-primary dark:text-secondary px-3 py-1 rounded-full text-sm font-semibold shadow">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="max-w-6xl mx-auto px-4 py-16 fade-in">
        <h2 className="text-3xl font-bold mb-8 text-center text-gunmetal dark:text-[#F9FAFB]">Projects</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.title} className="bg-white dark:bg-[#181A20] border border-gray-100 dark:border-[#23263A] rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
              <h3 className="text-xl font-bold mb-2 text-gunmetal dark:text-[#F9FAFB]">{project.title}</h3>
              <p className="text-base text-coolgray dark:text-[#A1A1AA] mb-3">{project.description}</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-auto inline-block px-4 py-2 bg-primary dark:bg-secondary text-white dark:text-gunmetal rounded-lg font-bold shadow hover:bg-secondary hover:dark:bg-primary hover:text-gunmetal hover:dark:text-white transition">View Project</a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-2xl mx-auto px-4 py-16 fade-in">
        <div className="bg-white dark:bg-[#181A20] rounded-2xl shadow-md p-8 flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold mb-2 text-center text-gunmetal dark:text-[#F9FAFB]">Contact Me</h2>
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="flex items-center gap-2 text-primary text-lg font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="inline-block" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"/></svg>
              <span>+91 90684 54330</span>
            </div>
            <div className="flex items-center gap-2 text-primary text-lg font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="inline-block" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20V8.99l8 7 8-7V20H4z"/></svg>
              <span>pratibhaswami561@gmail.com</span>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-2">
            <a href="https://www.linkedin.com/in/pratibha-swami-a98782291/" target="_blank" aria-label="LinkedIn" className="text-secondary hover:text-primary text-3xl transition-transform transform hover:scale-110">
              <svg fill="currentColor" viewBox="0 0 24 24" width="36" height="36"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v5.62z"/></svg>
            </a>
            <a href="https://github.com/pratibhaxs" target="_blank" aria-label="GitHub" className="text-secondary hover:text-primary text-3xl transition-transform transform hover:scale-110">
              <svg fill="currentColor" viewBox="0 0 24 24" width="36" height="36"><path d="M12 0c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576 4.765-1.589 8.2-6.085 8.2-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#181A20] py-6 mt-8 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-2">
          <div className="text-[#A1A1AA] text-sm text-center md:text-left">&copy; 2024 Pratibha Swami. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

export default App;