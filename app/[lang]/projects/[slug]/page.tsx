import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales } from "../../dictionaries";
import { ThemeButton } from "../../theme";
import { getProject, projects } from "../data";
import ProjectVisual from "../project-visual";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => projects.map(({ slug }) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(lang) || !project) return {};
  return {
    title: `${project[lang].title} — João Pedro`,
    description: project[lang].summary,
    alternates: {
      languages: { "pt-BR": `/pt/projects/${slug}`, en: `/en/projects/${slug}` },
    },
  };
}

const eyebrowClass = "text-xs uppercase tracking-[0.28em] text-[var(--muted)]";
const cardClass = "rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5";
const outlineButtonClass =
  "rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-[1px] hover:border-[var(--accent)] hover:text-[var(--accent)]";

export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(lang) || !project) notFound();

  const { header, projects: projectsDict, projectPage } = getDictionary(lang);
  const text = project[lang];
  const otherLang = lang === "pt" ? "en" : "pt";
  const next = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <div data-project={project.slug} data-project-page className="min-h-screen text-[var(--foreground)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--header-footer)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-8">
          <Link
            className="text-sm font-semibold text-[var(--foreground)] transition hover:text-[var(--accent)]"
            href={`/${lang}#projetos`}
          >
            {projectPage.back}
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              className={outlineButtonClass}
              href={`/${otherLang}/projects/${project.slug}`}
              hrefLang={otherLang}
              aria-label={header.switchLangLabel}
            >
              {header.switchLang}
            </Link>
            <ThemeButton
              className={outlineButtonClass}
              toDark={header.themeToDark}
              toLight={header.themeToLight}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:px-6 md:py-14 lg:px-14">
        <section className="grid gap-8 rounded-3xl border border-[var(--border)] bg-[var(--section)] p-5 shadow-[0_20px_80px_-60px_rgba(58,49,43,0.22)] md:grid-cols-[1fr_224px] md:items-center md:p-12">
          <div className="space-y-5">
            <span className="block h-1 w-16 rounded-full bg-[var(--draw)]" aria-hidden="true" />
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              <span className="h-2 w-2 rounded-full bg-[var(--draw)]" />
              {projectsDict.statuses[project.status]}
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{text.title}</h1>
            <p className="max-w-2xl text-lg text-[var(--muted)]">{text.summary}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="sr-only">{projectPage.stack}:</span>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border-2 border-[var(--draw)] px-3 py-1 text-xs text-[var(--foreground)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            {project.link && (
              <a
                className="inline-flex rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--cta-text)] shadow-sm transition-transform duration-200 hover:-translate-y-[1px] hover:shadow-md hover:brightness-95"
                href={project.link.href}
                target="_blank"
                rel="noreferrer"
              >
                {project.link.kind === "repo" ? projectPage.repo : projectPage.site}
              </a>
            )}
          </div>
          <div className="mx-auto h-24 w-24 md:h-56 md:w-56">
            <ProjectVisual motif={project.motif} />
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            [projectPage.context, text.context],
            [projectPage.role, text.role],
          ].map(([title, body]) => (
            <section key={title} className={`space-y-2 ${cardClass}`}>
              <h2 className={eyebrowClass}>{title}</h2>
              <p className="leading-relaxed text-[var(--foreground)]">{body}</p>
            </section>
          ))}
        </div>

        <section className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--section)] p-5 md:p-8">
          <h2 className="text-2xl font-semibold">{projectPage.decisions}</h2>
          <ol className="grid gap-4 md:grid-cols-2">
            {text.decisions.map((decision, index) => (
              <li key={decision.title} className={`space-y-2 ${cardClass}`}>
                <span className="font-mono text-xs text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold">{decision.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">{decision.why}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-stretch">
          <section className={`space-y-2 ${cardClass}`}>
            <h2 className={eyebrowClass}>{projectPage.status}</h2>
            <p className="text-[var(--foreground)]">{text.status}</p>
          </section>
          <Link
            data-project={next.slug}
            className={`group flex flex-col justify-center gap-1 transition hover:border-[var(--accent)] ${cardClass}`}
            href={`/${lang}/projects/${next.slug}`}
          >
            <span className={eyebrowClass}>{projectPage.next}</span>
            <span className="flex items-center gap-2 text-lg font-semibold group-hover:text-[var(--accent)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              {next[lang].title} →
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
