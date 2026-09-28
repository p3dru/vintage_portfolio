import type { Locale } from "../dictionaries";

export type ProjectStatus = "live" | "opensource" | "prerelease" | "dev" | "offline" | "personal";

type Decision = { title: string; why: string };

type ProjectText = {
  title: string;
  summary: string;
  context: string;
  role: string;
  decisions: Decision[];
  status: string;
};

export type Motif = "rings" | "grid" | "strata" | "pipeline" | "grains" | "columns" | "network";

export type Project = {
  slug: string;
  tags: string[];
  link?: { href: string; kind: "site" | "repo" };
  status: ProjectStatus;
  motif: Motif;
} & Record<Locale, ProjectText>;

// Afirmações marcadas com foram inferidas e aguardam validação do autor.
export const projects: Project[] = [
  {
    slug: "disasterscan",
    tags: ["FastAPI", "Next.js", "PostgreSQL", "Kestra"],
    link: { href: "https://icognitiva.com/disasterscan", kind: "site" },
    status: "prerelease",
    motif: "rings",
    pt: {
      title: "DisasterScan",
      summary:
        "Plataforma para monitoramento, previsão e mitigação de riscos ambientais, integrando múltiplas fontes de dados para apoiar decisões estratégicas.",
      context:
        "Riscos ambientais envolvem dados espalhados em fontes diferentes, com formatos e ritmos de atualização distintos. O produto reúne essas fontes em indicadores, alertas e painéis que ajudam a decidir antes do problema acontecer.",
      role: "Atuo no desenvolvimento full-stack e na análise de requisitos: descoberta de fontes de dados e indicadores, estudos de caso, especificação e implementação dos módulos, incorporando novas adequações que surgem em entrevistas e rodadas técnicas.",
      decisions: [
        {
          title: "Discovery documentado antes do código",
          why: "Persona, job-to-be-done, jornada e proposta de valor são escritos e validados antes de cada módulo. Assim o que é construído responde a um problema confirmado, não a uma suposição.",
        },
        {
          title: "Ingestão pesada fora da API",
          why: "A coleta e o processamento de dados ambientais rodam em workers orquestrados, separados da API. A interface continua responsiva mesmo durante cargas longas.",
        },
        {
          title: "Homologação local e migrações versionadas",
          why: "Mudanças de banco passam por migrações versionadas e cada entrega é homologada localmente antes de produção, reduzindo surpresas no ambiente real.",
        },
        {
          title: "Documentação versionada em repositório próprio",
          why: "Requisitos, planos de implementação e decisões vivem em um repositório de documentação separado e versionado, com histórico de cada mudança. As regras para agentes de IA ficam ali também: a IA acelera a execução, mas trabalha dentro de limites escritos.",
        },
      ],
      status:
        "Em pré-release, com novos módulos em evolução. Detalhes de regras de negócio ficam de fora desta página.",
    },
    en: {
      title: "DisasterScan",
      summary:
        "Platform for monitoring, forecasting and mitigating environmental risks, integrating multiple data sources to support strategic decisions.",
      context:
        "Environmental risk data is scattered across sources with different formats and update cycles. The product brings those sources together into indicators, alerts and dashboards that help decide before the problem happens.",
      role: "I work on full-stack development and requirements analysis: discovering data sources and indicators, case studies, specifying and implementing modules, and incorporating new adjustments that come up in interviews and technical rounds.",
      decisions: [
        {
          title: "Documented discovery before code",
          why: "Persona, job-to-be-done, journey and value proposition are written and validated before each module, so what gets built answers a confirmed problem, not an assumption.",
        },
        {
          title: "Heavy ingestion outside the API",
          why: "Environmental data collection and processing run in orchestrated workers, separate from the API. The interface stays responsive even during long loads.",
        },
        {
          title: "Local staging and versioned migrations",
          why: "Database changes go through versioned migrations and every delivery is validated locally before production, reducing surprises in the real environment.",
        },
        {
          title: "Versioned documentation in its own repository",
          why: "Requirements, implementation plans and decisions live in a separate, versioned documentation repository, with a history of every change. Rules for AI agents live there too: AI speeds up execution but works within written limits.",
        },
      ],
      status: "In pre-release, with new modules evolving. Business rules are intentionally left out of this page.",
    },
  },
  {
    slug: "atlas-basis",
    tags: ["Vue 3", "TypeScript", "MapLibre", "OSRM", "Web Workers"],
    link: { href: "https://atlasbasis.vercel.app/", kind: "site" },
    status: "live",
    motif: "grid",
    pt: {
      title: "Atlas Basis",
      summary:
        "Motor de otimização logística com roteamento tático em mapa 3D, distribuindo rotas entre múltiplas frotas.",
      context:
        "Roteirizar entregas, coletas ou equipes de campo é um problema clássico (VRP/TSP) que cresce rápido com o número de pontos. O Atlas Basis é uma base genérica para esse tipo de solução, com visualização 3D e comparação de resultados.",
      role: "Concepção, arquitetura e desenvolvimento do projeto.",
      decisions: [
        {
          title: "Otimização em Web Workers",
          why: "Nearest Neighbor, 2-Opt, algoritmo genético e colônia de formigas rodam em threads paralelas. O mapa 3D e a interface não travam enquanto as rotas são calculadas.",
        },
        {
          title: "Agrupar antes de roteirizar",
          why: "K-Means divide os pontos entre os veículos antes do TSP. Cada frota resolve um problema menor, e o resultado fica mais previsível.",
        },
        {
          title: "Comparar, não confiar em um só algoritmo",
          why: "Um benchmark mostra a economia em km de cada abordagem. A escolha passa a ser baseada em medida, não em preferência.",
        },
        {
          title: "Base genérica",
          why: "Nada é acoplado a um tipo de operação: a mesma fundação serve entregas, coleta de resíduos ou equipes de serviço.",
        },
      ],
      status: "Publicado e acessível online.",
    },
    en: {
      title: "Atlas Basis",
      summary:
        "Logistics optimization engine with tactical routing on a 3D map, distributing routes across multiple fleets.",
      context:
        "Routing deliveries, pickups or field teams is a classic problem (VRP/TSP) that grows fast with the number of stops. Atlas Basis is a generic foundation for this kind of solution, with 3D visualization and result comparison.",
      role: "Concept, architecture and development of the project.",
      decisions: [
        {
          title: "Optimization in Web Workers",
          why: "Nearest Neighbor, 2-Opt, a genetic algorithm and ant colony optimization run in parallel threads. The 3D map and the interface don't freeze while routes are computed.",
        },
        {
          title: "Cluster before routing",
          why: "K-Means splits stops across vehicles before solving the TSP. Each fleet handles a smaller problem, and results become more predictable.",
        },
        {
          title: "Compare instead of trusting one algorithm",
          why: "A benchmark shows the distance saved by each approach, so the choice is based on measurement, not preference.",
        },
        {
          title: "Generic foundation",
          why: "Nothing is tied to one kind of operation: the same base serves deliveries, waste collection or service teams.",
        },
      ],
      status: "Published and available online.",
    },
  },
  {
    slug: "mini-lakehouse-agro",
    tags: ["Kestra", "DuckDB", "Iceberg", "FastAPI", "Next.js"],
    link: { href: "https://github.com/p3dru/agro-datalake", kind: "repo" },
    status: "opensource",
    motif: "strata",
    pt: {
      title: "Mini Lakehouse Agro",
      summary:
        "Plataforma analítica end-to-end em Arquitetura Medallion para o agronegócio brasileiro, do dado bruto ao insight.",
      context:
        "Clima, safra e preço se influenciam, mas os dados vivem em fontes públicas separadas. O projeto testa a hipótese clima → safra → preço para a soja do MATOPIBA, unificando essas fontes e medindo correlações estatísticas.",
      role: "Projeto pessoal de engenharia de dados, do desenho da arquitetura ao dashboard.",
      decisions: [
        {
          title: "Medallion (Bronze → Silver → Gold)",
          why: "Cada camada tem uma responsabilidade clara: guardar o bruto, limpar e padronizar, servir para análise. Reprocessar uma etapa não exige refazer tudo.",
        },
        {
          title: "DuckDB em vez de Spark",
          why: "Para volumes na casa de GBs, DuckDB roda em processo, lê Parquet direto do armazenamento e dispensa cluster. Menos infraestrutura para o mesmo resultado.",
        },
        {
          title: "Iceberg para dados incrementais",
          why: "Cotações chegam todo dia. Transações ACID, evolução de schema e carga incremental evitam recargas completas.",
        },
        {
          title: "Kestra em vez de Airflow",
          why: "Pipelines declarados em YAML, scripts em containers efêmeros e interface visual, sem o peso de manter DAGs em Python.",
        },
      ],
      status: "Código aberto; roda localmente com Docker.",
    },
    en: {
      title: "Mini Lakehouse Agro",
      summary:
        "End-to-end analytics platform built on a Medallion Architecture for Brazilian agribusiness, from raw data to insight.",
      context:
        "Weather, crops and prices influence each other, but the data lives in separate public sources. The project tests the weather → crop → price hypothesis for MATOPIBA soybeans by unifying those sources and measuring statistical correlations.",
      role: "Personal data engineering project, from architecture design to the dashboard.",
      decisions: [
        {
          title: "Medallion (Bronze → Silver → Gold)",
          why: "Each layer has a clear job: keep the raw data, clean and standardize it, serve it for analysis. Reprocessing one step doesn't mean redoing everything.",
        },
        {
          title: "DuckDB instead of Spark",
          why: "For data in the GB range, DuckDB runs in-process, reads Parquet straight from storage and needs no cluster. Less infrastructure for the same result.",
        },
        {
          title: "Iceberg for incremental data",
          why: "Market quotes arrive daily. ACID transactions, schema evolution and incremental loads avoid full reloads.",
        },
        {
          title: "Kestra instead of Airflow",
          why: "Pipelines declared in YAML, scripts in ephemeral containers and a visual UI, without the weight of maintaining Python DAGs.",
        },
      ],
      status: "Open source; runs locally with Docker.",
    },
  },
  {
    slug: "libreetl",
    tags: ["Next.js", "TypeScript", "Dexie.js", "Zod", "Web Workers"],
    link: { href: "https://libre-etl.vercel.app/", kind: "site" },
    status: "live",
    motif: "pipeline",
    pt: {
      title: "LibreETL",
      summary:
        "Plataforma de tratamento visual de dados que roda inteira no navegador, sem backend e sem código.",
      context:
        "Limpar uma planilha costuma exigir scripts ou enviar dados sensíveis para um serviço externo. O LibreETL faz diagnóstico, limpeza, transformação e junção de datasets localmente, sem que o arquivo saia da máquina.",
      role: "Concepção e desenvolvimento do projeto, a partir de problemas que observei no meu dia a dia de trabalho.",
      decisions: [
        {
          title: "Zero-backend como requisito de privacidade",
          why: "Sem servidor não há dado trafegando nem armazenado fora do navegador. A privacidade vem da arquitetura, não de uma promessa.",
        },
        {
          title: "Parsing em Web Workers",
          why: "Arquivos CSV e Excel grandes são convertidos fora da thread principal, então a interface não congela durante o upload.",
        },
        {
          title: "Persistência local com IndexedDB",
          why: "Datasets e histórico ficam salvos no navegador. Fechar a aba não significa perder o trabalho.",
        },
        {
          title: "Pipeline não destrutivo e receitas",
          why: "Cada transformação gera uma nova etapa sem alterar o original, e o pipeline pode ser salvo como receita JSON para relatórios recorrentes.",
        },
      ],
      status: "Publicado e acessível online, em PT, EN e ES.",
    },
    en: {
      title: "LibreETL",
      summary:
        "Visual data preparation platform that runs entirely in the browser, with no backend and no code.",
      context:
        "Cleaning a spreadsheet usually requires scripts or sending sensitive data to an external service. LibreETL diagnoses, cleans, transforms and joins datasets locally, without the file ever leaving the machine.",
      role: "Concept and development of the project, born from problems I observed in my day-to-day work.",
      decisions: [
        {
          title: "Zero-backend as a privacy requirement",
          why: "No server means no data in transit or stored outside the browser. Privacy comes from the architecture, not from a promise.",
        },
        {
          title: "Parsing in Web Workers",
          why: "Large CSV and Excel files are converted off the main thread, so the interface doesn't freeze during upload.",
        },
        {
          title: "Local persistence with IndexedDB",
          why: "Datasets and history are saved in the browser. Closing the tab doesn't mean losing the work.",
        },
        {
          title: "Non-destructive pipeline and recipes",
          why: "Each transformation adds a step without changing the original, and the pipeline can be saved as a JSON recipe for recurring reports.",
        },
      ],
      status: "Published and available online, in PT, EN and ES.",
    },
  },
  {
    slug: "grain-classification",
    tags: ["YOLO", "Flutter", "PostgreSQL"],
    status: "dev",
    motif: "grains",
    pt: {
      title: "Classificação de Grãos",
      summary:
        "Sistema de visão computacional para segmentar e classificar grãos agrícolas em defeituosos, danificados e saudáveis.",
      context:
        "A classificação de grãos ainda depende muito de inspeção visual manual, lenta e sujeita a variação entre avaliadores. O sistema propõe apoiar essa etapa com IA, do registro da imagem ao resultado.",
      role: "Pipeline de imagens, treinamento e avaliação do modelo, e integração com backend e app.",
      decisions: [
        {
          title: "Segmentar antes de classificar",
          why: "Isolar cada grão na imagem permite classificar individualmente e contar por categoria, em vez de dar um único rótulo para a amostra inteira.",
        },
        {
          title: "App mobile para uso em campo",
          why: "A captura acontece onde o grão está. Um app Flutter leva o fluxo para o celular sem depender de equipamento dedicado.",
        },
        {
          title: "Resultados persistidos para análise",
          why: "Cada avaliação fica registrada em PostgreSQL, permitindo acompanhar desempenho do modelo e histórico das amostras.",
        },
      ],
      status: "Em desenvolvimento; ainda não disponibilizado publicamente.",
    },
    en: {
      title: "Grain Classification",
      summary:
        "Computer vision system that segments and classifies agricultural grains as defective, damaged or healthy.",
      context:
        "Grain grading still relies heavily on manual visual inspection, which is slow and varies between evaluators. The system aims to support this step with AI, from capturing the image to the result.",
      role: "Image pipeline, model training and evaluation, and integration with the backend and app.",
      decisions: [
        {
          title: "Segment before classifying",
          why: "Isolating each grain in the image allows classifying them individually and counting per category, instead of a single label for the whole sample.",
        },
        {
          title: "Mobile app for field use",
          why: "Capture happens where the grain is. A Flutter app brings the flow to a phone without dedicated equipment.",
        },
        {
          title: "Persisted results for analysis",
          why: "Each evaluation is stored in PostgreSQL, making it possible to track model performance and sample history.",
        },
      ],
      status: "In development; not publicly released yet.",
    },
  },
  {
    slug: "ppgzt",
    tags: ["NestJS", "React", "PostgreSQL", "i18n"],
    status: "offline",
    motif: "columns",
    pt: {
      title: "Site Institucional",
      summary:
        "Site institucional para divulgação acadêmica de um programa de pós-graduação, com painel administrativo e suporte a PT/EN.",
      context:
        "Programas de pós-graduação precisam publicar editais, documentos e notícias com frequência, para públicos nacionais e estrangeiros. O site organiza esse conteúdo e o torna fácil de manter.",
      role: "Levantamento de requisitos com o programa e desenvolvimento full-stack.",
      decisions: [
        {
          title: "Painel administrativo próprio",
          why: "A equipe do programa publica e atualiza conteúdo sem depender de um desenvolvedor para cada mudança.",
        },
        {
          title: "Internacionalização desde o início",
          why: "PT e EN foram previstos na estrutura, e não adicionados depois, o que evita retrabalho em rotas e conteúdo.",
        },
        {
          title: "API separada do frontend",
          why: "NestJS e React desacoplados permitem evoluir interface e regras de conteúdo de forma independente.",
        },
      ],
      status: "Fora do ar após o fim do contrato de hospedagem.",
    },
    en: {
      title: "Institutional Website",
      summary:
        "Institutional website for a graduate program's academic outreach, with an admin panel and PT/EN support.",
      context:
        "Graduate programs need to publish calls, documents and news frequently, for both national and international audiences. The site organizes this content and keeps it easy to maintain.",
      role: "Requirements gathering with the program and full-stack development.",
      decisions: [
        {
          title: "Dedicated admin panel",
          why: "The program's team publishes and updates content without needing a developer for every change.",
        },
        {
          title: "Internationalization from day one",
          why: "PT and EN were built into the structure rather than added later, avoiding rework in routes and content.",
        },
        {
          title: "API separate from the frontend",
          why: "Decoupled NestJS and React let the interface and content rules evolve independently.",
        },
      ],
      status: "Offline after the hosting contract ended.",
    },
  },
  {
    slug: "ai-buildcore",
    tags: ["MCP", "RAG", "Evals", "Python", "Next.js"],
    status: "personal",
    motif: "network",
    pt: {
      title: "Ai BuildCore",
      summary:
        "Meu núcleo pessoal de engenharia com IA: agentes, skills e workflows versionados como código e servidos a qualquer projeto via MCP.",
      context:
        "Nasceu como fork do ia-kit (vudovn/ag-kit). Prompts soltos se perdem e cada ferramenta de IA tem seu formato. Precisava de uma fonte única de regras e conhecimento que funcionasse em qualquer projeto e qualquer modelo.",
      role: "Evoluí o fork para uma arquitetura própria e mantenho o núcleo para uso pessoal.",
      decisions: [
        {
          title: "Docs-as-code como fonte única",
          why: "Agentes, skills e workflows são arquivos versionados no repositório. Mudou a regra, mudou o comportamento, com histórico no git.",
        },
        {
          title: "MCP para levar o conhecimento a outros projetos",
          why: "Em vez de copiar pastas de configuração, cada projeto consulta o núcleo via MCP. Atualizar uma skill vale para todos.",
        },
        {
          title: "RAG para consultar as próprias regras",
          why: "Com 60+ skills, carregar tudo no contexto não escala. Uma busca semântica traz só o trecho relevante para a tarefa.",
        },
        {
          title: "Evals e governança humana",
          why: "Evals do tipo LLM-as-judge verificam se os agentes seguem as regras, e novas skills só entram com aprovação humana.",
        },
      ],
      status: "Uso pessoal; o repositório não é público.",
    },
    en: {
      title: "Ai BuildCore",
      summary:
        "My personal AI engineering core: agents, skills and workflows versioned as code and served to any project through MCP.",
      context:
        "It started as a fork of ia-kit (vudovn/ag-kit). Loose prompts get lost and each AI tool has its own format. I needed a single source of rules and knowledge that would work in any project and with any model.",
      role: "I evolved the fork into my own architecture and maintain the core for personal use.",
      decisions: [
        {
          title: "Docs-as-code as the single source",
          why: "Agents, skills and workflows are versioned files in the repository. Change the rule, change the behavior, with history in git.",
        },
        {
          title: "MCP to bring knowledge into other projects",
          why: "Instead of copying config folders, each project queries the core through MCP. Updating a skill applies everywhere.",
        },
        {
          title: "RAG to query its own rules",
          why: "With 60+ skills, loading everything into context doesn't scale. Semantic search brings only the passage relevant to the task.",
        },
        {
          title: "Evals and human governance",
          why: "LLM-as-judge evals check that agents follow the rules, and new skills only get in with human approval.",
        },
      ],
      status: "Personal use; the repository is not public.",
    },
  },
];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);

