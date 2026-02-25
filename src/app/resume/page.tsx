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
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-10 h-fit">
            <div className="space-y-4">
              <h2 className="font-mono text-2xl text-concrete-900 tracking-tight">
                M. Saad Asad
              </h2>
              <div className="space-y-2 font-mono text-[0.75rem] text-concrete-700">
                <div>San Francisco, CA</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-[0.65rem] text-concrete-600 tracking-[0.25em]">
                SKILLS
              </h3>
              <div className="space-y-3 font-serif text-sm text-concrete-700">
                <div>
                  <span className="font-mono text-concrete-900">Skills:</span> ML, AI
                  Agents, Deep Learning, Bayesian Modeling, Distributed Systems,
                  Backend Engineering, Knowledge Graphs
                </div>
                <div>
                  <span className="font-mono text-concrete-900">Coding:</span> Python,
                  PyTorch, Transformers, OpenAI Agents SDK, MCP, PyMC, Scikit-Learn,
                  TypeScript, Django, Neo4j
                </div>
                <div>
                  <span className="font-mono text-concrete-900">Languages:</span> English
                  (Native), Urdu (Native), Spanish (Intermediate)
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-12">
            <section className="space-y-6">
              <h3 className="font-mono text-[0.65rem] text-concrete-600 tracking-[0.25em]">
                EDUCATION
              </h3>
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-mono text-base text-concrete-900">
                    <Link
                      href="https://www.minerva.edu/"
                      className="text-[#0000EE] hover:underline underline-offset-4"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Minerva University
                    </Link>
                  </p>
                  <p className="font-serif text-base text-concrete-700">
                    B.Sc Computer Science: Data Science | GPA: 3.81
                  </p>
                  <ul className="list-disc pl-5 font-serif text-sm text-concrete-600 space-y-1 mt-2">
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

            <section className="space-y-6">
              <h3 className="font-mono text-[0.65rem] text-concrete-600 tracking-[0.25em]">
                EXPERIENCE
              </h3>

              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-mono text-base text-concrete-900">
                      <Link
                        href="https://www.taxgpt.com/"
                        className="text-[#0000EE] hover:underline underline-offset-4"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        TaxGPT
                      </Link>{' '}
                      (Research and Engineering Team)
                    </p>
                    <p className="font-serif text-base text-concrete-700">
                      Research Scientist
                    </p>
                  </div>
                  <div className="font-mono text-[0.75rem] text-concrete-600 md:text-right">
                    <div>San Francisco, CA</div>
                    <div>July 2024 - Current</div>
                  </div>
                </div>
                <ul className="list-disc pl-5 font-serif text-sm text-concrete-700 space-y-2">
                  <li>
                    4th engineering hire; designed and built TaxGPT&apos;s scalable AI
                    tax-research agent in a SOC 2–compliant production environment,
                    driving 30× growth in weekly active tax-professional users.
                  </li>
                  <li>
                    Architected core agentic services, orchestration engines, and
                    tax-law corpus retrieval systems with MCP-based tool and data
                    interfaces, enabling modular retrieval, reasoning, and execution
                    workflows and reducing time to deploy new agents.
                  </li>
                  <li>
                    Developed{' '}
                    <Link
                      href="https://www.taxgpt.com/agent-andrew-2026"
                      className="text-[#0000EE] hover:underline underline-offset-4"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Agent Andrew
                    </Link>
                    , an autonomous tax reviewer analyzing up to 500-page filings to
                    flag issues in tax returns.
                  </li>
                  <li>
                    Built an evaluation framework with benchmarking, regression tests,
                    and prompt management to compare models, agent architectures, and
                    retrieval approaches, maintaining performance while enabling safe
                    experimentation.
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
                    Researched model-agnostic data attribution for CV and NLP,
                    benchmarking interpretability methods and identifying high-impact
                    training data points using NTK-based approximations and
                    LoRA-efficient influence estimation.
                  </li>
                  <li>
                    Trained ResNet-18/34/50 on ImageNet-1k and GPT-2 on FineWeb,
                    optimizing 8×A100 FFCV pipelines for high-throughput
                    experimentation.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-mono text-base text-concrete-900">
                      Universidad Abierta Interamericana (
                      <Link
                        href="https://caeti.uai.edu.ar/"
                        className="text-[#0000EE] hover:underline underline-offset-4"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        CAETI
                      </Link>
                      )
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
                    benchmarking the RxREN algorithm across CV datasets and
                    architectures and achieving 96% fidelity in converting black-box
                    models into symbolic rule systems, enabling transparent auditing
                    of model decision rules for reliability and compliance.
                  </li>
                  <li>
                    Performed systematic hyperparameter and architecture studies to
                    strengthen explainability robustness across models.
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
                    Built Django REST APIs and Azure CI/CD workflows to automate
                    partner data ingestion and standardize unstructured geospatial and
                    tabular inputs into unified database schemas.
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="font-mono text-[0.65rem] text-concrete-600 tracking-[0.25em]">
                PROJECTS
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-mono text-base text-concrete-900">
                      <Link
                        href="https://starc-ai-web.vercel.app/"
                        className="text-[#0000EE] hover:underline underline-offset-4"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        StarcAI
                      </Link>{' '}
                      (Co-founder)
                    </p>
                    <p className="font-serif text-sm text-concrete-700">
                      Built sentiment modeling pipelines over MD&amp;A disclosures in
                      10-K/10-Q filings to produce risk-calibrated signals guiding the
                      structure and tone of corporate investor communications.
                    </p>
                    <p className="font-serif text-sm text-concrete-700 mt-2">
                      Developed sentiment-conditioned text generation to produce
                      tone-aligned investor communication drafts.
                    </p>
                  </div>
                  <div className="font-mono text-[0.75rem] text-concrete-600 md:text-right">
                    March 2025
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-mono text-base text-concrete-900">
                      <Link
                        href="https://msaadasad.medium.com/efficient-transformers-implementing-grouped-query-attention-with-mixture-of-depths-21135e8fdab3"
                        className="text-[#0000EE] hover:underline underline-offset-4"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Hybrid GQA-MoD LLM
                      </Link>
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

          </div>
        </div>
      </div>
    </Container>
  );
}
