import Link from 'next/link';
import { Container } from '@/components/layout/Container';

export const metadata = {
  title: 'Resume',
  description: 'M. Saad Asad resume.',
};

export default function ResumePage() {
  return (
    <Container className="py-24">
      <div className="concrete-block concrete-edge concrete-header">
        <div>
          <h1 className="text-heading font-mono font-bold text-concrete-900 tracking-tight">
            RESUME
          </h1>
          <div className="section-divider" />
        </div>
      </div>

      <div className="concrete-block concrete-edge p-8 md:p-10">
        <header className="space-y-4 border-b border-concrete-400/60 pb-8">
          <h2 className="font-mono text-2xl text-concrete-900 tracking-tight">
            M. Saad Asad
          </h2>
          <div className="flex flex-col gap-2 font-mono text-[0.75rem] text-concrete-700 md:flex-row md:flex-wrap md:items-center">
            <span>San Francisco, CA</span>
            <span className="hidden md:inline">|</span>
            <span>+1 (415) 377 8504</span>
            <span className="hidden md:inline">|</span>
            <span>saadasad163@gmail.com</span>
            <span className="hidden md:inline">|</span>
            <Link
              href="https://www.linkedin.com/in/saad-asad-836b82216/"
              className="text-[#0000EE] hover:underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </Link>
            <span className="hidden md:inline">|</span>
            <Link
              href="https://medium.com/@msaadasad"
              className="text-[#0000EE] hover:underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Medium
            </Link>
            <span className="hidden md:inline">|</span>
            <Link
              href="https://github.com/MSaadAsad"
              className="text-[#0000EE] hover:underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
          </div>
        </header>

        <section className="mt-10 space-y-6">
          <h3 className="font-mono text-[0.65rem] text-concrete-600 tracking-[0.25em]">
            EDUCATION
          </h3>
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-mono text-base text-concrete-900">
                Minerva University
              </p>
              <p className="font-serif text-base text-concrete-700">
                B.Sc Computer Science: Data Science | GPA: 3.81
              </p>
              <ul className="list-disc pl-5 font-serif text-sm text-concrete-600 space-y-1 mt-2">
                <li>
                  Global program across 7 world cities; ranked #1 most innovative
                  university globally (WURI).
                </li>
                <li>
                  Courses: Machine Learning, Artificial Intelligence, Bayesian
                  Inference, Software Engineering, Financial Modeling, Marketing and
                  Product Analysis, Economics, Data Structures and Algorithms,
                  Statistics, Calculus I and II, Linear Algebra.
                </li>
              </ul>
            </div>
            <div className="font-mono text-[0.75rem] text-concrete-600 md:text-right">
              <div>San Francisco, CA</div>
              <div>May 2025</div>
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <h3 className="font-mono text-[0.65rem] text-concrete-600 tracking-[0.25em]">
            EXPERIENCE
          </h3>

          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-mono text-base text-concrete-900">
                  TaxGPT (Research and Engineering Team)
                </p>
                <p className="font-serif text-base text-concrete-700">
                  Founding Engineer
                </p>
              </div>
              <div className="font-mono text-[0.75rem] text-concrete-600 md:text-right">
                <div>San Francisco, CA</div>
                <div>July 2024 - Current</div>
              </div>
            </div>
            <ul className="list-disc pl-5 font-serif text-sm text-concrete-700 space-y-2">
              <li>
                Designed and built TaxGPT&apos;s (YC W24) scalable AI tax research
                agent, enabling 30x growth in the weekly active tax-professional
                user base to 3,000+.
              </li>
              <li>
                Built large-scale tax law and CFR knowledge-integration retrieval
                pipelines for production-grade legal research.
              </li>
              <li>
                Developed &ldquo;Agent Andrew,&rdquo; an autonomous reviewer that
                analyzes ~500-page tax filings to surface compliance risks.
              </li>
              <li>
                Led R&amp;D on agentic workflows, retrieval methods, and reasoning
                evaluation, improving reliability and trust in AI-driven tax
                analysis.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-mono text-base text-concrete-900">
                  Womp Labs (Research Team)
                </p>
                <p className="font-serif text-base text-concrete-700">
                  Machine Learning Intern
                </p>
              </div>
              <div className="font-mono text-[0.75rem] text-concrete-600 md:text-right">
                <div>San Francisco, CA</div>
                <div>June 2024 - July 2024</div>
              </div>
            </div>
            <ul className="list-disc pl-5 font-serif text-sm text-concrete-700 space-y-2">
              <li>
                Conducted research on model-agnostic data attribution for CV and
                NLP, benchmarking interpretability methods across architectures.
              </li>
              <li>
                Trained ResNet-18/34/50 on ImageNet-1k and GPT-2 on FineWeb,
                optimizing 8xA100 training workflows with FFCV for high-throughput
                experimentation.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-mono text-base text-concrete-900">
                  Universidad Abierta Interamericana (CAETI)
                </p>
                <p className="font-serif text-base text-concrete-700">
                  Machine Learning Research Intern
                </p>
              </div>
              <div className="font-mono text-[0.75rem] text-concrete-600 md:text-right">
                <div>Buenos Aires, Argentina</div>
                <div>Sep 2023 - Dec 2023</div>
              </div>
            </div>
            <ul className="list-disc pl-5 font-serif text-sm text-concrete-700 space-y-2">
              <li>
                Researched rule-extraction methods for interpretable deep learning,
                benchmarking the RxREN algorithm across CV datasets and architectures,
                achieving 96% fidelity in converting black-box models into symbolic
                rule systems.
              </li>
              <li>
                Optimized explainability performance through hyperparameter and
                architecture comparisons.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-mono text-base text-concrete-900">
                  World Wildlife Fund (Data and Technology Team)
                </p>
                <p className="font-serif text-base text-concrete-700">
                  Data Science Intern
                </p>
              </div>
              <div className="font-mono text-[0.75rem] text-concrete-600 md:text-right">
                <div>San Francisco, CA</div>
                <div>June 2023 - Aug 2023</div>
              </div>
            </div>
            <ul className="list-disc pl-5 font-serif text-sm text-concrete-700 space-y-2">
              <li>
                Engineered Django REST APIs and data pipelines to automate partner
                data submissions and normalize unstructured geospatial and tabular
                inputs into unified database schemas.
              </li>
              <li>
                Implemented CI/CD pipelines for Azure deployment, ensuring reliable,
                scalable, and consistent data ingestion.
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <h3 className="font-mono text-[0.65rem] text-concrete-600 tracking-[0.25em]">
            PROJECTS
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-mono text-base text-concrete-900">
                  StarcAI (Co-founder)
                </p>
                <p className="font-serif text-sm text-concrete-700">
                  Built an AI platform with custom LLM/NLP pipelines to analyze
                  MD&amp;A sections of 10-K/10-Q filings and perform sentiment
                  analysis to generate risk-aware financial signals.
                </p>
              </div>
              <div className="font-mono text-[0.75rem] text-concrete-600 md:text-right">
                March 2025
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-mono text-base text-concrete-900">
                  Hybrid GQA-MoD LLM
                </p>
                <p className="font-serif text-sm text-concrete-700">
                  Implemented the first hybrid of Grouped-Query Attention and
                  Mixture-of-Depths in a compact language model, achieving 70%
                  faster training with ~10% accuracy tradeoff compared to baseline
                  architectures.
                </p>
              </div>
              <div className="font-mono text-[0.75rem] text-concrete-600 md:text-right">
                April 2024
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <h3 className="font-mono text-[0.65rem] text-concrete-600 tracking-[0.25em]">
            SKILLS AND INTERESTS
          </h3>
          <ul className="list-disc pl-5 font-serif text-sm text-concrete-700 space-y-2">
            <li>
              <span className="font-mono text-concrete-900">Skills:</span> ML, AI
              Agents, Deep Learning, Bayesian Modeling, Distributed Systems,
              Backend Engineering, Knowledge Graphs
            </li>
            <li>
              <span className="font-mono text-concrete-900">Coding:</span> Python,
              PyTorch, Transformers, OpenAI Agents SDK, MCP, PyMC, Scikit-Learn,
              TypeScript, Django, Neo4j
            </li>
            <li>
              <span className="font-mono text-concrete-900">Languages:</span> English
              (Native), Urdu (Native), Spanish (Intermediate)
            </li>
          </ul>
        </section>
      </div>
    </Container>
  );
}
