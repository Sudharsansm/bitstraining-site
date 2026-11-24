/* ------------------------------------------------------------------ */
/*  Content — sourced from the PyPI page and GitHub README for         */
/*  bitstraining 0.1.0. Nothing here claims more than those pages do.  */
/* ------------------------------------------------------------------ */

export const REPO = "https://github.com/Sudharsansm/bitstraining";
export const PYPI = "https://pypi.org/project/bitstraining/";
export const VERSION = "0.1.0";

export const PAGES = {
  home: { label: "Home" },
  how: { label: "How it works" },
  features: { label: "Features" },
  compute: { label: "Compute" },
  quickstart: { label: "Quickstart" },
  docs: { label: "Docs" },
};

/* ---------------- Code samples ---------------- */

export const CODE_RUN = `name: support-bot
model: { base: meta-llama/Llama-3.1-8B-Instruct }
data:  { train: ./data/train.jsonl, max_length: 1024, eval_split: 0.05 }
goal:  { task: sft, epochs: 3, global_batch_size: 16, objective: time, budget_usd: 20 }
compute: { provider: local }
output: ./output`;

export const CODE_FLOW = `$ bitstraining init --template chat -o run.yaml   # starter config
$ bitstraining data inspect data/train.jsonl     # schema, token stats, padding waste
$ bitstraining profile                           # detect local hardware
$ bitstraining plan -c run.yaml                  # ranked plans
$ bitstraining doctor -c run.yaml                # ~30 pre-flight checks
$ bitstraining autotune -c run.yaml              # real probe, calibrates the planner
$ bitstraining train -c run.yaml --tune          # plan, check, run, track`;

export const CODE_PLAN = `# what-if: how would this run look on a GPU you don't own yet?
$ bitstraining plan -c run.yaml --gpu a100-80gb --price 2.5

# bt is a short alias for bitstraining
$ bt plan -c run.yaml`;

export const CODE_COMPUTE = `# local (default)
compute: { provider: local }

# any machine you can SSH into
compute: { provider: ssh, options: { host: ubuntu@203.0.113.7, gpu: a100-80gb, price_per_hour: 1.9 } }

# a container
compute: { provider: docker, options: { image: pytorch/pytorch:2.4.0-cuda12.1-cudnn9-runtime } }

# Colab / Kaggle, run by hand
compute: { provider: notebook, options: { target: colab } }`;

export const CODE_NOTEBOOK = `$ bitstraining train -c run.yaml          # prepares the notebook bundle
# ... run it in Colab / Kaggle, download output.zip ...
$ bitstraining compute fetch --zip output.zip`;

export const CODE_EVAL = `$ bitstraining runs list                  # run history
$ bitstraining runs spikes                # trace loss spikes to batch rows
$ bitstraining eval --task preds.jsonl --general general.jsonl
$ bitstraining card                       # model card: data hash + lineage
$ bitstraining serve --model ./output --backend vllm`;

export const CODE_INSTALL = `pip install bitstraining                  # core; needs only PyYAML
pip install "bitstraining[train]"         # torch, transformers, peft, datasets, accelerate
pip install "bitstraining[train,quant]"   # + bitsandbytes (QLoRA, 8-bit optimizers)
pip install "bitstraining[fast]"          # + unsloth
pip install "bitstraining[mlx]"           # Apple Silicon
pip install "bitstraining[parquet]"       # Parquet datasets`;

/* ---------------- How it works ---------------- */

export const FLOW = [
  { title: "Describe", body: "Write a run.yaml: base model, dataset, goal (epochs, batch size, objective) and where it should run." },
  { title: "Plan", body: "Bitstraining profiles hardware, predicts memory, speed and cost for each strategy, and ranks the options." },
  { title: "Check & probe", body: "The doctor runs about 30 pre-flight checks. Autotune then probes real hardware and calibrates the numbers." },
  { title: "Run & gate", body: "The run is tracked end to end. An eval gate blocks export if the model regressed." },
];

export const TOGGLES = [
  { icon: "Cpu", label: "Profile finds no GPU", sub: "Plan against a catalog GPU with --gpu and --price, or send the run to ssh, docker or a notebook." },
  { icon: "Gauge", label: "Predictions are low confidence", sub: "Until a real probe calibrates them on your hardware — autotune does that and caches the result." },
  { icon: "Database", label: "Dataset has leakage or duplicates", sub: "The doctor flags train/eval leakage and duplicates, with a suggested fix for each." },
  { icon: "ShieldCheck", label: "Model forgot general ability", sub: "The forgetting check and eval gate stop an export that regressed on your general set." },
];

