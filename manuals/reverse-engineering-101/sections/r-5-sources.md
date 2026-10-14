# Sources

> One pinned source tree, eleven vendored files from it, one recorded capture, and the research files behind the law, the formats, and the papers, ranked by authority.

The pin is `rea-agents` 6.4.0, the npm package published on 2026-10-11, whose tag `rea-agents-6.4.0` is commit `a56f7bb668ab23fec8d33f7af353ac7ed2fe1895` of `github.com/morluto/rea`. The provider is Ghidra 12.1.4 with OpenJDK 21.0.12.1. The facts were verified on 2026-10-13 against a read-only checkout of that commit, and every `path:line` citation in this manual points into it. The main branch of the repository is ahead of the tag. `research/rea-640-repin.md` lists the 250 citations that moved or were marked `main only` when the pin moved from main to the tag.

## The ranked sources

When two sources disagree, the higher one wins and the section says so.

| Rank | Source | Used for | Cited as |
|---|---|---|---|
| 1 | the rea source at `a56f7bb`, read in `/tmp/rea-640` | every claim about how rea works | `src/...:line`, `bridge/...:line`, `scripts/...:line` |
| 2 | the rea documentation at `a56f7bb` | documented behaviour, limits, and the responsible use rules | `{{mcp ...}}`, `{{cli ...}}`, `{{install ...}}`, and the other keys below |
| 3 | the capture, `capture/out/`, recorded on 2026-10-13 | every listing and every number in a figure | the file name |
| 4 | the format and architecture specifications, through `research/specs-formats.md` and `research/specs-isa.md` | ELF, Mach-O, x86-64, AArch64, calling conventions | `{{spec ...}}` |
| 5 | papers on program analysis and decompiler evaluation, through `research/theory-analysis.md` and `research/landscape-ml-research.md` | disassembly, lifting, type recovery, and the 2026 measurements | `{{paper ...}}` and a link |
| 6 | statutes and court decisions, through `research/legal.md` | the law of analysis and interoperability | `{{law ...}}` |
| 7 | tool release notes, through `research/landscape-tools.md` | Ghidra and other tool versions | the file |

The keys `law`, `spec`, and `paper` are declared `null` in `manual.json`, because their sources are not vendored. Quotes under those keys are not checked word for word. Every other key maps to a vendored file, and the audit checks each quote against it.

## The vendored files

Every file below lives under `research/sources/rea/` and is byte for byte the file at the tag, except the disclaimer. The repository is under the MIT license, copyright 2026 morluto, and the license text is vendored beside the files.

| Vendored file | Path in the rea repository | Cited as |
|---|---|---|
| `README.md` | `README.md` | `readme` |
| `docs-cli.md` | `docs/cli.md` | `cli` |
| `docs-mcp-contracts.md` | `docs/mcp-contracts.md` | `mcp` |
| `docs-ghidra-provider.md` | `docs/ghidra-provider.md` | `ghidra` |
| `docs-native-investigation.md` | `docs/native-investigation.md` | `native` |
| `docs-installation.md` | `docs/installation.md` | `install` |
| `docs-reconstruction-readiness.md` | `docs/reconstruction-readiness.md` | `readiness` |
| `docs-reconstruction-obligation-ledgers.md` | `docs/reconstruction-obligation-ledgers.md` | `ledgers` |
| `docs-javascript-application-graph.md` | `docs/javascript-application-graph.md` | `jsgraph` |
| `docs-tool-design.md` | `docs/tool-design.md` | `design` |
| `LICENSE` | `LICENSE` | |
| `DISCLAIMER-main-6e25cc3.md` | `DISCLAIMER.md` on the main branch at `6e25cc3`, a file the tag does not have | |

## The capture

The capture kit in `capture/` drove rea 6.4.0 and its MCP server on one Apple silicon Mac and wrote 65 files to `capture/out/`. The host ran macOS 26.2, Node 22.22.0, Ghidra 12.1.4 from Homebrew, OpenJDK 21.0.12.1, Apple clang 17.0.0, and WABT 1.0.42 (capture/out/00-versions.txt). The targets are programs written for this manual under `capture/fixtures/`, and `capture/out/00-fixtures.txt` holds the SHA-256 of each.

`python3 capture/run.py --check` recorded the whole set again into a temporary directory and compared it with `capture/out/`. The comparison masks timestamps, durations, ids, and temporary paths, and the 65 files matched. Evidence ids are content hashes and were compared unmasked. The `17-*` files are not rea output: they hold the two proofs of [lesson 36](phases/13-tools-and-protocols/36-rebuild-and-prove-equal), run by the kit over `ledger-x86_64-O1.o` with the host clang.

## The research files

| File | Holds |
|---|---|
| `research/brief.md` | the scope, the safety boundary, the pins, and the writing rules |
| `research/rea-architecture.md` | the layers of rea, the Ghidra launch, the bridge protocol, and the deadlines |
| `research/rea-tools.md` | every CLI command and MCP tool with its inputs and outputs |
| `research/rea-evidence-model.md` | the Evidence record, the ledger, bundles, and residual unknowns |
| `research/rea-reconstruction.md` | how two projects on the rea evidence pages rebuilt a function and proved it, and what rea itself offers |
| `research/rea-gaps.md` | 21 places where this course goes deeper than rea |
| `research/rea-640-repin.md` | what moved between the main branch and the 6.4.0 tag |
| `research/specs-formats.md`, `research/specs-isa.md` | ELF, Mach-O, x86-64, and AArch64 from their specifications |
| `research/theory-analysis.md` | disassembly, control-flow structuring, SSA, and type recovery from the papers |
| `research/landscape-ml-research.md` | decompiler evaluation and agent studies to October 2026, each with its URL and date |
| `research/landscape-tools.md` | Ghidra and other tool releases |
| `research/legal.md` | 17 U.S.C. 1201, the interoperability exceptions, and the court decisions |

Two external studies are cited in Parts 7 and 8 with their URLs. The first is Liu, Raff, and Micinski, When LLM Decompilers Recompile More and Preserve Less, arXiv 2609.05370, 2026. The second is Santos-Grueiro, When Binaries Talk Back, arXiv 2607.12507, 2026. Part 7 cites two specifications. They are the Intel 64 and IA-32 Architectures Software Developer's Manual, Volume 2, and the Arm Architecture Reference Manual for A-profile, DDI 0487.

Sources: manual.json (pin, sources, quoteSources, capture); research/brief.md; research/rea-640-repin.md; research/sources/rea/LICENSE; capture/README.md; capture/out/00-versions.txt, 00-fixtures.txt; the file list of research/
