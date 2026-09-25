"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "./dictionaries";
import { projects as projectList } from "./projects/data";
import { useTheme } from "./theme";

const EMAIL = "p3droon3@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/dev-pedro/";
const GITHUB = "https://github.com/p3dru";

const contactMethods = [
  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { label: "LinkedIn", value: "/in/dev-pedro", href: LINKEDIN },
  { label: "GitHub", value: "@p3dru", href: GITHUB },
];

const sectionClass =
  "anchor-section rounded-3xl border border-[var(--border)] bg-[var(--section)] p-5 shadow-[0_20px_70px_-60px_rgba(58,49,43,0.16)] md:p-8";
const cardClass = "rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5";
const eyebrowClass = "text-xs uppercase tracking-[0.28em] text-[var(--muted)]";
const tagClass =
  "rounded-full border border-[var(--border)] bg-[var(--header-footer)] px-3 py-1 text-xs text-[var(--foreground)]";
const outlineButtonClass =
  "rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-[1px] hover:border-[var(--accent)] hover:text-[var(--accent)]";

export default function Home({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("inicio");
  const [menuOpen, setMenuOpen] = useState(false);
  const year = new Date().getFullYear();
  const { header, nav, hero, projects, foundations, ai, about, contact, footer } = dict;
  const otherLang: Locale = lang === "pt" ? "en" : "pt";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id);
          }
        });
      },
      // Seção ativa = a que cruza a linha central da viewport (funciona para seções de qualquer altura).
      { rootMargin: "-50% 0px -50% 0px" }
    );

    nav.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [nav]);

  const themeLabel = theme === "light" ? header.themeToDark : header.themeToLight;

  return (
    <div className="min-h-screen text-[var(--foreground)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--header-footer)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--header-footer)] shadow-sm">
              <Image
                src="/avatar.png"
                alt={header.avatarAlt}
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
              <span className="text-xs font-semibold text-[var(--foreground)] sm:text-sm">
                {header.role}
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-2 text-sm text-[var(--muted)] lg:flex">
            {nav.map((link) => (
              <a
                key={link.id}
                className={`group relative rounded-full px-3 py-2 transition-all duration-200 hover:bg-[var(--accent-soft)]/60 ${activeSection === link.id ? "text-[var(--foreground)]" : ""
                  }`}
                href={`#${link.id}`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-2 -bottom-1 h-[2px] origin-left scale-x-0 rounded-full bg-[var(--accent)] transition-transform duration-200 ${activeSection === link.id ? "scale-x-100" : "group-hover:scale-x-100"
                    }`}
                />
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              className={outlineButtonClass}
              href={`/${otherLang}`}
              hrefLang={otherLang}
              aria-label={header.switchLangLabel}
            >
              {header.switchLang}
            </Link>
            <button
              className={`hidden lg:inline-flex ${outlineButtonClass}`}
              type="button"
              onClick={toggleTheme}
            >
              {themeLabel}
            </button>
            <button
              className={`lg:hidden ${outlineButtonClass}`}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? header.close : header.menu}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-menu"
            className="border-t border-[var(--border)] px-4 pb-4 pt-2 lg:hidden"
          >
            <ul className="flex flex-col text-base">
              {nav.map((link) => (
                <li key={link.id}>
                  <a
                    className={`block rounded-xl px-3 py-3 transition hover:bg-[var(--accent-soft)]/60 ${activeSection === link.id
                      ? "font-semibold text-[var(--accent)]"
                      : "text-[var(--foreground)]"
                      }`}
                    href={`#${link.id}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              className={`mt-2 w-full py-3 ${outlineButtonClass}`}
              type="button"
              onClick={toggleTheme}
            >
              {themeLabel}
            </button>
          </nav>
        )}
      </header>

      <div className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
        {nav.map((link) => {
          const isActive = activeSection === link.id;
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="group relative flex h-4 w-4 items-center justify-center"
              aria-label={link.label}
            >
              <span
                className={`block h-4 w-4 rounded-full border transition-all duration-200 ${isActive
                  ? "border-[var(--accent)] bg-[var(--accent)] shadow-[0_0_0_6px_rgba(176,125,98,0.25)] scale-110"
                  : "border-[var(--border)] bg-[var(--header-footer)] group-hover:border-[var(--accent)]"
                  }`}
              />
              <span className="absolute left-5 hidden whitespace-nowrap rounded-md bg-[var(--foreground)] px-2 py-1 text-[11px] text-[var(--background)] shadow-sm group-hover:inline">
                {link.label}
              </span>
            </a>
          );
        })}
      </div>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-10 md:px-6 md:py-14 lg:px-14">
        <section
          id="inicio"
          className="anchor-section grid gap-8 rounded-3xl border border-[var(--border)] bg-[var(--section)] p-5 shadow-[0_20px_80px_-60px_rgba(58,49,43,0.22)] md:p-12"
        >
          <div className="max-w-3xl space-y-6">
            <p className={eyebrowClass}>{hero.eyebrow}</p>
            <h1 className="text-4xl font-semibold leading-tight text-[var(--foreground)] md:text-5xl">
              {hero.titleStart} <span className="font-ui text-[var(--accent)]">UI</span>,{" "}
              <span className="font-ux text-[var(--accent)]">UX</span> {hero.and}{" "}
              <span className="font-ia text-[var(--accent)]">{hero.ai}</span> {hero.titleEnd}
            </h1>
            <p className="text-lg text-[var(--muted)]">{hero.lead}</p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                className="rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] px-4 py-2 font-semibold text-[var(--cta-text)] shadow-sm transition-transform duration-200 hover:-translate-y-[1px] hover:shadow-md hover:brightness-95"
                href="#projetos"
              >
                {hero.ctaProjects}
              </a>
              <a className={outlineButtonClass} href="#contato">
                {hero.ctaContact}
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[hero.availability, hero.stack].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_12px_38px_-26px_rgba(58,49,43,0.28)]"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                  {card.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                  {card.title}
                </p>
                <p className="text-sm text-[var(--muted)]">{card.text}</p>
              </div>
            ))}
            <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_12px_38px_-26px_rgba(58,49,43,0.28)] sm:col-span-2 lg:col-span-1">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                {hero.highlights.label}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {hero.highlights.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border-2 border-[var(--accent)] px-3 py-1 text-[var(--foreground)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projetos" className={`space-y-6 ${sectionClass}`}>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={eyebrowClass}>{projects.eyebrow}</p>
              <h2 className="text-3xl font-semibold text-[var(--foreground)]">{projects.title}</h2>
            </div>
            <a
              className="text-sm font-semibold text-[var(--accent)] transition hover:underline"
              href="https://p3dru.github.io/portfolio/"
              target="_blank"
              rel="noreferrer"
            >
              {projects.previous}
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectList.map((project, index) => (
              <Link
                key={project.slug}
                data-project={project.slug}
                className={`group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_18px_60px_-50px_rgba(58,49,43,0.22)] transition hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_24px_70px_-58px_rgba(58,49,43,0.3)] ${
                  // Um card sobrando na última linha ocupa a linha inteira, sem deixar buraco.
                  index === projectList.length - 1 && projectList.length % 2 === 1 ? "md:col-span-2" : ""
                } ${index === projectList.length - 1 && projectList.length % 3 === 1 ? "lg:col-span-3" : ""}`}
                href={`/${lang}/projects/${project.slug}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                      {projects.statuses[project.status]}
                    </span>
                    <span className="text-[var(--accent)] opacity-0 transition group-hover:opacity-100">
                      {projects.view}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">{project[lang].title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">{project[lang].summary}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className={tagClass}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="fundamentos" className={`space-y-6 ${sectionClass}`}>
          <div>
            <p className={eyebrowClass}>{foundations.eyebrow}</p>
            <h2 className="text-3xl font-semibold text-[var(--foreground)]">{foundations.title}</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {foundations.groups.map((group) => (
              <div key={group.title} className={`flex flex-col gap-4 ${cardClass}`}>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">{group.title}</h3>
                <ul className="space-y-2 text-sm text-[var(--muted)]">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag) => (
                    <span key={tag} className={tagClass}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-auto text-xs text-[var(--muted)]">
                  <span className="uppercase tracking-[0.2em]">{foundations.seenIn}:</span>{" "}
                  <span className="text-[var(--foreground)]">{group.projects.join(" · ")}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="ia" className={`space-y-6 ${sectionClass}`}>
          <div className="max-w-3xl space-y-2">
            <p className={eyebrowClass}>{ai.eyebrow}</p>
            <h2 className="text-3xl font-semibold text-[var(--foreground)]">{ai.title}</h2>
            <p className="text-[var(--muted)]">{ai.intro}</p>
          </div>

          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {ai.steps.map((step, index) => (
              <li key={step.title} className={`space-y-2 ${cardClass} p-4`}>
                <span className="font-mono text-xs text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold text-[var(--foreground)]">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="grid gap-4 md:grid-cols-2">
            <div className={`space-y-2 ${cardClass}`}>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{ai.audit.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--muted)]">{ai.audit.text}</p>
            </div>
            <div className={`space-y-3 ${cardClass}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  {ai.buildcore.title}
                </h3>
                <span className="rounded-full border-2 border-[var(--accent)] px-3 py-0.5 text-xs text-[var(--foreground)]">
                  {ai.buildcore.badge}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[var(--muted)]">{ai.buildcore.text}</p>
              <Link
                className="inline-block text-sm font-semibold text-[var(--accent)] transition hover:underline"
                href={`/${lang}/projects/ai-buildcore`}
              >
                {projects.view}
              </Link>
              <dl className="flex gap-6">
                {ai.buildcore.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="text-2xl font-semibold text-[var(--foreground)]">
                      {stat.value}{" "}
                      <span className="text-xs font-normal uppercase tracking-[0.2em] text-[var(--muted)]">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="sobre" className={`grid gap-6 md:grid-cols-3 ${sectionClass}`}>
          <div className="space-y-4 md:col-span-2">
            <p className={eyebrowClass}>{about.eyebrow}</p>
            <h2 className="text-3xl font-semibold text-[var(--foreground)]">{about.title}</h2>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-[var(--muted)]">
                {paragraph}
              </p>
            ))}
          </div>
          <div className={`self-start ${cardClass}`}>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{about.exploringTitle}</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              {about.exploring.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="contato"
          className={`grid gap-6 md:grid-cols-[1fr_minmax(0,260px)] ${sectionClass}`}
        >
          <div className="space-y-4">
            <p className={eyebrowClass}>{contact.eyebrow}</p>
            <h2 className="text-3xl font-semibold text-[var(--foreground)]">{contact.title}</h2>
            <p className="text-[var(--muted)]">{contact.text}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-1">
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
                  <span className="break-all text-lg font-semibold text-[var(--foreground)]">
                    {method.value}
                  </span>
                </a>
              ))}
            </div>
          </div>
          <div className="mx-auto w-full max-w-[260px] rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-3">
            <div className="relative aspect-[1696/2528] w-full overflow-hidden rounded-xl bg-[var(--header-footer)]">
              <Image
                src={theme === "light" ? "/claro.png" : "/escuro.png"}
                alt={contact.imageAlt}
                fill
                sizes="260px"
                className="object-contain"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--header-footer)] shadow-[0_-10px_30px_-20px_rgba(58,49,43,0.16)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-5 text-sm text-[var(--muted)] md:flex-row md:items-center md:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{footer.label}</p>
            <p className="text-[var(--foreground)]">
              © {year} — {footer.rights}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {contactMethods.map((method) => (
              <a
                key={method.label}
                className={outlineButtonClass}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={method.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {method.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