/* ---------------- Features ---------------- */

export const FEATURES = [
  {
    key: "planner", label: "Planner", icon: "Gauge",
    desc: "Memory and throughput models that search the space of ways to train — before you spend a GPU-hour.",
    items: [
      "Strategies: full fine-tune, LoRA, QLoRA and DoRA",
      "Searches checkpointing, optimizer, micro-batch, packing and FSDP/DDP choices",
      "Ranks plans by time, cost or memory, and respects your budgets",
      "Every plan carries a confidence level — low until a probe calibrates it",
    ],
    code: "plan",
  },
  {
    key: "doctor", label: "Doctor", icon: "Stethoscope",
    desc: "About 30 pre-flight checks that catch the boring failures before they cost a night of training.",
    items: [
      "Config and schema validation",
      "Truncation, duplicates and train/eval leakage",
      "Resource fit and missing packages",
      "A suggested fix attached to every finding",
    ],
    code: "flow",
  },
  {
    key: "autotune", label: "Autotune", icon: "Zap",
    desc: "An OOM-safe search for the largest micro-batch your hardware really handles.",
    items: [
      "Probes real hardware instead of trusting the estimate",
      "Calibrates the planner's predictions from what it measured",
      "Caches results so repeat runs start faster",
      "Use bitstraining train --tune to fold it into a run",
    ],
  },
  {
    key: "data", label: "Data tooling", icon: "Database",
    desc: "Bring a dataset in nearly any shape; get a clean, leakage-safe one back.",
    items: [
      "Reads JSONL, JSON, CSV, TSV, TXT, Parquet and Hugging Face datasets",
      "Auto-detects schemas such as Alpaca, chat and ShareGPT",
      "Exact and MinHash near-duplicate removal",
      "Leakage-safe splits and padding-waste analysis",
    ],
  },
  {
    key: "compute", label: "Compute", icon: "Cloud",
    desc: "One config, several places to run it — your own box, a rented one, a container, or a free notebook.",
    items: [
      "local, ssh, docker, notebook (Colab / Kaggle, manual) and catalog (planning-only prices)",
      "Budget and wall-clock caps",
      "Auto-resume",
      "Providers are plugins you can write yourself",
    ],
    code: "compute",
  },
  {
    key: "tracking", label: "Tracking", icon: "History",
    desc: "A SQLite registry that remembers what ran, on which data, and how it went.",
    items: [
      "Runs, plans, metrics and hashed artifacts",
      "Data-to-model lineage",
      "Trace a loss spike back to the batch rows that caused it",
      "Plain SQLite — nothing to host",
    ],
  },
  {
    key: "eval", label: "Eval gate", icon: "ClipboardCheck",
    desc: "A quality gate between training and export, so a regression doesn't ship quietly.",
    items: [
      "Metrics and per-row comparison",
      "Forgetting check against a general-ability set",
      "Gate blocks export on regressions",
      "Judges are pluggable",
    ],
    code: "eval",
  },
  {
    key: "deploy", label: "Deploy", icon: "Rocket",
    desc: "From a tracked run to something you can serve.",
    items: [
      "Model cards with data hash and lineage",
      "LoRA merge",
      "GGUF export via llama.cpp",
      "Serve through vLLM or llama.cpp — OpenAI-compatible server",
    ],
  },
];

/* ---------------- Compute page ---------------- */

export const PROVIDERS = [
  ["local", "Your own machine", "Default. Profiled with bitstraining profile.", "Verified"],
  ["ssh", "Any host you can SSH into", "Give host, GPU and price per hour for cost estimates.", "Untested"],
  ["docker", "A container image", "e.g. pytorch/pytorch with CUDA runtime.", "Untested"],
  ["notebook", "Colab or Kaggle", "Manual: run the bundle, then compute fetch --zip.", "Manual"],
  ["catalog", "Planning-only price list", "Compare GPUs and prices; nothing is launched.", "Planning"],
];

