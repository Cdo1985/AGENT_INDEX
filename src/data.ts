import { Framework, DictionaryTerm, NewsletterIssue, WealthStrategy } from "./types";

export const frameworksList: Framework[] = [
  {
    id: "langgraph",
    name: "LangGraph",
    description: "An extension of LangChain built to construct robust, stateful multi-agent systems with cyclic process flows. It provides developers with precise, low-level control over loops, state transitions, and custom agent branching.",
    developer: "LangChain Inc.",
    languageSupports: ["Python", "TypeScript"],
    coreStrength: "Fine-grained state restoration, precise conditional branching, and first-class loop/cyclic graph architectures.",
    bestUseCase: "Complex recursive review routines, strict workflows where agents must retry tools under constraints, and state-heavy autonomous agents with human-in-the-loop checkpoints.",
    architectureType: "Graph/Cyclic",
    stars: "5.8k",
    officialDocs: "https://langchain-ai.github.io/langgraph/",
    codeSnippet: `import { StateGraph, Annotation } from "@langchain/langgraph";

// Define the state schema
const StateAnnotation = Annotation.Root({
  messages: Annotation<string[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  isApproved: Annotation<boolean>({
    reducer: (x, y) => y,
    default: () => false,
  })
});

// Build the stateful cyclic graph
const workflow = new StateGraph(StateAnnotation)
  .addNode("writer", writeDraftNode)
  .addNode("editor", editDraftNode)
  .addEdge("__start__", "writer")
  .addEdge("writer", "editor")
  .addConditionalEdges("editor", (state) => {
    return state.isApproved ? "end" : "writer";
  }, {
    end: "__end__",
    writer: "writer"
  });

const app = workflow.compile();`
  },
  {
    id: "crewai",
    name: "CrewAI",
    description: "An opinionated, high-level framework tailored for orchestrating role-playing autonomous agents. CrewAI allows specialized agents to collaborate seamlessly, delegate sub-tasks dynamically, and execute workflows to hit targeted goals.",
    developer: "CrewAI Inc.",
    languageSupports: ["Python"],
    coreStrength: "Incredibly intuitive role, goal, and backstory configuration, dynamic sub-task delegation, and automatic multi-agent memory caching.",
    bestUseCase: "Converting sequential commercial departmental processes (such as a Content Crew consisting of a Researcher, Writer, and SEO Editor) into a completely autonomous digital pipeline.",
    architectureType: "Role-Playing",
    stars: "22.3k",
    officialDocs: "https://docs.crewai.com",
    codeSnippet: `from crewai import Agent, Task, Crew, Process, LLM

# Define agents with distinct personas
researcher = Agent(
    role="Asset Trend Researcher",
    goal="Identify high-yielding liquid yield pools",
    backstory="Fintech strategist with 10yr automated analytical experience.",
    verbose=True
)

writer = Agent(
    role="Technical Publisher",
    goal="Synthesize raw numerical research into readable investor memos",
    backstory="Ex-Wall Street copywriter focused on risk-adjusted clarity.",
    verbose=True
)

# Assign tasks
task1 = Task(description="Query DeFi rates", expected_output="List of top 3 pools", agent=researcher)
task2 = Task(description="Draft advisory memo", expected_output="A 200-word bulletin", agent=writer)

# Launch the Crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[task1, task2],
    process=Process.sequential
)
crew.kickoff()`
  },
  {
    id: "autogen",
    name: "AutoGen",
    description: "A comprehensive framework engineered by Microsoft that enables multi-agent conversational patterns. In AutoGen, agents solve tasks collectively by engaging in structured, customizable multi-turn interactions.",
    developer: "Microsoft",
    languageSupports: ["Python", "C#"],
    coreStrength: "Dynamic conversational routing, native sandboxed code execution environments, and complex multi-party team patterns.",
    bestUseCase: "Automated software engineering squads (code generator, code tester, code reviewer) and interactive peer feedback boards.",
    architectureType: "Sequential",
    stars: "34.1k",
    officialDocs: "https://microsoft.github.io/autogen/",
    codeSnippet: `import autogen

config_list = [{"model": "gemini-1.5-flash", "api_key": "YOUR_KEY"}]

# Create conversable agents
assistant = autogen.AssistantAgent(
    name="engineer",
    llm_config={"config_list": config_list}
)

user_proxy = autogen.UserProxyAgent(
    name="exec_proxy",
    code_execution_config={"work_dir": "sandbox", "use_docker": False}
)

# Start multi-turn text-based interaction
user_proxy.initiate_chat(
    assistant, 
    message="Build a lightweight arbitrage monitoring script."
)`
  },
  {
    id: "pydanticai",
    name: "Pydantic AI",
    description: "A highly type-safe framework for building production-grade agentic workflows with LLMs, created by the team behind Pydantic. It focuses on absolute schema validation, rigid output structures, and explicit dependency injection.",
    developer: "Pydantic Team",
    languageSupports: ["Python"],
    coreStrength: "Type-safe output extraction, runtime structural data validation, and clean agentic dependency injection.",
    bestUseCase: "Secure financial audit agents that must output precise, pre-validated JSON schemas to upstream transactional backends.",
    architectureType: "Agent-Centric",
    stars: "4.2k",
    officialDocs: "https://ai.pydantic.dev/",
    codeSnippet: `from pydantic import BaseModel
from pydantic_ai import Agent, RunContext

class AuditSchema(BaseModel):
    is_safe: bool
    risk_score: float
    violations: list[str]

# Define structural agent
auditor = Agent('gemini-1.5-flash', result_type=AuditSchema)

@auditor.tool
def inspect_code(ctx: RunContext[None], file_content: str) -> str:
    # Safely checks for credentials leaks
    return "Checked content. Leaked keys: None"

result = auditor.run_sync("Inspect server.ts logic", deps=None)
print(result.data.risk_score)`
  },
  {
    id: "eliza",
    name: "ElizaOS",
    description: "A decentralized ecosystem engineered specifically for persistent, autonomous social agents, on-chain trading coordinators, and personality-driven web publishers.",
    developer: "AI16Z & Community",
    languageSupports: ["TypeScript"],
    coreStrength: "Native social media controllers (Twitter, Discord, Telegram), deep personality Character profiles, and built-in vector memory retrieval.",
    bestUseCase: "Designing brand advocates, social sentiment scanners, interactive narrative NPCs, and autonomous on-chain traders powered by community discussion.",
    architectureType: "Agent-Centric",
    stars: "9.5k",
    officialDocs: "https://elizaos.github.io/eliza/",
    codeSnippet: `import { AgentRuntime, Character, ModelProviderName } from "@elizaos/core";

const CharacterProfile: Character = {
  name: "LiquidVault_Agent",
  bio: "Automated liquidity explorer offering micro-strategies.",
  lore: ["Deep knowledge of decentralized finance frameworks."],
  messageExamples: [
    [{ user: "user", content: { text: "Best pool?" } }, { user: "LiquidVault_Agent", content: { text: "Stables!" } }]
  ]
};

const runtime = new AgentRuntime({
  character: CharacterProfile,
  modelProvider: ModelProviderName.GEMINI,
  providers: [],
  actions: [DeFiArbitrageAction]
});`
  },
  {
    id: "llamaindex",
    name: "LlamaIndex Agents",
    description: "Data-augmented agents designed for intensive knowledge base interactions. It enables agents to read, slice, route, and interact with heterogeneous structured and unstructured private knowledge banks.",
    developer: "LlamaIndex Team",
    languageSupports: ["Python", "TypeScript"],
    coreStrength: "Unmatched ease of chunking, vector storage indexing, data routing, metadata extraction, and multi-document query coordination.",
    bestUseCase: "Constructing data analysts who need to query millions of private documents, financial sheets, and API backends, synthesizing answers with direct source citations.",
    architectureType: "Data-Centric",
    stars: "34.6k",
    officialDocs: "https://docs.llamaindex.ai/",
    codeSnippet: `from llama_index.core.agent import ReActAgent
from llama_index.core.tools import QueryEngineTool

# Setup direct indexing tools
quarterly_tool = QueryEngineTool.from_defaults(
    query_engine=financial_records.as_query_engine(),
    name="sec_advisor",
    description="Query detailed financial records"
)

# Initialize ReAct framework agent
agent = ReActAgent.from_tools(
    [quarterly_tool], 
    verbose=True
)
agent.chat("Compare risk factors between Q1 and Q2.")`
  }
];

