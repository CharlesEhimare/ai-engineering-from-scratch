# export_evidence_bundle, evidence-export, and evidence-import

> An Evidence bundle is seven sorted arrays in canonical JSON, so the same records give the same bytes from the MCP server and from the CLI.

Your agent's MCP connection closes tonight, and with it the eight records it collected on `ledger-arm64-O1`. Tomorrow a colleague wants to check them on another Mac, without Ghidra. When you finish this section, you can export a session to a bundle and read its summary without an engine. You can also import it into a new session or a CLI check.

## export_evidence_bundle

**Evidence bundle:** one JSON object with seven arrays (`src/domain/evidenceBundle.ts:36-44`). They are `artifacts`, `providers`, `environments`, `scenarios`, `captures`, `unknowns`, and `records`. The first five are built from the records themselves (`:72-100`). They hold the distinct subjects as digest, format, and architecture, the distinct providers, and the distinct environments. Then come the controlled-replay records and the process-capture records. Records are sorted by `evidence_id`, and the order carries no meaning (`:76-78`).

The MCP tool takes a `path` and an `overwrite` flag (`src/server/registerSessionRecordTools.ts:37-66`). It answers with the path, the byte count, and the record and unknown counts.

```listing
title: export_evidence_bundle after eight calls on ledger-arm64-O1
source: capture/out/10-mcp-14-export-evidence-bundle-O1.json
lang: json
note: The request and the text copy of the result are cut.
---
"structuredContent": {
  "result": {
    "path": "$WORK/bundle-O1.json",
    "bytes": 172153,
    "records": 8,
    "unknowns": 0
  }
}
```

The write is canonical and atomic. `writeEvidenceBundle` validates the bundle again and streams canonical JSON parts (`src/application/EvidenceBundleFiles.ts:66-97`). `writeTextParts` creates a staging file with `wx` and mode `0600` and syncs it (`src/application/JsonFiles.ts:164-186`). It then renames the file over the destination when `overwrite` is true, or hard-links it when the destination must not exist. The contract says the same: "Complete bundle exports stream canonical JSON into an atomically published file." {{mcp mcp-contracts.md:307-308}}

The capture copied the file the server wrote to `11-bundle-O1.json`, with the capture directory masked and a newline added. Its seven arrays hold one artifact, one provider, no environments, no scenarios, no captures, no unknowns, and eight records.

```listing
title: the two bundle files of the capture
source: capture/out/11-bundles.txt
lang: text
note: Nothing is cut.
---
28b743a3ea4476998fb4a865e48232ec3127d28ca762f6b20de91230e4262933  171730  11-bundle-O1.json (the bytes export_evidence_bundle wrote, with the capture path masked and a newline added)
961261dab7287443f43222bc48d6993dd32943c8fbc88006f0f657bd9a234f9d  283753  11-bundle-O2.json (the bytes export_evidence_bundle wrote, with the capture path masked and a newline added)
```

## inspect-evidence-bundle

You do not need rea's engine, or a session, to read a bundle. `rea inspect-evidence-bundle` takes a JSON argument with `path`, `detail`, and optional `filters` (`src/cli/analysisViewCommands.ts:25-39`) and prints one row per record without the payloads. The MCP tool `get_evidence_bundle` shares the projection for the records of a live session (`src/server/registerSessionRecordTools.ts:68-82`).

```listing
title: the summary of bundle O1, first record
source: capture/out/11-inspect-evidence-bundle-O1.json
lang: json
note: The subject and provider of the first record and the seven other records are cut.
---
{
  "kind": "evidence-bundle-summary",
  "filters": {},
  "total_retained_records": 8,
  "matching_records": 8,
  "unknown_revisions": 0,
  "records": [
    {
      "evidence_id": "ev_0000b698c9b0cfc40a11bf8f609d4dd136c0fb468a551bf970d1521fbcb413d0",
      …
      "operation": "analyze_function",
      "confidence": "observed",
      "authority": "shipped-artifact",
      "analysis_profile_digest": "20565088524a2d0359b9b96f46ac48e679d774c7b0092c56abc06de8fdbec11c",
      "retention": "complete-record",
      "limitation_count": 10,
      "native_dossier": {
        "available": true,
        "procedure_address": "0x100000500",
        "procedure_name": "_percent_change",
        …
```

The eight rows name four `analyze_function` dossiers, `_percent_change`, `_grade`, `_total`, and `_grade_label`, and one record each for `list_procedures`, `procedure_assembly`, `xrefs`, and `list_strings`. Every row carries the same profile digest, `20565088524a2d0359`, because one Ghidra session produced them all. The O2 bundle has two rows, the `_total` and `_percent_change` dossiers of the -O2 build (`11-inspect-evidence-bundle-O2.json`). The contract names the filters a summary accepts: "Optional `filters` match exact `evidence_id`, `operation`, `target_sha256`, `analysis_profile_digest` or `procedure_address`." {{mcp mcp-contracts.md:314-315}}

## evidence-export and evidence-import on the CLI