export const EXTRAS = [
  { name: "(core)", adds: "PyYAML", needs: "Planning, doctor, data tooling, tracking, eval, simulated quickstart" },
  { name: "[train]", adds: "torch, transformers, peft, datasets, accelerate", needs: "Real fine-tuning with the PyTorch/PEFT engine" },
  { name: "[train,quant]", adds: "+ bitsandbytes", needs: "QLoRA and 8-bit optimizers" },
  { name: "[fast]", adds: "unsloth", needs: "The Unsloth engine" },
  { name: "[mlx]", adds: "MLX", needs: "Apple Silicon" },
  { name: "[parquet]", adds: "Parquet support", needs: "Reading .parquet datasets" },
];

export const OPS_ITEMS = [
  "Budget caps (USD) and wall-clock caps on any run",
  "Auto-resume after interruption",
  "OOM-safe micro-batch search with cached results",
  "SQLite run registry with hashed artifacts and data-to-model lineage",
  "Engines and compute providers are plugins — discovered through Python entry points or registered at runtime",
  "PyPI releases use Trusted Publishing with provenance from GitHub Actions",
];

export const REPO_TREE = [
  { type: "folder", name: "bitstraining/", note: "core package — planner, data, compute, tracking, eval, deploy" },
  { type: "folder", name: "docs/", note: "architecture and plugin guides" },
  { type: "folder", name: "examples/", note: "includes custom_provider.py" },
  { type: "folder", name: "tests/", note: "CPU-only test suite" },
  { type: "folder", name: ".github/workflows/", note: "CI" },
  { type: "file", name: "pyproject.toml" },
  { type: "file", name: "uv.lock" },
  { type: "file", name: "CHANGELOG.md" },
  { type: "file", name: "RELEASING.md" },
  { type: "file", name: "CONTRIBUTING.md" },
  { type: "file", name: "CODE_OF_CONDUCT.md" },
  { type: "file", name: "LICENSE", note: "Apache-2.0" },
];

export const REQUIREMENTS = [
  { lbl: "Python", val: "3.10 or newer" },
  { lbl: "Core dependency", val: "PyYAML" },
  { lbl: "GPU", val: "Not needed to plan or try it" },
  { lbl: "Platform", val: "Linux tested" },
];

/* ---------------- Honest status ---------------- */

export const STATUS = [
  ["Planner, data pipeline, tracking, eval gate, model cards, orchestrator, local provider", "Verified"],
  ["hf_peft, unsloth and mlx engines", "Untested"],
  ["ssh and docker providers", "Untested"],
  ["FSDP / DeepSpeed execution", "Planned"],
  ["DPO, ORPO, KTO, GRPO training (rejected at planning time)", "Planned"],
  ["Layer streaming, pruning, distillation", "Planned"],
  ["Web UI and MCP server", "Planned"],
  ["Real cloud provisioning (RunPod, Lambda, AWS)", "Planned"],
];

export const RELEASES = [
  { v: "0.1.0", d: "Nov 24, 2026", note: "First public alpha release on PyPI. Planner, doctor, autotune, data tooling, compute providers, SQLite tracking, eval gate and deploy helpers. Published with Trusted Publishing provenance." },
];

/* ---------------- Docs ---------------- */

export const DOC_NAV = [
  { group: "Start", pages: ["getting-started", "run-config"] },
  { group: "Guides", pages: ["planner", "doctor", "data", "compute-guide", "tracking", "eval-deploy"] },
  { group: "Reference", pages: ["cli", "status", "plugins"] },
  { group: "Help", pages: ["faq", "changelog"] },
];