export const dictionaryList: DictionaryTerm[] = [
  {
    term: "Retrieval-Augmented Generation (RAG)",
    definition: "An architectural approach that secures external, verified factual data to dynamically supplement the prompt context, preventing generative hallucinations.",
    category: "Memory & Context",
    explanation: "Before sending the request to the LLM, a system searches a database/vector index using semantic queries, retrieves matching document fragments, paste-binds them behind a strict 'Based on these facts' directive, and requests a localized response.",
    diagramPattern: "User Query -> Retriever Vector Search -> Top Context -> Context Embedded Prompt -> LLM Execution"
  },
  {
    term: "Reason-Action Iteration (ReAct)",
    definition: "An agentic prompting paradigm where the LLM interleaves reasoning traces and task-specific tool actions in a tight loop.",
    category: "Cognitive Patterns",
    explanation: "The LLM follows a cyclic path: 'Thought' (analyzing the situation), 'Action' (invoking an programmatic tool), 'Observation' (receiving output from the tool), and 'Thought'. This continues until the final answer is compiled.",
    diagramPattern: "Input Prompt -> Thought -> Action -> Observation -> Thought -> Final Answer"
  },
  {
    term: "Tool Calibration / Function Calling",
    definition: "The capability of of an LLM to output a clean JSON block mapping exactly to a pre-defined programmatic function schema instead of plain-text conversational prose.",
    category: "Tools & Actions",
    explanation: "Developers provide the model with tool signatures (names, parameters, type definitions, and structural goals). The model decides if, when, and with what arguments to call a tool, yielding highly structured executions.",
    diagramPattern: "User Prompt + Function Definitions -> LLM -> JSON arguments block -> Execute script -> Return string to LLM"
  },
  {
    term: "Cyclic State Graphs",
    definition: "A network of agent steps modeling complex, non-linear pipelines where workflows can navigate backward or repeat cycles based on real-time assessments.",
    category: "Architectures",
    explanation: "Unlike simple linear sequences (Chain), a state graph uses defined conditional edges. If an output fail a quality control check (e.g. Code Reviewer detects compilation failure), the state branches back to the Developer node.",
    diagramPattern: "Start -> Node A -> Node B -> [Validator Check] --(fail)--> Node A, --(pass)--> End"
  },
  {
    term: "Autonomous Reflection",
    definition: "A cognitive design pattern where an agent evaluates its own output or intermediate actions to self-correct performance.",
    category: "Cognitive Patterns",
    explanation: "The agent generates a draft response, feeds it to a separate 'Critic' prompt state within its own workflow, evaluates security/clarity constraints, and refines the draft before surfacing it to the terminal screen.",
    diagramPattern: "Draft -> Critical Appraisal -> Security Check -> Iteration Iter -> Approved Output"
  },
  {
    term: "Entity Memory Partitioning",
    definition: "The division of agent memory into short-term (context window thread) and long-term (vector database, episodic profiles) storage.",
    category: "Memory & Context",
    explanation: "Ensures the agent maintains granular conversational memory within a single chat session, while recalling high-level, persistent preferences and historical milestones spanning months.",
    diagramPattern: "Sensory Context -> Short-term Working Memory (Thread API) + Long-term Persistent Memory (Vector store / Key-Value)"
  }
];

