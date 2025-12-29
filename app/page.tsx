"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Projetos", href: "#projetos" },
  { label: "Skills", href: "#skills" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

const projects = [
  {
    title: "DisasterScan",
    summary:
      "Plataforma inteligente para monitoramento, previsão e mitigação de desastres naturais, integrando múltiplas fontes de dados para apoiar a decisão estratégica. Indicadores, alertas e dashboards analíticos para riscos ambientais.",
    tags: ["FastAPI", "Next.js", "PostgreSQL"],
    link: "https://icognitiva.com/disasterscan",
  },
  {
    title: "Classificação de Grãos com Visão Computacional",
    summary:
      "Sistema de IA para segmentar e classificar grãos agrícolas (defeituosos, danificados e saudáveis), com pipeline de imagens, extração de características e análise de performance. Integra backend, banco e app mobile para uso prático.",
    tags: ["YOLO", "Flutter", "PostgreSQL"],
    link: "mailto:p3droon3@gmail.com?subject=Classifica%C3%A7%C3%A3o%20de%20Gr%C3%A3os",
  },
  {
    title: "Site Institucional – Programa PPGZT",
    summary:
      "Site institucional moderno para divulgação acadêmica, com desempenho, organização de conteúdo, arquivos e suporte a múltiplos idiomas via i18n (PT/EN) e admin.",
    tags: ["NestJS", "React", "PostgreSQL"],
    link: "https://ppgzt.com.br/",
  },
];

const expertise = [
  {
    title: "Produto e Discovery",
    items: [
      "Entrevistas, personas e fluxos para priorizar certo",
      "Workshops, prototipação e definição de requisitos",
      "Handoff claro e documentação concisa",
    ],
  },
  {
    title: "Frontend",
    items: [
      "React / Next.js com foco em performance e acessibilidade",
      "Design systems pragmáticos, microinterações e responsivo",
      "Testes, observabilidade e automação de deploy",
    ],
  },
  {
    title: "Backend",
    items: [
      "APIs REST/GraphQL, autenticação e segurança",
      "Integração com bancos relacionais e NoSQL",
      "Pipelines para logs, métricas e alertas",
    ],
  },
  {
    title: "Soft skills",
    items: [
      "Comunicação, gestão de tempo e liderança leve",
      "Resolução de conflitos e colaboração",
      "Orientação a resultados e melhoria contínua",
    ],
  },
];

const tools = [
  "Next.js, React, TypeScript",
  "Tailwind, Design Systems",
  "Node.js, FastAPI, Django",
  "PostgreSQL, MySQL, MongoDB",
  "GraphQL, REST",
  "TensorFlow, Keras, YOLO",
  "Git, GitHub, CI/CD",
  "Notion, Trello, Figma",
];

const contactMethods = [
  {
    label: "Email",
    value: "p3droon3@gmail.com",
    href: "mailto:p3droon3@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "/in/p3dru",
    href: "https://www.linkedin.com/in/p3dru/",
  },
  {
    label: "GitHub",
    value: "@p3dru",
    href: "https://github.com/p3dru",
  },
];

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeSection, setActiveSection] = useState<string>("inicio");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = navLinks
      .map((link) => document.getElementById(link.href.replace("#", "")))
      .filter(Boolean) as HTMLElement[];

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen text-[var(--foreground)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--header-footer)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--header-footer)] shadow-sm">
              <Image
                src="/avatar.png"
                alt="Avatar de João Pedro"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                João Pedro
              </span>
              <span className="text-sm font-semibold text-[var(--foreground)]">
                Product Engineer
              </span>
            </div>
          </div>
          <nav className="hidden items-center gap-4 text-sm text-[var(--muted)] md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                className="rounded-full px-3 py-2 transition hover:bg-[var(--accent-soft)]/60"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            className="hidden rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-[1px] hover:border-[var(--accent)] hover:text-[var(--accent)] md:inline-flex"
            type="button"
            onClick={toggleTheme}
          >
            {theme === "light" ? "Tema escuro" : "Tema claro"}
          </button>
        </div>
      </header>

      <div className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex">
        {navLinks.map((link) => {
          const id = link.href.replace("#", "");
          const isActive = activeSection === id;
          return (
            <a
              key={link.href}
              href={link.href}
              className="group relative flex h-4 w-4 items-center justify-center"
              aria-label={link.label}
            >
              <span
                className={`block h-4 w-4 rounded-full border transition ${
                  isActive
                    ? "border-[var(--accent)] bg-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--header-footer)] group-hover:border-[var(--accent)]"
                }`}
              />
              <span className="absolute left-5 hidden rounded-md bg-[var(--foreground)] px-2 py-1 text-[11px] text-[var(--background)] shadow-sm group-hover:inline">
                {link.label}
              </span>
            </a>
          );
        })}
      </div>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12 pb-28 md:px-6 md:py-16 md:pb-32">
        <div className="section-wrapper flex min-h-[85vh] items-center justify-center">
          <section
            id="inicio"
            className="anchor-section grid min-h-[70vh] gap-10 rounded-3xl border border-[var(--border)] bg-[var(--section)] p-8 shadow-[0_20px_80px_-60px_rgba(58,49,43,0.22)] md:min-h-[75vh] md:grid-cols-2 md:p-12"
          >
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                Portfolio — v2025
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-[var(--foreground)] md:text-5xl">
                Engenharia, UX e IA aplicadas para entregar produtos com clareza e ritmo.
              </h1>
              <p className="text-lg text-[var(--muted)]">
                Transformo ideias em produtos navegáveis, com decisões guiadas por dados e
                documentação clara. Atuo do discovery ao deploy, mantendo times alinhados e
                entregas previsíveis.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <a
                  className="rounded-full bg-[var(--accent)] px-4 py-2 font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md"
                  href="#projetos"
                >
                  Ver projetos
                </a>
                <a
                  className="rounded-full border border-[var(--border)] px-4 py-2 font-semibold text-[var(--foreground)] transition hover:-translate-y-[1px] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  href="#contato"
                >
                  Contato direto
                </a>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_12px_38px_-26px_rgba(58,49,43,0.28)]">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Disponibilidade
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                  Novos projetos
                </p>
                <p className="text-sm text-[var(--muted)]">
                  MVPs técnicos, replatform e automação.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_12px_38px_-26px_rgba(58,49,43,0.28)]">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Stack preferida
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                  TypeScript first
                </p>
                <p className="text-sm text-[var(--muted)]">
                  Next.js, Node, SQL/NoSQL, testes e observabilidade.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_12px_38px_-26px_rgba(58,49,43,0.28)] md:col-span-2">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  Diferenciais
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  {[
                    "Discovery ágil",
                    "UX objetiva",
                    "Docs leves",
                    "Entrega contínua",
                    "IA aplicada",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--foreground)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="section-wrapper flex min-h-screen items-center justify-center">
          <section
            id="projetos"
            className="anchor-section min-h-[75vh] space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--section)] p-6 shadow-[0_20px_70px_-60px_rgba(58,49,43,0.16)] md:p-8"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                  Projetos
                </p>
                <h2 className="text-3xl font-semibold text-[var(--foreground)]">
                  Soluções entregues com foco técnico
                </h2>
                <p className="text-sm text-[var(--muted)]">
                  {/* Evolução do portfólio original: menos ruído, mais clareza e CTA direto. */}
                </p>
              </div>
              <a
                className="text-sm font-semibold text-[var(--accent)] transition hover:underline"
                href="https://p3dru.github.io/portfolio/works"
                target="_blank"
                rel="noreferrer"
              >
                Histórico anterior ↗
              </a>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {projects.map((project) => (
                <a
                  key={project.title}
                  className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_18px_60px_-50px_rgba(58,49,43,0.22)] transition hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-[0_24px_70px_-58px_rgba(58,49,43,0.3)]"
                  href={project.link}
                  target={project.link.startsWith("http") ? "_blank" : undefined}
                  rel={project.link.startsWith("http") ? "noreferrer" : undefined}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                      <span>Projeto</span>
                      <span className="text-[var(--accent)] opacity-0 transition group-hover:opacity-100">
                        Ver ↗
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">
                      {project.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--muted)]">
                      {project.summary}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[var(--border)] bg-[var(--header-footer)] px-3 py-1 text-xs text-[var(--foreground)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="section-wrapper flex min-h-screen items-center justify-center">
          <section
            id="skills"
            className="anchor-section min-h-[70vh] space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--section)] p-8 shadow-[0_20px_80px_-60px_rgba(58,49,43,0.2)]"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                  Skills e Expertise
                </p>
                <h2 className="text-3xl font-semibold text-[var(--foreground)]">
                  Fundamentos sólidos e entregáveis
                </h2>
                <p className="text-sm text-[var(--muted)]">
                  {/* Conteúdo organizado e direto, inspirado na versão anterior porém mais
                  profissional. */}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {expertise.map((area) => (
                <div
                  key={area.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
                >
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">{area.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                    {area.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              {tools.map((tool) => (
                <div
                  key={tool}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)]"
                >
                  {tool}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="section-wrapper flex min-h-screen items-center justify-center">
          <section
            id="sobre"
            className="anchor-section grid min-h-[75vh] gap-6 rounded-3xl border border-[var(--border)] bg-[var(--section)] p-8 shadow-[0_20px_70px_-60px_rgba(58,49,43,0.16)] md:grid-cols-3"
          >
            <div className="md:col-span-2 space-y-4">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                Sobre
              </p>
              <h2 className="text-3xl font-semibold text-[var(--foreground)]">
                João Pedro — engenheiro de software com olhar para produto
              </h2>
              <p className="text-base text-[var(--muted)]">
                Olá, me chamo João Pedro. Gosto de estar em todo o ciclo de criação: da
                descoberta à entrega. Tenho facilidade em socializar, priorizar e adaptar
                soluções em andamento, mantendo compromisso com prazos e qualidade.
              </p>
              <p className="text-base text-[var(--muted)]">
                Construo aplicações completas, cuidando para que design, funcionalidade e
                escalabilidade andem juntos. No backend, foco em lógica limpa, segurança e
                performance; no frontend, interfaces responsivas e acessíveis. IA também faz
                parte do meu repertório — já integrei CNNs e modelos pré-treinados em
                provas de conceito e continuo estudando para ir além.
              </p>
              <p className="text-base text-[var(--muted)]">
                Fora do código, você provavelmente me encontrará praticando esportes,
                desenhando, jogando ou mergulhado em leituras sobre tecnologia e ciências
                sociais.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                O que estou explorando agora
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                <li>• C e C++ para sistemas embarcados</li>
                <li>• Programas de fomento a startups e liderança de squads enxutos</li>
                <li>• Soluções modulares que unem web e inteligência artificial</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="section-wrapper flex min-h-screen items-center justify-center">
          <section
            id="contato"
            className="anchor-section grid min-h-[65vh] gap-6 rounded-3xl border border-[var(--border)] bg-[var(--section)] p-8 shadow-[0_20px_70px_-60px_rgba(58,49,43,0.16)] md:grid-cols-2"
          >
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                Contato
              </p>
              <h2 className="text-3xl font-semibold text-[var(--foreground)]">
                Vamos falar sobre o próximo projeto?
              </h2>
              <p className="text-base text-[var(--muted)]">
                Aberto a colaborações, consultorias e products labs. Respondo rápido e já
                chego com próximos passos, riscos e entregas sugeridas.
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {contactMethods.map((method) => (
                  <a
                    key={method.label}
                    className="flex flex-col gap-1 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:-translate-y-[1px] hover:border-[var(--accent)]/60"
                    href={method.href}
                    target={method.href.startsWith("http") ? "_blank" : undefined}
                    rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                      {method.label}
                    </span>
                    <span className="text-lg font-semibold text-[var(--foreground)]">
                      {method.value}
                    </span>
                  </a>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <p className="text-sm font-semibold text-[var(--foreground)]">Roteiro rápido</p>
              <div className="mt-3 space-y-3 text-sm text-[var(--muted)]">
                <p>1) Contexto em 5 min: metas, prazo e restrições.</p>
                <p>2) Proposta em 24h: stack, riscos, entregas e cronograma.</p>
                <p>3) Kickoff: branch inicial, métricas e cadência semanal.</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--foreground)]">
                  Resposta em &lt; 12h
                </span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--foreground)]">
                  PT / EN
                </span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--foreground)]">
                  Remote-first
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--header-footer)] backdrop-blur-sm shadow-[0_-10px_30px_-20px_rgba(58,49,43,0.16)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-5 text-sm text-[var(--muted)] md:flex-row md:items-center md:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              João Pedro — Portfólio
            </p>
            <p className="text-[var(--foreground)]">Sempre aberto a construir algo novo.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              className="rounded-full border border-[var(--border)] px-4 py-2 font-semibold text-[var(--foreground)] transition hover:-translate-y-[1px] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              href="mailto:p3droon3@gmail.com"
            >
              Email
            </a>
            <a
              className="rounded-full border border-[var(--border)] px-4 py-2 font-semibold text-[var(--foreground)] transition hover:-translate-y-[1px] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              href="https://www.linkedin.com/in/p3dru/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="rounded-full border border-[var(--border)] px-4 py-2 font-semibold text-[var(--foreground)] transition hover:-translate-y-[1px] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              href="https://github.com/p3dru"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