export const DOCS_PAGES = {
  "getting-started": {
    title: "Getting started", tag: "Start",
    tagline: "Hardware-aware planning for fine-tuning language models.",
    blocks: [
      { type: "p", text: "Bitstraining is an orchestration layer. You give it a goal and constraints; it profiles your hardware, predicts memory, speed and cost for candidate strategies, ranks them, runs pre-flight checks, verifies the top choice with a short probe, and tracks the run. It wraps PyTorch/Transformers/PEFT, Unsloth and MLX as swappable engines rather than reimplementing training." },
      { type: "code", caption: "Try it with no GPU", code: `pip install bitstraining
bitstraining quickstart` },
      { type: "callout", text: "quickstart runs the whole pipeline with a simulation engine. It trains nothing — it shows you the plan, checks, tracking and eval gate working end to end." },
      { type: "code", caption: "Everything below, installed", code: CODE_INSTALL },
      { type: "p", text: "Requires Python 3.10+. The CLI is available as bitstraining and the shorter bt." },
    ],
  },
  "run-config": {
    title: "run.yaml", tag: "Start",
    tagline: "One file describes the whole run.",
    blocks: [
      { type: "code", caption: "A minimal run", code: CODE_RUN },
      { type: "table", head: ["Key", "Meaning"], rows: [
        ["model.base", "Base model to fine-tune, e.g. a Hugging Face model id"],
        ["data", "Training file, max_length and eval_split"],
        ["goal", "task (sft), epochs, global_batch_size, objective (time, cost or memory) and budget_usd"],
        ["compute", "provider (local, ssh, docker, notebook, catalog) and its options"],
        ["output", "Directory for the trained model and artifacts"],
      ] },
      { type: "code", caption: "Generate a starter file", code: "bitstraining init --template chat -o run.yaml" },
      { type: "callout", text: "Preference tasks (DPO, ORPO, KTO, GRPO) are rejected at planning time — only SFT is supported in 0.1.0." },
    ],
  },
  planner: {
    title: "Planner", tag: "Guides",
    tagline: "Rank the ways to train before you pay to try them.",
    blocks: [
      { type: "p", text: "The planner estimates GPU memory and throughput for candidate strategies — full, LoRA, QLoRA and DoRA, with gradient checkpointing, optimizers, micro-batch, packing and FSDP/DDP — then ranks them by time, cost or memory within your budget." },
      { type: "code", caption: "Plan, with a what-if GPU", code: CODE_PLAN },
      { type: "list", items: [
        "Each plan has a confidence level — low until autotune calibrates it on your hardware",
        "Use --gpu and --price to ask what a run would look like on hardware you don't have",
        "bitstraining profile shows the hardware it detected locally",
      ] },
      { type: "callout", text: "The planner's estimates have not yet been validated against real GPU runs, and there are no benchmarks against other tools. Treat them as a starting point and run autotune before trusting a speed claim." },
    ],
  },
  doctor: {
    title: "Doctor & autotune", tag: "Guides",
    tagline: "Catch problems before the run, and measure what's real.",
    blocks: [
      { type: "p", text: "doctor runs about 30 pre-flight checks over config, schema, truncation, duplicates, train/eval leakage and resource fit. Every finding comes with a suggested fix." },
      { type: "code", caption: "Check, then probe", code: `bitstraining doctor -c run.yaml
bitstraining autotune -c run.yaml` },
      { type: "p", text: "autotune is an OOM-safe search for the largest micro-batch that fits. It also calibrates the planner's predictions from what it measured and caches the result, so later plans on the same hardware are more trustworthy." },
    ],
  },
  data: {
    title: "Data", tag: "Guides",
    tagline: "Inspect, clean and split.",
    blocks: [
      { type: "code", caption: "Inspect a dataset", code: "bitstraining data inspect data/train.jsonl" },
      { type: "table", head: ["Capability", "Detail"], rows: [
        ["Formats", "JSONL, JSON, CSV, TSV, TXT, Parquet, Hugging Face datasets"],
        ["Schemas", "Auto-detected: Alpaca, chat, ShareGPT and others"],
        ["Cleaning", "Exact and MinHash near-duplicate removal"],
        ["Splits", "Leakage-safe train/eval splits"],
        ["Analysis", "Token stats and padding waste"],
      ] },
      { type: "p", text: "Parquet needs the [parquet] extra." },
    ],
  },
  "compute-guide": {
    title: "Compute", tag: "Guides",
    tagline: "Run the same config on different hardware.",
    blocks: [
      { type: "code", caption: "Provider examples", code: CODE_COMPUTE },
      { type: "p", text: "For Colab or Kaggle, Bitstraining prepares the run, you execute it in the notebook, then pull the results back:" },
      { type: "code", caption: "Notebook round trip", code: CODE_NOTEBOOK },
      { type: "list", items: [
        "Budget (budget_usd) and wall-clock caps apply to any run",
        "Auto-resume picks a run back up after an interruption",
        "catalog is a planning-only price list — it never launches anything",
      ] },
      { type: "callout", text: "ssh and docker providers are written but have never been run against real hosts. Real cloud provisioning (RunPod, Lambda, AWS) is not implemented yet." },
    ],
  },
  tracking: {
    title: "Tracking", tag: "Guides",
    tagline: "A SQLite registry of everything that ran.",
    blocks: [
      { type: "code", caption: "Inspect history", code: `bitstraining runs list
bitstraining runs spikes` },
      { type: "list", items: [
        "Runs, plans, metrics and hashed artifacts are recorded",
        "Data-to-model lineage ties a model back to the exact dataset",
        "runs spikes traces loss spikes to the batch rows behind them",
      ] },
    ],
  },
  "eval-deploy": {
    title: "Eval & deploy", tag: "Guides",
    tagline: "Gate the export, then ship it.",
    blocks: [
      { type: "code", caption: "Audit, document, serve", code: CODE_EVAL },
      { type: "table", head: ["Step", "What it does"], rows: [
        ["eval", "Metrics, per-row comparison and a forgetting check; the gate blocks export on regressions"],
        ["card", "Model card with data hash and lineage"],
        ["merge / export", "LoRA merge and GGUF export via llama.cpp"],
        ["serve", "OpenAI-compatible server via vLLM or llama.cpp"],
      ] },
      { type: "p", text: "Judges for evaluation are pluggable." },
    ],
  },
  cli: {
    title: "CLI", tag: "Reference",
    tagline: "bitstraining, or bt for short.",
    blocks: [
      { type: "table", head: ["Command", "Purpose"], rows: [
        ["quickstart", "End-to-end simulated run, no GPU"],
        ["init --template chat -o run.yaml", "Create a starter config"],
        ["data inspect <file>", "Schema, token stats, padding waste"],
        ["profile", "Detect local hardware"],
        ["plan -c run.yaml [--gpu --price]", "Rank plans, with optional what-if pricing"],
        ["doctor -c run.yaml", "Pre-flight checks"],
        ["autotune -c run.yaml", "Real probe for micro-batch and calibration"],
        ["train -c run.yaml [--tune]", "Plan, check, run and track"],
        ["runs list / runs spikes", "Run history and loss-spike tracing"],
        ["eval --task … --general …", "Audit and forgetting gate"],
        ["card", "Model card with data hash and lineage"],
        ["serve --model ./output --backend vllm", "OpenAI-compatible server"],
        ["compute fetch --zip output.zip", "Retrieve notebook outputs"],
      ] },
      { type: "p", text: "Run bitstraining --help for every command and option." },
    ],
  },
  status: {
    title: "Status & limits", tag: "Reference",
    tagline: "What's verified, what's untested, what isn't built.",
    blocks: [
      { type: "p", text: "Bitstraining 0.1.0 is Alpha. The project's own status table is reproduced here so you know exactly what to rely on." },
      { type: "table", head: ["Area", "Status"], rows: STATUS },
      { type: "list", items: [
        "Developed and tested on Linux; Windows partly tested; macOS untested",
        "CPU tests pass on Python 3.10 – 3.13 on Linux",
        "No benchmarks against other tools exist yet",
      ] },
    ],
  },
  plugins: {
    title: "Plugins", tag: "Reference",
    tagline: "Engines and providers are replaceable.",
    blocks: [
      { type: "p", text: "Engines and compute providers are plugins, discovered through Python entry points or registered at runtime. The repository's docs/plugins.md explains the interface, and examples/custom_provider.py is a working starting point." },
      { type: "p", text: "Built-in engines wrap PyTorch/Transformers/PEFT (hf_peft), Unsloth and MLX." },
    ],
  },
  faq: {
    title: "FAQ", tag: "Help",
    tagline: "Short answers to the usual questions.",
    blocks: [
      { type: "p", text: "Does Bitstraining replace PyTorch or Hugging Face? No. It plans, checks, orchestrates and tracks; the actual training runs in an existing engine." },
      { type: "p", text: "Do I need a GPU? Not to plan, check data, or try the simulated quickstart. You need one (or a compute provider with one) to really train." },
      { type: "p", text: "Can I use free Colab or Kaggle? Yes, through the manual notebook provider: run the prepared bundle, then fetch the output zip." },
      { type: "p", text: "Are the speed and memory predictions accurate? They are unvalidated against real GPU runs. Confidence stays low until autotune calibrates them on your hardware." },
      { type: "p", text: "Does it support DPO or GRPO? Not yet. Preference tasks are rejected at planning time." },
      { type: "p", text: "Is it production-ready? It is Alpha. Pin the version and test on your own hardware first." },
      { type: "p", text: "Which license? Apache-2.0." },
    ],
  },
  changelog: {
    title: "Changelog", tag: "Help",
    tagline: "What shipped, when.",
    blocks: [
      { type: "table", head: ["Version", "Notes"], rows: RELEASES.map((r) => [r.v, r.note]) },
      { type: "p", text: "The full history is in CHANGELOG.md in the repository." },
    ],
  },
};
