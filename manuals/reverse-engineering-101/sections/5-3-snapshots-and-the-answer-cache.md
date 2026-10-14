# AnalysisSnapshot and the exact-match answer cache

> A snapshot caches exact answers under a query id bound to the target digest and the profile digest, and one successful mutating call turns the cache off.

The capture ran `rea function fixtures/ledger-arm64-O1 NAME --provider ghidra` four times, once per function, and each run took between 8 and 10 seconds (`capture/out/00-commands.txt`). Every run imported the same 33,872 bytes into a fresh Ghidra project and threw the project away. You want the second question about the same file to be free. When you finish this section, you can say which calls a snapshot can answer and build the query id by hand. You can also predict when rea refuses to replay or to save.

## Three things called a snapshot

The word covers three things in rea, and only one of them is a cache you can keep.

**Target snapshot:** the private copy of the input that the Ghidra launcher imports with `-readOnly` and `-deleteProject` (`src/ghidra/GhidraLauncher.ts:448-449`). It is deleted when the session closes, and nothing of the analysis survives it: "Each new provider session still imports the target into a fresh temporary project." {{mcp mcp-contracts.md:271-272}}

**Analysis snapshot cache:** the in-memory table of one session, `AnalysisSnapshotCache`, which holds up to 10,000 entries for one target identity (`src/application/binary/AnalysisSnapshotCache.ts:60`, `:79-84`). This is the cache this section is about.

**Snapshot file:** the JSON file that `close_binary` writes and `open_binary` reads. It holds the target identity, the provider binding, the cache entries, and the session's Evidence bundle (`src/domain/analysisSnapshot.ts:125-131`). The CLI documentation says what it is and what it is not: "These are cached observations, not a saved provider database: only eligible exact queries can reuse a result, and new or live queries can still require provider startup." {{cli cli.md:137-140}}

## The query id

**Query id:** `query_` followed by the SHA-256 of canonical JSON holding four things: the target, the binding, the operation, and the parameters (`analysisSnapshot.ts:326-334`). The target is the path-free identity, `sha256`, `kind`, `format`, and `architecture` (`:162-169`). The binding is the provider and its analysis profile (`:172-178`). For the capture that is the digest `01b5d08b08fb94678be5`, `executable`, `mach-o`, `arm64`, Ghidra `12.1.4`, and the profile below.

```listing
title: the Ghidra analysis profile that every cache key carries
source: capture/out/05-analyze-arm64-O1.json
lang: json
note: The profile as the binary_overview record carries it. Sixteen of the twenty parameters are cut.
---
"upstream_analysis_profile": {
  "provider": {
    "id": "ghidra",
    "name": "Ghidra",
    "version": "12.1.4"
  },
  "parameters": {
    "target_kind": "executable",
    "target_format": "mach-o",
    "architecture": "arm64",
    …
    "function_references": "complete-body-and-entry-reference-manager-v2",
    …
    "analyzer_preset": "ghidra-default"
  },
  "digest": "20565088524a2d0359b9b96f46ac48e679d774c7b0092c56abc06de8fdbec11c"
},
```

