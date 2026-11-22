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
              <div className="space-y-2 font-mono text-[0.75rem] text-concrete-800">
                <div>San Francisco, CA</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-[0.65rem] text-concrete-700 tracking-[0.25em]">
                SKILLS
              </h3>
              <div className="space-y-3 font-serif text-sm text-concrete-800">
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
              </div>
            </div>
          </aside>

          <div className="space-y-12">
            <section className="space-y-6">
              <h3 className="font-mono text-[0.65rem] text-concrete-700 tracking-[0.25em]">
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
                  <p className="font-serif text-base text-concrete-800">
                    B.Sc Computational Sciences: Applied Computer Science and
                    Artificial Intelligence | GPA: 3.71
                  </p>
                  <ul className="list-disc pl-5 font-serif text-sm text-concrete-700 space-y-1 mt-2">
                    <li>
                      Courses: Machine Learning, Artificial Intelligence, Deep Learning,
                      Bayesian Inference, Statistics, Linear Algebra, Single and
                      Multivariable Calculus, Data Structures and Algorithms, Software
                      Engineering.
                    </li>
                  </ul>
                </div>
                <div className="font-mono text-[0.75rem] text-concrete-700 md:text-right shrink-0 whitespace-nowrap">
                  <div>San Francisco, CA</div>
                  <div>May 2025</div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="font-mono text-[0.65rem] text-concrete-700 tracking-[0.25em]">
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
                        TaxGPT YC S24
                      </Link>{' '}
                      (Research and Engineering Team)
                    </p>
                    <p className="font-serif text-base text-concrete-800">
                      Research Scientist
                    </p>
                  </div>
                  <div className="font-mono text-[0.75rem] text-concrete-700 md:text-right">
                    <div>San Francisco, CA</div>
                    <div>July 2024 - Present</div>
                  </div>
                </div>
                <ul className="list-disc pl-5 font-serif text-sm text-concrete-800 space-y-2">
                  <li>
                    As the 4th engineering hire, designed and scaled TaxGPT&apos;s
                    flagship AI tax-research agent in a SOC 2-compliant production
                    environment, serving 3,000+ weekly active tax professionals and
                    processing 250,000 queries annually.
                  </li>
                  <li>
                    Architected the core agent powering TaxGPT Cowork, enabling
                    end-to-end workflows through document analysis, browser and
                    desktop automation, and MCP-based integrations with external
                    tools and data sources; reduced LLM inference costs by
                    approximately 80%.
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
                    , an autonomous tax-return reviewer analyzing filings up to 500
                    pages to identify potential errors and missed deductions.
                  </li>
                  <li>
                    Built automated evaluation infrastructure for production LLM
                    agents, combining end-to-end benchmarks, structured execution
                    traces, agent-as-judge scoring, and regression tests to identify
                    failures and compare model architectures.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-mono text-base text-concrete-900">
                      Womp Labs (Research Team)
                    </p>
                    <p className="font-serif text-base text-concrete-800">
                      Machine Learning Intern
                    </p>
                  </div>
                  <div className="font-mono text-[0.75rem] text-concrete-700 md:text-right">
                    <div>San Francisco, CA</div>
                    <div>June 2024 - July 2024</div>
                  </div>
                </div>
                <ul className="list-disc pl-5 font-serif text-sm text-concrete-800 space-y-2">
                  <li>
                    Researched model-agnostic data attribution for CV and NLP,
                    benchmarking interpretability methods and identifying high-impact
                    training data points using NTK-based approximations and
                    LoRA-efficient influence function estimation.
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
                    <p className="font-serif text-base text-concrete-800">
                      Machine Learning Research Intern
                    </p>
                  </div>
                  <div className="font-mono text-[0.75rem] text-concrete-700 md:text-right">
                    <div>Buenos Aires, Argentina</div>
                    <div>Sep 2023 - Dec 2023</div>
                  </div>
                </div>
                <ul className="list-disc pl-5 font-serif text-sm text-concrete-800 space-y-2">
                  <li>
                    Researched interpretable deep learning using the RxREN algorithm,
                    benchmarking symbolic rule extraction from MLPs and achieving 96%
                    fidelity in converting black-box models into auditable rules.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-mono text-base text-concrete-900">
                      World Wildlife Fund (Data and Technology Team)
                    </p>
                    <p className="font-serif text-base text-concrete-800">
                      Data Science Intern
                    </p>
                  </div>
                  <div className="font-mono text-[0.75rem] text-concrete-700 md:text-right">
                    <div>San Francisco, CA</div>
                    <div>June 2023 - Aug 2023</div>
                  </div>
                </div>
                <ul className="list-disc pl-5 font-serif text-sm text-concrete-800 space-y-2">
                  <li>
                    Built Django REST APIs and Azure CI/CD workflows to automate
                    partner data ingestion and standardize unstructured geospatial and
                    tabular inputs into unified database schemas.
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="font-mono text-[0.65rem] text-concrete-700 tracking-[0.25em]">
                PROJECTS
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-mono text-base text-concrete-900">
                      <Link
                        href="/writing/looped-system-1-models"
                        className="text-[#0000EE] hover:underline underline-offset-4"
                      >
                        Looped System 1 Models
                      </Link>
                    </p>
                    <p className="font-serif text-sm text-concrete-800">
                      Benchmarked JevK5, a Jev-like, decision-tuned Qwen3.5-4B model,
                      against its base model on synthetic relational tasks, observing
                      72.7% versus 60.3% accuracy on two-hop reasoning with 25 premises.
                    </p>
                    <p className="font-serif text-sm text-concrete-800 mt-2">
                      Conducted 48,640 activation-patching interventions across 32
                      decoder layers in both models, identifying answer-sensitive
                      representations at layer 12.
                    </p>
                  </div>
                  <div className="font-mono text-[0.75rem] text-concrete-700 md:text-right">
                    October 2026
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-mono text-base text-concrete-900">
                      <Link
                        href="/projects/two-berts-one-stone"
                        className="text-[#0000EE] hover:underline underline-offset-4"
                      >
                        Two BERTs, One Stone
                      </Link>
                    </p>
                    <p className="font-serif text-sm text-concrete-800">
                      Merged two task-specialized FinBERT classifiers through weight
                      averaging across six shared encoder layers, preserving ranking
                      agreement with the original models (Kendall&apos;s τ =
                      0.896/0.875). Applied ONNX optimization and INT8 quantization to
                      reduce CPU inference latency from 180 ms to 57 ms per text.
                    </p>
                  </div>
                  <div className="font-mono text-[0.75rem] text-concrete-700 md:text-right">
                    January 2025
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
                    <p className="font-serif text-sm text-concrete-800">
                      Implemented and benchmarked a transformer combining
                      Grouped-Query Attention and Mixture-of-Depths, training up to
                      3.9× as fast as a standard decoder-only transformer with 10%
                      higher perplexity.
                    </p>
                  </div>
                  <div className="font-mono text-[0.75rem] text-concrete-700 md:text-right">
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
