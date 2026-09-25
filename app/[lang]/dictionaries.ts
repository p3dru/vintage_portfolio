export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

const pt = {
  meta: {
    title: "João Pedro — Portfólio",
    description:
      "Desenvolvedor de software com foco em requisitos, produto e IA aplicada com método e auditoria.",
  },
  htmlLang: "pt-BR",
  header: {
    role: "Desenvolvedor de Software · Requisitos & Produto",
    avatarAlt: "Avatar de João Pedro",
    themeToDark: "Tema escuro",
    themeToLight: "Tema claro",
    menu: "Menu",
    close: "Fechar",
    switchLang: "EN",
    switchLangLabel: "Switch to English",
  },
  nav: [
    { id: "inicio", label: "Início" },
    { id: "projetos", label: "Projetos" },
    { id: "fundamentos", label: "Fundamentos" },
    { id: "ia", label: "IA" },
    { id: "sobre", label: "Sobre" },
    { id: "contato", label: "Contato" },
  ],
  hero: {
    eyebrow: "Portfólio — v2026.2",
    titleStart: "Engenharia,",
    and: "e",
    ai: "IA",
    titleEnd: "aplicadas para entregar produtos com clareza e ritmo.",
    lead: "Desenvolvo software e cuido do caminho até ele: entender o problema, levantar e validar requisitos, construir e revisar o que vai para produção. Uso IA como ferramenta de trabalho, com método e auditoria, não como atalho.",
    ctaProjects: "Ver projetos",
    ctaContact: "Contato direto",
    availability: {
      label: "Disponibilidade",
      title: "Novos projetos",
      text: "MVPs, replatform, automação e auditoria de código.",
    },
    stack: {
      label: "Stack preferida",
      title: "Python & PostgreSQL first",
      text: "React/Next.js, Vue, FastAPI e NestJS.",
    },
    highlights: {
      label: "Diferenciais",
      items: [
        "Discovery ágil",
        "Requisitos validados",
        "UX objetiva",
        "Docs leves",
        "Entrega contínua",
        "IA com auditoria",
      ],
    },
  },
  projects: {
    eyebrow: "Projetos",
    title: "Soluções construídas com foco técnico",
    previous: "Portfólio anterior ↗",
    cardLabel: "Projeto",
    view: "Ver ↗",
    items: [
      {
        title: "DisasterScan",
        summary:
          "Plataforma para monitoramento, previsão e mitigação de desastres naturais, integrando múltiplas fontes de dados para apoiar a decisão estratégica. Indicadores, alertas e dashboards analíticos para riscos ambientais.",
        tags: ["FastAPI", "Next.js", "PostgreSQL"],
        link: "https://icognitiva.com/disasterscan",
      },
      {
        title: "Atlas Basis (Motor de Otimização Logística 3D)",
        summary:
          "Plataforma de orquestração logística e roteamento tático 3D. Distribui rotas para múltiplas frotas com clustering K-Means e algoritmos TSP. Processamento e integração OSRM rodam em Web Workers (client-side), mantendo as simulações 3D consistentes.",
        tags: ["Vue 3", "MapLibre", "OSRM", "Web Workers"],
        link: "https://atlasbasis.vercel.app/",
      },
      {
        title: "Mini Lakehouse Agro",
        summary:
          "Plataforma analítica end-to-end em Arquitetura Medallion, focada no agronegócio brasileiro. Pipelines ETL orquestrados unificam fontes públicas (clima, safras e mercado financeiro) e alimentam um motor de correlação estatística exposto em dashboards interativos.",
        tags: ["Kestra", "FastAPI", "DuckDB", "Next.js"],
        link: "https://github.com/p3dru/agro-datalake/tree/main",
      },
      {
        title: "LibreETL",
        summary:
          "Plataforma client-side (zero-backend) para tratamento visual de dados. Limpeza e transformação de datasets direto no navegador, sem código, com motor de diagnóstico e privacidade garantida pela arquitetura local-first.",
        tags: ["Next.js", "Dexie.js", "Zod"],
        link: "https://libre-etl.vercel.app/",
      },
      {
        title: "Classificação de Grãos com Visão Computacional",
        summary:
          "Sistema de IA para segmentar e classificar grãos agrícolas (defeituosos, danificados e saudáveis), com pipeline de imagens, extração de características e análise de desempenho. Integra backend, banco e app mobile para uso prático.",
        tags: ["YOLO", "Flutter", "PostgreSQL"],
        link: "",
        status: "dev",
      },
      {
        title: "Site Institucional – Programa PPGZT",
        summary:
          "Site institucional para divulgação acadêmica, com organização de conteúdo, arquivos, painel administrativo e suporte a PT/EN via i18n.",
        tags: ["NestJS", "React", "PostgreSQL"],
        link: "",
        status: "offline",
      },
    ] as { title: string; summary: string; tags: string[]; link: string; status?: "dev" | "offline" }[],
  },
  modal: {
    label: "Aviso",
    close: "Fechar",
    dev: {
      title: "Projeto em desenvolvimento",
      text: "Este projeto ainda não foi disponibilizado. Se quiser saber mais, entre em contato e compartilho o que for possível sobre a versão mais recente.",
    },
    offline: {
      title: "Sistema indisponível",
      text: "O sistema foi retirado do ar após o fim do contrato de hospedagem. Se quiser detalhes técnicos sobre como foi construído, fique à vontade para entrar em contato.",
    },
  },
  foundations: {
    eyebrow: "Fundamentos",
    title: "O que sustenta as entregas",
    seenIn: "Aplicado em",
    groups: [
      {
        title: "Produto & Requisitos",
        items: [
          "Discovery, entrevistas e mapeamento de fluxos para priorizar o que importa",
          "Levantamento, escrita e validação de requisitos com quem usa o sistema",
          "Protótipos, critérios de aceite e documentação enxuta para o handoff",
        ],
        tags: ["Figma", "Notion", "Trello"],
        projects: ["DisasterScan", "PPGZT"],
      },
      {
        title: "Engenharia de Software",
        items: [
          "Frontends em React/Next.js e Vue com foco em acessibilidade e desempenho",
          "APIs com FastAPI, NestJS e Django, autenticação e bancos relacionais",
          "Arquitetura local-first e Web Workers quando o problema pede",
        ],
        tags: ["TypeScript", "Next.js", "Vue 3", "FastAPI", "NestJS", "Git & CI/CD"],
        projects: ["Atlas Basis", "LibreETL", "PPGZT"],
      },
      {
        title: "Dados",
        items: [
          "Arquitetura Medallion e pipelines ETL orquestrados",
          "Modelagem analítica em PostgreSQL e DuckDB",
          "Validação e diagnóstico de qualidade de dados",
        ],
        tags: ["PostgreSQL", "DuckDB", "Kestra", "MongoDB"],
        projects: ["Mini Lakehouse Agro", "LibreETL"],
      },
      {
        title: "IA aplicada",
        items: [
          "Visão computacional: segmentação e classificação de imagens",
          "Agentes, MCP e RAG aplicados ao fluxo de desenvolvimento",
          "Avaliação de comportamento (evals) e revisão de código gerado por IA",
        ],
        tags: ["YOLO", "TensorFlow/Keras", "MCP", "RAG"],
        projects: ["Classificação de Grãos", "Ai BuildCore"],
      },
    ],
  },
  ai: {
    eyebrow: "IA no desenvolvimento",
    title: "Como desenvolvo com IA sem abrir mão do controle",
    intro:
      "IA acelera, mas não decide sozinha. Uso agentes dentro de um processo com etapas claras, em que cada saída é revisada e testada antes de seguir adiante.",
    steps: [
      {
        title: "Especificação",
        text: "Antes de gerar código, defino o problema, os requisitos e os critérios de aceite. Contexto bem definido vale mais que um prompt elaborado.",
      },
      {
        title: "Geração guiada",
        text: "Agentes trabalham com regras, skills e contexto do projeto carregados via MCP, em tarefas pequenas e de escopo fechado.",
      },
      {
        title: "Revisão humana",
        text: "Leio cada diff. Código que eu não entendo não entra.",
      },
      {
        title: "Testes e verificação",
        text: "Lint, tipos, build, testes e hooks confirmam o comportamento, não só a aparência.",
      },
      {
        title: "Auditoria",
        text: "Revisão de segurança, qualidade e complexidade desnecessária antes da entrega.",
      },
    ],
    audit: {
      title: "Auditoria de código",
      text: "Quando autorizado, audito código de terceiros e aplicações construídas com IA: dependências, segurança, duplicações, abstrações sem uso e aderência aos requisitos. Código gerado por IA costuma falhar em silêncio, com validações ausentes e testes que só cobrem o caminho feliz. O resultado é um relatório com prioridades, não uma reescrita.",
    },
    buildcore: {
      badge: "Uso pessoal",
      title: "Ai BuildCore",
      text: "Nasceu como fork do ia-kit (vudovn/ag-kit) e virou meu núcleo de engenharia com IA. Roteia cada pedido para o agente e as skills adequados, leva esse conhecimento a outros projetos via MCP, usa RAG para consultar as próprias regras e roda evals (LLM-as-judge) para verificar se os agentes seguem o que foi definido. Novas skills só entram com aprovação humana.",
      stats: [
        { value: "25", label: "agentes" },
        { value: "62", label: "skills" },
        { value: "17", label: "workflows" },
      ],
    },
  },
  about: {
    eyebrow: "Sobre",
    title: "João Pedro — desenvolvedor de software com olhar para produto",
    paragraphs: [
      "Olá, me chamo João Pedro. Gosto de acompanhar o ciclo inteiro, da descoberta à entrega. Comecei pelo produto e pelo front-end, segui para o full-stack, passei pela engenharia de dados e hoje aplico IA tanto nos produtos quanto na forma de construí-los.",
      "No dia a dia, tenho facilidade em me comunicar com times e clientes, priorizar e adaptar soluções em andamento sem perder prazo nem qualidade. Colaborar e resolver conflitos fazem parte do trabalho tanto quanto o código.",
      "Fora do código, você provavelmente me encontrará praticando esportes, desenhando, jogando ou mergulhado em leituras sobre tecnologia e ciências sociais.",
    ],
    exploringTitle: "O que estou explorando agora",
    exploring: [
      "Orquestração de agentes e evals",
      "Qualidade e auditoria de código gerado por IA",
      "Arquitetura local-first",
      "Engenharia de dados analítica",
    ],
  },
  contact: {
    eyebrow: "Contato",
    title: "Vamos falar sobre o próximo projeto?",
    text: "Aberto a colaborações, consultorias, auditorias de código e product labs.",
    imageAlt: "Roteiro rápido de trabalho",
  },
  footer: {
    label: "Portfólio",
    rights: "Todos os direitos (ainda não) reservados.",
  },
};