`rea evidence-export SOURCE OUTPUT` reads a bundle, validates it, and writes it again in canonical form (`src/cliEvidenceCommands.ts:31-49`, `src/application/EvidenceBundleCommands.ts:27-38`). The answer is the path, the byte count, and the record count (`:62-72`). The capture exported `11-bundle-O1.json` to a work file and compared the digests.

```listing
title: the MCP export and the CLI export of the same records
source: capture/out/12-evidence-export.txt
lang: text
note: Nothing is cut.
---
28b743a3ea4476998fb4a865e48232ec3127d28ca762f6b20de91230e4262933  171730  export_evidence_bundle over MCP, out/11-bundle-O1.json
9659bb79c304ea69520383c719e0e3464f9003363f8c8b3ac197ef3c20b38e15  171729  evidence-export over the CLI, $WORK/canonical-O1.json
same bytes as the MCP export: no
same JSON content as the MCP export: yes
```

The one byte of difference is the newline the kit appended to its copy. Strip it, and the copy has 171,729 bytes and the digest `9659bb79c304ea69`, the digest of the CLI file. The MCP server and the CLI write the same canonical bytes for the same records, which is what the thesis of this section promised.

`rea evidence-import PATH` validates a bundle and reports its counts. On the CLI there is no session, so `imported` and `total` are both the number of records in the file (`EvidenceBundleCommands.ts:14-24`): `{"imported": 8, "unknowns_added": 0, "total": 8}` in `13-evidence-import.json`. The CLI documentation draws the line: "Separate CLI calls consume full saved records." {{cli cli.md:158}}

## import_evidence_bundle into a live session

In MCP the same verb merges into the connection's ledger. The handler reads and validates the file, calls `importEvidenceBundle`, and answers with the records added, the unknown revisions added, and the new total (`src/server/registerSessionRecordTools.ts:84-118`). The ledger adds each record it does not hold and keeps a record it already holds (`src/application/investigation/EvidenceLedger.ts:73-118`). It refuses a record whose id it holds with different content: "Conflicting evidence record".

```listing
title: bundle O1 imported into the session that analysed O2
source: capture/out/10-mcp-23-import-evidence-bundle-O1.json
lang: json
note: The request and the text copy of the result are cut.
---
"result": {
  "imported": 6,
  "unknowns_added": 0,
  "total": 14
}
```

Six of eight, and a total of fourteen. The session had closed O1 before, and `close_binary` empties the ledger: "Opening another target preserves retained records; `close_binary` clears them, even when no binary is active." {{mcp mcp-contracts.md:393-395}}

So the O1 records were gone when O2 opened. Then `compare_functions` ran twice, with the O1 dossiers of `_percent_change` and `_total` passed inline. The tool records both sides before its own result (`src/server/registerFunctionComparisonTool.ts:79-82`, `sessionEvidence.ts:7-16`). Those two O1 records were back in the ledger, so the import added the other six.

The fourteen are the six new records and eight that were already there:

- The two O2 dossiers, from calls 17 and 18.
- The two O1 dossiers that the comparisons recorded as their sources.
- The two comparison records, from calls 20 and 21.
- The `verify_reconstruction` record, from call 22.
- The mutation record of the unknown that the `_total` comparison opened ([residual unknowns](#s-residual-unknowns-and-coverage)).

[Figure](#fig-5-5) follows the bundle from the session to its four readers.

```figure
id: fig-5-5
kind: flow
title: one bundle from the MCP session to four readers
claim: One canonical file leaves the session, and the CLI summary, the CLI export, the CLI import, and a second MCP session all read it without Ghidra.
caption: Read left to right. Solid teal is a durable write, solid ink a call. From capture/out/10-mcp-14-export-evidence-bundle-O1.json, 11-bundles.txt, 11-inspect-evidence-bundle-O1.json, 12-evidence-export.txt, 13-evidence-import.json, and 10-mcp-23-import-evidence-bundle-O1.json.
```

```takeaways
- Export a bundle before `close_binary`, because closing empties the ledger.
- Read a bundle with `rea inspect-evidence-bundle` before you import it anywhere.
- Compare bundle digests, never file names, when two people exchange evidence.
- Expect `imported` below the record count when the session already holds some of the records.
```

Sources: src/domain/evidenceBundle.ts, src/server/registerSessionRecordTools.ts, src/application/EvidenceBundleFiles.ts, src/application/EvidenceBundleCommands.ts, src/application/JsonFiles.ts, src/cliEvidenceCommands.ts, src/cli/analysisViewCommands.ts, src/application/investigation/EvidenceLedger.ts, src/server/registerFunctionComparisonTool.ts, src/server/sessionEvidence.ts at rea-agents-6.4.0 (a56f7bb); research/rea-evidence-model.md, research/rea-tools.md; research/sources/rea/docs-mcp-contracts.md, docs-cli.md; capture/README.md; capture/out/10-mcp-14-export-evidence-bundle-O1.json, 10-mcp-23-import-evidence-bundle-O1.json, 11-bundle-O1.json, 11-bundles.txt, 11-inspect-evidence-bundle-O1.json, 11-inspect-evidence-bundle-O2.json, 12-evidence-export.json, 12-evidence-export.txt, 13-evidence-import.json