The parameters are version strings, one per observation contract that the Ghidra adapter makes (`src/ghidra/GhidraAnalysisProfile.ts:92-100`). The digest is the SHA-256 of the canonical JSON of provider and parameters (`src/domain/analysisProfile.ts:62-64`). A cache entry matches only when the binding's provider and digest equal the selected profile's (`analysisSnapshot.ts:190-198`, `analysisProfile.ts:53-60`). So a rea release that moves `function_references` from `-v2` to `-v3` changes the digest, and every entry made under the old digest stops matching. That is what exact means in the thesis of this section. It is also why all eight rows of the bundle summary carry the digest `20565088524a2d0359` ([export and import](#s-evidence-bundles-export-and-import)).

## Which calls the cache answers

`isSnapshotCacheable` decides, before any provider runs, whether a call can be answered from the cache (`AnalysisSnapshotCache.ts:63-77`). A call qualifies when all of these hold.

- The operation is not one of the stateful ones, `health`, `current_address`, `current_procedure`, `current_document`, `goto_address`, or `list_documents` (`:35-42`).
- An operation that is scoped to a document names its `document` (`:53-57`).
- An operation that defaults to the cursor, such as `xrefs`, names its `address` (`:44-51`).
- The capability declares `mutatesArtifact: false`, a `cachePolicy` other than `live`, and no permission change (`:73-77`).

The Ghidra adapter marks every operation except the mutating ones and `list_documents` with `cachePolicy: "snapshot"` (`src/ghidra/GhidraProviderCapabilities.ts:177-184`). `prepareSessionExecution` computes the id and looks it up (`src/application/binary/BinarySessionExecution.ts:79-85`). `BinarySession` returns a hit without touching the provider (`src/application/binary/BinarySession.ts:548-563`). The replayed answer carries one extra limitation: "Loaded from a local REA analysis snapshot; this call did not re-run the provider." (`AnalysisSnapshotCache.ts:284-287`).

On a miss the provider runs, and the result is bound to the profile and the target (`BinarySession.ts:564-570`). An Evidence record is then created and recorded, and a cache entry is stored under the id (`:574-602`).

The capture shows no replay, because no two of its 25 MCP calls had the same operation and parameters. The first Ghidra-backed call after `open_binary` was `list_procedures`, and it took between 6 and 7 seconds while the headless import ran. Every later call on that target took under 100 ms (`capture/out/10-mcp-session.txt`). Those later calls were fast because the bridge was already running, not because of the cache. A repeat of `analyze_function` with `"procedure": "_percent_change"` would have been the first replay.

```figure
id: fig-5-4
kind: decision
title: one analyze_function call through the snapshot cache
claim: A cacheable call becomes a query id over the target, the binding, the operation, and the parameters, and a successful mutating call later makes every id useless.
caption: Read top to bottom. The dashed reply is a replay, the solid call a provider run, and the dashed amber arrow the state change after a mutation. Values are from capture/out/10-mcp-09-analyze-function-percent-change-O1.json and 10-mcp-04-binary-session.json.
```

## Save and load

`close_binary` takes `snapshot_path` and `overwrite` (`src/server/registerCloseLifecycleTool.ts:64-93`). `closeWithSnapshot` drains the calls in progress, exports the snapshot, writes the file, and closes the provider (`BinarySession.ts:344-369`). Its receipt adds `primitive_entries`, `workflow_entries`, and `evidence_records`. `open_binary` takes `snapshot_path` too, reads the file before it opens the target, and imports the entries into the new session (`src/server/registerSessionTools.ts:192-207`). The capture closed both targets without a path, so its two `close_binary` results are `null` (`10-mcp-15-close-binary-O1.json`, `10-mcp-25-close-binary-O2.json`). On the CLI the flag is `--snapshot`: "An exact CLI cache hit is read before starting a provider process." {{cli cli.md:128}}

Loading a file is a full check. The entries must be in canonical id order (`analysisSnapshot.ts:393-396`), and every query id is recomputed and must match (`:407-414`). No id appears twice (`:415-417`). Every entry must have an Evidence record in the bundle with the same profile and the same result (`:418-426`). A bundle record for another target fails the whole file (`:380-392`).

Writing is atomic: the file is staged with mode `0600`, synced, and renamed or hard-linked into place (`src/application/JsonFiles.ts:164-186`). Importing into a session whose target or profile differs fails with "Analysis snapshot profile_mismatch: target, provider, or analysis profile does not match the active binary" (`AnalysisSnapshotCache.ts:197-206`).

## Invalidation after a mutating call

Some Ghidra operations write to the session database, such as `annotate_native_function`, which renames a function or adds a comment. Each of them declares `mutates_artifact: true`, and each carries a limitation that names the consequence.

```listing
title: a mutating operation as binary_session describes it
source: capture/out/10-mcp-04-binary-session.json
lang: json
note: Six of the seven limitations and the remaining effects are cut.
---
{
  "operation": "annotate_native_function",
  "available": true,
  "reason": null,
  "availability_code": null,
  "effects": {
    "mutates_artifact": true,
    …
  },
  "limitations": [
    …
    "Metadata edits invalidate immutable analysis snapshots and are discarded on close. CLI returns the updated dossier before session cleanup; this is not a saved Ghidra project."
  ]
}
```

When such a call returns ok, `BinarySession` calls `invalidateSnapshot` (`BinarySession.ts:603-605`). The cache is emptied and a flag is set (`src/application/binary/BinarySessionRecords.ts:235-239`). From then on every lookup returns nothing (`:191`), every new result is not stored (`:198`), and an export fails with "Analysis snapshots are unavailable after analysis metadata mutations" (`:104-114`). The error adds the way out: export the Evidence with `export_evidence_bundle`, close the target without a snapshot, and reopen it (`:28-29`). An import after a mutation is refused the same way (`:139-147`).

At 6.4.0 the order is: call the provider, then invalidate on success. A mutating call that fails leaves the cache on, and a write that reached Ghidra before the failure is not detected. The main branch moved the invalidation before the call (research/rea-640-repin.md:27, :46), and a reader on a later release should check which order they have.

```takeaways
- Repeat a query with the same parameters to get the cached answer, and read the added limitation.
- Save a snapshot with `close_binary` and `snapshot_path` before you annotate anything.
- Expect a `profile_mismatch` refusal after a rea upgrade, and run the analysis again.
- Treat a snapshot as answers to past questions, never as a saved Ghidra project.
```

Sources: src/domain/analysisSnapshot.ts, src/domain/analysisProfile.ts, src/application/binary/AnalysisSnapshotCache.ts, src/application/binary/BinarySession.ts, src/application/binary/BinarySessionExecution.ts, src/application/binary/BinarySessionRecords.ts, src/application/JsonFiles.ts, src/server/registerCloseLifecycleTool.ts, src/server/registerSessionTools.ts, src/ghidra/GhidraLauncher.ts, src/ghidra/GhidraAnalysisProfile.ts, src/ghidra/GhidraProviderCapabilities.ts at rea-agents-6.4.0 (a56f7bb); research/rea-architecture.md, research/rea-gaps.md, research/rea-640-repin.md; research/sources/rea/docs-cli.md, docs-mcp-contracts.md; capture/README.md; capture/out/00-commands.txt, 05-analyze-arm64-O1.json, 10-mcp-04-binary-session.json, 10-mcp-09-analyze-function-percent-change-O1.json, 10-mcp-15-close-binary-O1.json, 10-mcp-25-close-binary-O2.json, 10-mcp-session.txt