export const newsletterIssues: NewsletterIssue[] = [
  {
    id: "issue-12",
    title: "Specialized On-Chain Yield Agents: Deploying Autonomous Captive Portfolios",
    date: "June 08, 2026",
    summary: "A blueprint analysis exploring how elite tech funds deploy non-custodial multi-agent networks to crawl liquid yield protocols and safely execute cross-pool stable arbitrage.",
    category: "Market Report",
    reads: 4892,
    content: `### Executive Overview: Autonomous Arbitrage Architecture

Over the last fiscal quarter, a paradigm shift occurred within decentralized digital asset management. Forward-thinking capital allocators are moving away from passive yield-aggregators toward multi-agent, non-custodial networks. These systems operate as continuous, stateful execution pools, observing liquidity conditions, simulating outcomes, and completing real-time settlement loops.

Using cyclic frameworks like **LangGraph** or type-safe agents built on **Pydantic AI**, modern yield agents combine real-time gas monitoring, liquidity pool depth extraction, and slippage calculations.

#### Core Execution Pillars
1. **The Crawler Agent**: Continuously polls a registry of decentralized pools (Curve, Uniswap, Aave, Compound) to log dynamic APY rates, transaction costs, and collateral factors.
2. **The Verification Critic**: Before authorizing any transfer, an independent state node takes the proposed transaction, validates slippage against sandboxed simulations, and checks for smart-contract vulnerability logs.
3. **The Multi-Sig Executor**: Routes the authorized transaction, verifying the transaction hash programmatically.

#### The Return Profile
Unlike traditional static vaults, autonomous agents pivot dynamically during periods of high volatility. In sudden market rebalancings, passive capital often suffers from slow human reaction cycles. Multi-agent systems execute complex shifts in minutes, recovering gas costs instantly and securing optimal risk-neutral returns.`
  },
  {
    id: "issue-11",
    title: "Type Safety vs Event Graphs: Comparing Pydantic AI and LangGraph in Production",
    date: "May 25, 2026",
    summary: "An engineering post dissecting when to choose the rigid, type-safe validations of Pydantic AI versus the flexible, cyclic event-based architectures of LangGraph.",
    category: "Framework Deep-Dive",
    reads: 3120,
    content: `### Architecture Breakdown: State Validation meets Stateful Graphs

As autonomous task execution scale to handle core corporate assets, developer priorities are shifting towards reliability and failure recovery. This week, we compare two premier frameworks: **LangGraph** and the newly released **Pydantic AI**.

#### In-Depth Comparison

| Metric | Pydantic AI | LangGraph |
| :--- | :--- | :--- |
| **Primary Philosophy** | Rigorous schema-driven validation | Cyclic, graph-based process execution |
| **State Handling** | Injection-driven, lightweight context | Stateful data-channel reducer map |
| **Cyclic Loops** | Supported via standard nested Python logic | Expressly declared cyclic edges and conditional nodes |
| **TypeScript Support** | Native Python only | Full first-class TypeScript implementation |

#### Production Verdict
- **Choose Pydantic AI** if you are integrating agents into strict transactional services (e.g. banking ledgers or compliance processors). Every action, argument, and output schema is rigidly validated prior to serialization, preventing structural corruptions.
- **Choose LangGraph** if your system requires absolute control over complex state flow, interactive agent negotiations, loops (such as compiler feedback loops which retry tasks), or human-in-the-loop checkpoints.`
  },
  {
    id: "issue-10",
    title: "The Zero-To-One Blueprint: Launching a Passive Competitor Intel Agent",
    date: "May 10, 2026",
    summary: "A step-by-step masterclass on coding and deploying a lightweight competitive intelligence agent that targets high-value micro-niches, crawls competitors, and flags arbitrage gaps.",
    category: "Strategy Review",
    reads: 5910,
    content: `### Actionable Strategy: Micro-SaaS Competitive Intel

Building automated wealth pipelines starts by exploiting informational asymmetry. This blueprint covers designing an agentic crawler that tracks software prices and updates, looking for opportunities to launch highly targeted programmatic micro-SaaS features.

#### The Workflow Blueprint
1. **Targeting (CrewAI Researcher Agent)**: Monitors open community forums (Reddit, YCombinator, ProductHunt, Twitter) for complaints regarding service quality, downtime, or steep pricing changes of target micro-SaaS apps.
2. **Crawl & Parse (LlamaIndex Agent)**: Semantically extracts pricing schedules from target homepages daily to compile updates in a clean structured format.
3. **Sentiment Analysis (Analysis Node)**: Detects negative standard deviations in user feedback, signaling the perfect window for deployment.

#### Deployment Checklist
- **Database**: Standard Key-Value or lightweight SQLite.
- **Trigger**: Runs on a cron schedule twice daily.
- **Cost**: Less than $0.10 in API tokens per run.

Implementing this strategy creates an autonomous informational radar, giving tech builders a decisive edge in shipping highly profitable, low-overhead micro-utilities.`
  }
];

