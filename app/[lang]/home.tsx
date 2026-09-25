"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "./dictionaries";
import { projects as projectList } from "./projects/data";
import { flightPhases, flightProgress, LANDED_AT, sectionProgress } from "./scene/progress";
import type { Flight } from "./scene/section-scene";
import { useTheme } from "./theme";

// three.js só é baixado no desktop, depois da primeira pintura.
const SectionScene = dynamic(() => import("./scene/section-scene"), { ssr: false });

const DESKTOP_QUERY = "(min-width: 1024px)";
const subscribeDesktop = (onChange: () => void) => {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

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

// Ícone do avião no canal: no desktop, onde a cena 3D estaciona; no mobile, pousa sozinho.
function PaperPlane({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M3 11L21 4L14 21L11 13Z" fill="currentColor" fillOpacity="0.25" />
      <path
        d="M3 11L21 4L14 21L11 13ZM21 4L11 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Marca a passagem entre seções: número, nome e um fio, ancorando o olhar.
function SectionDivider({ index, label }: { index: number; label: string }) {
  return (
    <div
      className="flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-[var(--muted)]"
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-[var(--border)]" />
      <span className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        {String(index + 1).padStart(2, "0")} — {label}
      </span>
      <span className="h-px flex-1 bg-[var(--border)]" />
    </div>
  );
}

export default function Home({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("inicio");
  const [menuOpen, setMenuOpen] = useState(false);
  const year = new Date().getFullYear();
  const { header, nav, hero, projects, foundations, ai, about, contact, footer } = dict;
  const otherLang: Locale = lang === "pt" ? "en" : "pt";

  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );
  // Progresso contínuo entre seções (0..n-1), compartilhado com a cena 3D sem re-render.
  const progressRef = useRef(0);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Voo do avião até os canais de contato: progresso vem do scroll, alvo do hover/foco.
  const flightRef = useRef<Flight>({ progress: 0, target: null });
  const channelRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hoveredChannel, setHoveredChannel] = useState<number | null>(null);
  const [landed, setLanded] = useState(false);
  const [contactReached, setContactReached] = useState(false);
  const targetChannel = hoveredChannel ?? 0;
  const aimAt = (index: number | null) => {
    setHoveredChannel(index);
    flightRef.current.target = channelRefs.current[index ?? 0];
  };

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const tops = nav.map(({ id }) => document.getElementById(id)?.getBoundingClientRect().top ?? 0);
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const progress = atBottom
        ? nav.length - 1
        : sectionProgress(tops, window.innerHeight / 2, window.innerHeight * 0.25);
      progressRef.current = progress;
      // Cada ponto perde ou ganha cor na mesma medida em que a forma da direita se transforma.
      dotRefs.current.forEach((dot, index) =>
        dot?.style.setProperty("--w", String(Math.max(0, 1 - Math.abs(progress - index))))
      );
      setActiveSection(nav[Math.round(progress)].id);

      const contactTop = document.getElementById("contato")?.getBoundingClientRect().top ?? Infinity;
      const remainingScroll = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      const flight = flightProgress(contactTop, window.innerHeight, contactTop - remainingScroll);
      flightRef.current.progress = flight;
      flightRef.current.target ??= channelRefs.current[0];
      setLanded(flightPhases(flight).travel >= LANDED_AT);
      if (flight > 0) setContactReached(true);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
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

      <div className="fixed left-[calc(var(--gutter)/2)] top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 lg:flex">
        {nav.map((link, index) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="group relative flex h-4 w-4 items-center justify-center"
            aria-label={link.label}
            aria-current={activeSection === link.id ? "true" : undefined}
          >
            <span
              ref={(dot) => {
                dotRefs.current[index] = dot;
              }}
              className="section-dot"
            />
            <span className="absolute left-5 hidden whitespace-nowrap rounded-md bg-[var(--foreground)] px-2 py-1 text-[11px] text-[var(--background)] shadow-sm group-hover:inline">
              {link.label}
            </span>
          </a>
        ))}
      </div>

      {isDesktop && (
        <div className="pointer-events-none fixed inset-0 z-10">
          <SectionScene progressRef={progressRef} flightRef={flightRef} />
        </div>
      )}

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 md:px-6 md:py-14 lg:max-w-[var(--content)] lg:px-0">
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

          <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_12px_38px_-26px_rgba(58,49,43,0.28)] sm:col-span-2">
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

        <SectionDivider index={1} label={nav[1].label} />

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

          <div className="grid gap-4 md:grid-cols-2">
            {projectList.map((project, index) => (
              <Link
                key={project.slug}
                data-project={project.slug}
                className={`group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_18px_60px_-50px_rgba(58,49,43,0.22)] transition hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_24px_70px_-58px_rgba(58,49,43,0.3)] ${
                  // Um card sobrando na última linha ocupa a linha inteira, sem deixar buraco.
                  index === projectList.length - 1 && projectList.length % 2 === 1 ? "md:col-span-2" : ""
                }`}
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

        <SectionDivider index={2} label={nav[2].label} />

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

        <SectionDivider index={3} label={nav[3].label} />

        <section id="ia" className={`space-y-6 ${sectionClass}`}>
          <div className="max-w-3xl space-y-2">
            <p className={eyebrowClass}>{ai.eyebrow}</p>
            <h2 className="text-3xl font-semibold text-[var(--foreground)]">{ai.title}</h2>
            <p className="text-[var(--muted)]">{ai.intro}</p>
          </div>

          <ol className="grid gap-3 sm:grid-cols-2">
            {ai.steps.map((step, index) => (
              <li key={step.title} className={`space-y-2 ${cardClass} p-4 sm:last:col-span-2`}>
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

        <SectionDivider index={4} label={nav[4].label} />

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

        <SectionDivider index={5} label={nav[5].label} />

        <section
          id="contato"
          className={`space-y-4 overflow-hidden ${sectionClass}`}
        >
          <p className={eyebrowClass}>{contact.eyebrow}</p>
          <h2 className="text-3xl font-semibold text-[var(--foreground)]">{contact.title}</h2>
          <p className="text-[var(--muted)]">{contact.text}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" onMouseLeave={() => aimAt(null)}>
            {contactMethods.map((method, index) => (
              <a
                key={method.label}
                ref={(channel) => {
                  channelRefs.current[index] = channel;
                }}
                className={`relative flex flex-col gap-1 rounded-2xl border bg-[var(--card)] p-4 transition hover:-translate-y-[1px] ${landed && targetChannel === index
                  ? "border-[var(--accent)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_20%,transparent)]"
                  : "border-[var(--border)] hover:border-[var(--accent)]/60"
                  }`}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                onMouseEnter={() => aimAt(index)}
                onFocus={() => aimAt(index)}
                onBlur={() => aimAt(null)}
              >
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  {method.label}
                </span>
                <span className="break-all text-lg font-semibold text-[var(--foreground)]">
                  {method.value}
                </span>
                {/* Os dois ícones sempre no HTML; o CSS escolhe por largura (sem troca na hidratação). */}
                <PaperPlane className="card-plane parked-plane" />
                {index === 0 && (
                  <PaperPlane
                    className={`card-plane landing-plane ${contactReached ? "is-landing" : ""}`}
                  />
                )}
              </a>
            ))}
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