export type Dictionary = typeof pt;

const en: Dictionary = {
  meta: {
    title: "João Pedro — Portfolio",
    description:
      "Software developer focused on requirements, product and AI applied with method and auditing.",
  },
  htmlLang: "en",
  header: {
    role: "Software Developer · Requirements & Product",
    avatarAlt: "João Pedro's avatar",
    themeToDark: "Dark theme",
    themeToLight: "Light theme",
    menu: "Menu",
    close: "Close",
    switchLang: "PT",
    switchLangLabel: "Mudar para português",
  },
  nav: [
    { id: "inicio", label: "Home" },
    { id: "projetos", label: "Projects" },
    { id: "fundamentos", label: "Foundations" },
    { id: "ia", label: "AI" },
    { id: "sobre", label: "About" },
    { id: "contato", label: "Contact" },
  ],
  hero: {
    eyebrow: "Portfolio — v2026.2",
    titleStart: "Engineering,",
    and: "and",
    ai: "AI",
    titleEnd: "applied to ship products with clarity and pace.",
    lead: "I build software and take care of the path to it: understanding the problem, gathering and validating requirements, building and reviewing what goes to production. I use AI as a working tool, with method and auditing, not as a shortcut.",
    ctaProjects: "See projects",
    ctaContact: "Get in touch",
    availability: {
      label: "Availability",
      title: "New projects",
      text: "MVPs, replatforming, automation and code audits.",
    },
    stack: {
      label: "Preferred stack",
      title: "Python & PostgreSQL first",
      text: "React/Next.js, Vue, FastAPI and NestJS.",
    },
    highlights: {
      label: "Strengths",
      items: [
        "Lean discovery",
        "Validated requirements",
        "Objective UX",
        "Lightweight docs",
        "Continuous delivery",
        "Audited AI",
      ],
    },
  },
  projects: {
    eyebrow: "Projects",
    title: "Solutions built with a technical focus",
    previous: "Previous portfolio ↗",
    cardLabel: "Project",
    view: "View ↗",
    items: [
      {
        title: "DisasterScan",
        summary:
          "Platform for monitoring, forecasting and mitigating natural disasters, integrating multiple data sources to support strategic decisions. Indicators, alerts and analytical dashboards for environmental risks.",
        tags: ["FastAPI", "Next.js", "PostgreSQL"],
        link: "https://icognitiva.com/disasterscan",
      },
      {
        title: "Atlas Basis (3D Logistics Optimization Engine)",
        summary:
          "Logistics orchestration and 3D tactical routing platform. Distributes routes across multiple fleets using K-Means clustering and TSP algorithms. Processing and OSRM integration run in Web Workers (client-side), keeping 3D simulations consistent.",
        tags: ["Vue 3", "MapLibre", "OSRM", "Web Workers"],
        link: "https://atlasbasis.vercel.app/",
      },
      {
        title: "Mini Lakehouse Agro",
        summary:
          "End-to-end analytics platform built on a Medallion Architecture for Brazilian agribusiness. Orchestrated ETL pipelines unify public sources (weather, crops and financial markets) and feed a statistical correlation engine exposed through interactive dashboards.",
        tags: ["Kestra", "FastAPI", "DuckDB", "Next.js"],
        link: "https://github.com/p3dru/agro-datalake/tree/main",
      },
      {
        title: "LibreETL",
        summary:
          "Client-side (zero-backend) platform for visual data preparation. Cleans and transforms datasets right in the browser, no code needed, with a diagnostics engine and privacy guaranteed by a local-first architecture.",
        tags: ["Next.js", "Dexie.js", "Zod"],
        link: "https://libre-etl.vercel.app/",
      },
      {
        title: "Grain Classification with Computer Vision",
        summary:
          "AI system that segments and classifies agricultural grains (defective, damaged and healthy), with an image pipeline, feature extraction and performance analysis. Integrates backend, database and a mobile app for field use.",
        tags: ["YOLO", "Flutter", "PostgreSQL"],
        link: "",
        status: "dev",
      },
      {
        title: "Institutional Website – PPGZT Program",
        summary:
          "Institutional website for academic outreach, with content organization, file management, an admin panel and PT/EN support via i18n.",
        tags: ["NestJS", "React", "PostgreSQL"],
        link: "",
        status: "offline",
      },
    ],
  },
  modal: {
    label: "Notice",
    close: "Close",
    dev: {
      title: "Project in development",
      text: "This project hasn't been released yet. If you'd like to know more, get in touch and I'll share what I can about the latest version.",
    },
    offline: {
      title: "System unavailable",
      text: "The system was taken offline after its hosting contract ended. If you'd like technical details on how it was built, feel free to reach out.",
    },
  },
  foundations: {
    eyebrow: "Foundations",
    title: "What the work stands on",
    seenIn: "Applied in",
    groups: [
      {
        title: "Product & Requirements",
        items: [
          "Discovery, interviews and flow mapping to prioritize what matters",
          "Gathering, writing and validating requirements with the people who use the system",
          "Prototypes, acceptance criteria and lean documentation for handoff",
        ],
        tags: ["Figma", "Notion", "Trello"],
        projects: ["DisasterScan", "PPGZT"],
      },
      {
        title: "Software Engineering",
        items: [
          "React/Next.js and Vue frontends focused on accessibility and performance",
          "APIs with FastAPI, NestJS and Django, authentication and relational databases",
          "Local-first architecture and Web Workers when the problem calls for it",
        ],
        tags: ["TypeScript", "Next.js", "Vue 3", "FastAPI", "NestJS", "Git & CI/CD"],
        projects: ["Atlas Basis", "LibreETL", "PPGZT"],
      },
      {
        title: "Data",
        items: [
          "Medallion Architecture and orchestrated ETL pipelines",
          "Analytical modeling in PostgreSQL and DuckDB",
          "Data quality validation and diagnostics",
        ],
        tags: ["PostgreSQL", "DuckDB", "Kestra", "MongoDB"],
        projects: ["Mini Lakehouse Agro", "LibreETL"],
      },
      {
        title: "Applied AI",
        items: [
          "Computer vision: image segmentation and classification",
          "Agents, MCP and RAG applied to the development workflow",
          "Behavioral evaluation (evals) and review of AI-generated code",
        ],
        tags: ["YOLO", "TensorFlow/Keras", "MCP", "RAG"],
        projects: ["Grain Classification", "Ai BuildCore"],
      },
    ],
  },
  ai: {
    eyebrow: "AI in development",
    title: "How I build with AI without giving up control",
    intro:
      "AI speeds things up, but it doesn't decide on its own. I use agents inside a process with clear steps, where every output is reviewed and tested before moving on.",
    steps: [
      {
        title: "Specification",
        text: "Before generating code, I define the problem, the requirements and the acceptance criteria. Well-defined context is worth more than an elaborate prompt.",
      },
      {
        title: "Guided generation",
        text: "Agents work with rules, skills and project context loaded through MCP, on small, tightly scoped tasks.",
      },
      {
        title: "Human review",
        text: "I read every diff. Code I don't understand doesn't get in.",
      },
      {
        title: "Tests and checks",
        text: "Lint, types, build, tests and hooks confirm behavior, not just appearance.",
      },
      {
        title: "Audit",
        text: "Security, quality and unnecessary-complexity review before delivery.",
      },
    ],
    audit: {
      title: "Code audits",
      text: "When authorized, I audit third-party code and applications built with AI: dependencies, security, duplication, unused abstractions and adherence to requirements. AI-generated code tends to fail silently, with missing validation and tests that only cover the happy path. The outcome is a prioritized report, not a rewrite.",
    },
    buildcore: {
      badge: "Personal use",
      title: "Ai BuildCore",
      text: "It started as a fork of ia-kit (vudovn/ag-kit) and became my AI engineering core. It routes each request to the right agent and skills, brings that knowledge into other projects through MCP, uses RAG to query its own rules and runs evals (LLM-as-judge) to check that agents follow what was defined. New skills only get in with human approval.",
      stats: [
        { value: "25", label: "agents" },
        { value: "62", label: "skills" },
        { value: "17", label: "workflows" },
      ],
    },
  },
  about: {
    eyebrow: "About",
    title: "João Pedro — software developer with a product mindset",
    paragraphs: [
      "Hi, I'm João Pedro. I like following the whole cycle, from discovery to delivery. I started with product and front-end, moved to full-stack, went through data engineering and today I apply AI both in products and in the way I build them.",
      "Day to day, I communicate easily with teams and clients, prioritize and adapt solutions mid-course without losing deadlines or quality. Collaborating and resolving conflicts are as much part of the job as the code.",
      "Away from code, you'll probably find me playing sports, drawing, gaming or deep into reading about technology and the social sciences.",
    ],
    exploringTitle: "What I'm exploring now",
    exploring: [
      "Agent orchestration and evals",
      "Quality and auditing of AI-generated code",
      "Local-first architecture",
      "Analytical data engineering",
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Shall we talk about your next project?",
    text: "Open to collaborations, consulting, code audits and product labs.",
    imageAlt: "Quick work roadmap",
  },
  footer: {
    label: "Portfolio",
    rights: "All rights (not yet) reserved.",
  },
};

export const getDictionary = (lang: Locale) => (lang === "en" ? en : pt);
