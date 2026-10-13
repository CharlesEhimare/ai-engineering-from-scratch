# Fixtures for lesson 35

Every file here is a program we wrote and compiled ourselves, or a record produced by running a tool on that program.

| File | What it is |
|---|---|
| `ledger.c` | The shared fixture source: `percent_change`, `grade`, `total`, `grade_label`. SHA-256 `4564c3e7e39fe4d10530bb6489722924ad3f34ffd78d8fa203a5e1fe832fdacb`. |
| `ledger-x86_64-O1.o` | x86-64 ELF relocatable object. SHA-256 `9a4a8082ba5e285a732552981a6935e0c5255725664f380e37c44ebfb04d803f`. |
| `harness.c` | A host test program that includes `ledger.c` and prints one function result per run. `main.py` compiles it with the host compiler. |
| `rea-evidence-percent-change.json` | rea 6.4.0 Evidence for `analyze_function` on `percent_change` with the Ghidra 12.1.4 provider. `evidence_id` `ev_4b69a47e7269aca05a56c35ea00439c7ec037a7e03e884a2ad78b1fb49df290e`. |
| `rea-evidence-grade.json` | rea 6.4.0 Evidence for `analyze_function` on `grade`. `evidence_id` `ev_f91f0cdc1943edeb73e7847d142229b63aea975064521e22cef4c0a2fecd8f8e`. |
| `rea-snapshot.json` | The rea analysis snapshot written by the two runs above. Two `query_` entries and an evidence bundle with the same two records. |
| `run-evidence.json` | Observed run records from the host build of `harness.c`, exported by `python3 code/main.py --record code/fixtures/run-evidence.json` on 2026-10-13 (macOS 26.2, arm64, Apple clang 17.0.0). |

Build command for the object (Apple clang 17.0.0, clang-1700.6.3.2, macOS 26.2, 2026-10-13):

```bash
clang -target x86_64-unknown-linux-gnu -O1 -fno-asynchronous-unwind-tables -c ledger.c -o ledger-x86_64-O1.o
```

rea commands (rea-agents 6.4.0, Ghidra 12.1.4, OpenJDK 21.0.12.1, `GHIDRA_INSTALL_DIR=/opt/homebrew/Cellar/ghidra/12.1.4/libexec`, `JAVA_HOME=/opt/homebrew/opt/openjdk@21`), run from this directory on 2026-10-13:

```bash
npx -y rea-agents@6.4.0 function "$PWD/ledger-x86_64-O1.o" grade --provider ghidra --format json --snapshot "$PWD/rea-snapshot.json" > rea-evidence-grade.json
npx -y rea-agents@6.4.0 function "$PWD/ledger-x86_64-O1.o" percent_change --provider ghidra --format json --snapshot "$PWD/rea-snapshot.json" > rea-evidence-percent-change.json
```

The first command took 11 s and the second 9 s, each with a fresh Ghidra import. A third run of the `grade` command against the same snapshot took 2.3 s and returned the same record with the same `evidence_id`.