export const wealthStrategies: WealthStrategy[] = [
  {
    id: "defi-yield-strategy",
    title: "Autonomous Yield Guardian & Aggregator",
    objective: "Safely execute cross-protocol transfer of stable assets to capture delta-neutral liquidity yields with minimal manual oversight.",
    difficulty: "Advanced",
    timeToDeploy: "3-5 Days",
    estimatedReturnPattern: "DeFi stable asset APY maximization (Delta-Neutral + Gas Optimized)",
    recommendedFrameworks: ["LangGraph", "Pydantic AI"],
    workflow: [
      {
        name: "Registry Poller",
        executor: "LlamaIndex / Custom RSS crawler",
        description: "Monitors Curve, Compound, and Aave pool contract states via RPC nodes to log exact current APY and pool depths.",
        dependencies: []
      },
      {
        name: "Gas-Cost Adjuster",
        executor: "Pydantic AI Mathematical validator",
        description: "Processes proposed transfers and subtracts dynamic multi-chain gas costs to ensure transaction cost doesn't erode yield delta.",
        dependencies: ["Registry Poller"]
      },
      {
        name: "Security Validator",
        executor: "CrewAI Compliance Agent",
        description: "Scans smart-contract risk logs, audits pool depth standard deviations to prevent dynamic pool draining exploits.",
        dependencies: ["Gas-Cost Adjuster"]
      },
      {
        name: "Transaction Signer",
        executor: "Secure Multi-Sig Node (Human-in-the-Loop approval)",
        description: "Triggers on-chain transfer requests via secure ledger API once final approval is obtained (or via fallback boundaries).",
        dependencies: ["Security Validator"]
      }
    ],
    codeExample: `from pydantic import BaseModel, Field
from pydantic_ai import Agent

class YieldAudit(BaseModel):
    is_profitable: bool = Field(description="Dynamic gain must exceed gas fees by 20%")
    net_apy_gain: float
    recommended_path: str
    gas_est_usd: float

# Rigid validation agent
yield_agent = Agent("gemini-3.5-flash", result_type=YieldAudit)

@yield_agent.tool
def calculate_fees(ctx, gas_gwei: int, gas_used: int, eth_price: float) -> float:
    return (gas_gwei * 1e-9) * gas_used * eth_price

query = "Assess moving $10,000 stable from Aave V3 to Curve Pool, APY differential is 1.8%, gas is 45 gwei."
result = yield_agent.run_sync(query)
print(result.data.is_profitable)`,
    tips: [
      "Always set strict loss-prevention capital hard caps (e.g., maximum exposure of 10% of total portfolio on any single young protocol).",
      "Use sandboxed dry-runs (Tenderly, local fork) to verify the executor agent runs safely before routing real capital on-chain.",
      "Track standard deviations of APY; a sudden spike in APY usually indicates underlying protocol distress or impending liquidity flight."
    ],
    executionSafetyGuidelines: "NEVER hardcode private keys into raw codebases or upload them to client-eye environments. Secure all keys inside encrypted server vaults with multi-level biometric or confirmation gates (Web3 Wallet interfaces)."
  },
  {
    id: "competitor-radar-strategy",
    title: "Micro-SaaS Market Intelligence Radar",
    objective: "Establish an autonomous radar tracking API endpoints, pricing changes, and complaints targeting popular software products to build customized utility widgets.",
    difficulty: "Beginner",
    timeToDeploy: "1 Day",
    estimatedReturnPattern: "High-value high-ticket market research reports, SaaS product targeting intelligence",
    recommendedFrameworks: ["CrewAI", "LlamaIndex Agents"],
    workflow: [
      {
        name: "Community Sentinel",
        executor: "CrewAI Forum Ingestion Agent",
        description: "Subscribes to Reddit APIs, product hubs, and Twitter search parameters to catch complaints regarding specific SaaS software.",
        dependencies: []
      },
      {
        name: "Price Crawler",
        executor: "LlamaIndex Structured Web Scraper",
        description: "Periodically reads competitor pricing tables and features sections, structures changes inside JSON records.",
        dependencies: []
      },
      {
        name: "Trend Synthesizer",
        executor: "CrewAI Copywriting Analyst",
        description: "Filters reports to find recurring feature gaps or pricing hikes, compiling reports describing the opportunity.",
        dependencies: ["Community Sentinel", "Price Crawler"]
      }
    ],
    codeExample: `from crewai import Agent, Task, Crew, Process

# Setup pricing tracker agent
price_analyst = Agent(
    role="Competitor Intelligence Analyst",
    goal="Extract pricing trends from dynamic landing pages",
    backstory="Analytical strategist capable of indexing pricing structures.",
    verbose=True
)

analysis_task = Task(
    description="Analyze competitors' pricing changes listed in parsed raw outputs",
    expected_output="A list of 3 feature gaps and price adjustments",
    agent=price_analyst
)

crew = Crew(agents=[price_analyst], tasks=[analysis_task])
crew.kickoff()`,
    tips: [
      "Target specific high-churn spaces (such as AI image processing tools or dynamic transcription widgets) where user loyalty is typically low.",
      "Store compiled reports in chronological JSON feeds to easily chart trends over quarters.",
      "Keep API expense incredibly low by using local chunking before feeding scrapings to the summarization agent."
    ],
    executionSafetyGuidelines: "Strictly respect websites' Robots.txt policies and do not saturate competitor endpoints with high-volume crawling, which could lead to server bans."
  },
  {
    id: "content-distro-strategy",
    title: "Autonomous Newsletter & Content Syndicate",
    objective: "Crawl emerging technology documentation, translate changes into digestible niche newsletters, and publish autonomously to static web portals.",
    difficulty: "Intermediate",
    timeToDeploy: "2-3 Days",
    estimatedReturnPattern: "Ad-revenue, premium digital newsletter subscriptions, organic newsletter growth",
    recommendedFrameworks: ["LangGraph", "ElizaOS"],
    workflow: [
      {
        name: "Release Tracker",
        executor: "GitHub Release Hook",
        description: "Monitors GitHub release notes and technical logs of major developer libraries.",
        dependencies: []
      },
      {
        name: "Technical Digest",
        executor: "LangGraph Stateful Editor",
        description: "Synthesizes code diffs into elegant, explanation-driven tutorials with accurate real code adjustments.",
        dependencies: ["Release Tracker"]
      },
      {
        name: "Syndication Publisher",
        executor: "ElizaOS Publisher Node",
        description: "Formats standard newsletter structures and publishes updates directly to social networks and web mail servers.",
        dependencies: ["Technical Digest"]
      }
    ],
    codeExample: `import { StateGraph } from "@langchain/langgraph";

// Structure content state
const ContentState = {
  rawDiffs: { value: null },
  digestDraft: { value: null },
  isApproved: { value: false }
};

const pipeline = new StateGraph({ channels: ContentState })
  .addNode("summarizer", summarizeCodeDiffs)
  .addNode("critic", critiqueAndRefineDraft)
  .addEdge("__start__", "summarizer")
  .addEdge("summarizer", "critic");

// Complete graph logic and deploy to serverless trigger.`,
    tips: [
      "Focus purely on emerging frameworks with explosive adoption curves (e.g. state-of-the-art AI frameworks) to capture organic high-quality search indexes.",
      "Add a 'Code Sandbox' step to compile draft snippets and confirm code accuracy before launching publications.",
      "Offer readers a 'Custom Blueprint Generator' to significantly boost interaction, organic retention, and subscription conversions."
    ],
    executionSafetyGuidelines: "Always clearly disclose that content is parsed and summarized via state-of-the-art developer agents, maintaining high editorial honesty with users."
  }
];
