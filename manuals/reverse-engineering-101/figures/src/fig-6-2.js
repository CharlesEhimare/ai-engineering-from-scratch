'use strict';

const { figure, color } = require('../../../_shared/figkit.js');

const sections = [
  ['Type', '0x0a to 0x1a', 'count 3'],
  ['Import', '0x1c to 0x27', 'count 1'],
  ['Function', '0x29 to 0x2e', 'count 4'],
  ['Memory', '0x30 to 0x33', 'count 1'],
  ['Export', '0x35 to 0x6e', 'count 5'],
  ['Code', '0x71 to 0x10f', 'count 4'],
  ['Data', '0x111 to 0x122', 'count 1'],
];

module.exports = figure('fig-6-2', {
  height: 300,
  title: 'WebAssembly on rea 6.4.0 and with wabt directly',
  desc: 'Left column, rea 6.4.0: the CLI command rea inspect-wasm-artifact answers COMMAND_NOT_FOUND, not a command for rea, and the MCP call tools/call inspect_wasm_artifact answers JSON-RPC error -32602, Tool inspect_wasm_artifact not found. Right column, wabt 1.0.42 with wasm-objdump -h -x on ledger.wasm, 290 bytes, wasm version 1: seven sections with their byte ranges and counts, Type 0x0a to 0x1a with 3 entries, Import 0x1c to 0x27 with 1, Function 0x29 to 0x2e with 4, Memory 0x30 to 0x33 with 1, Export 0x35 to 0x6e with 5, Code 0x71 to 0x10f with 4, and Data 0x111 to 0x122 with 1 segment. wasm2wat prints four functions, one import env.log, and a data segment at 1024.',
}, f => {
  f.kicker(20, 18, 'A · rea 6.4.0');
  const cli = f.box({ x: 20, y: 28, w: 290, h: 48, hue: 'blue', title: 'rea inspect-wasm-artifact', sub: 'CLI, capture 16-inspect-wasm-artifact.json' });
  const cliError = f.box({ x: 20, y: 100, w: 290, h: 48, hue: 'rose', title: 'COMMAND_NOT_FOUND', sub: "not a command for 'rea'" });
  f.arrow([cli.cx, 76], [cli.cx, cliError.y - 1], { style: 'fail' });
  const mcp = f.box({ x: 20, y: 172, w: 290, h: 48, hue: 'indigo', title: 'tools/call inspect_wasm_artifact', sub: 'MCP, capture 10-mcp-24' });
  const mcpError = f.box({ x: 20, y: 244, w: 290, h: 48, hue: 'rose', title: 'JSON-RPC error -32602', sub: 'Tool inspect_wasm_artifact not found' });
  f.arrow([mcp.cx, 220], [mcp.cx, mcpError.y - 1], { style: 'fail' });

  f.kicker(330, 18, 'B · wabt 1.0.42, wasm-objdump -h -x');
  f.box({ x: 330, y: 28, w: 290, h: 26, hue: 'olive', title: 'ledger.wasm, 290 bytes, wasm 0x1', align: 'left', titleSize: 11.5, pad: 10 });
  sections.forEach(([name, range, count], index) => {
    const y = 54 + index * 26;
    f.rect(330, y, 290, 26, { fill: color('paper'), stroke: color('olive-ink') });
    f.text(340, y + 17, name, { size: 11, weight: 700, hue: 'olive' });
    f.text(420, y + 17, range, { size: 11 });
    f.text(545, y + 17, count, { size: 11, hue: 'ink-soft' });
  });
  f.text(330, 258, 'wasm-validate --enable-all: exit 0, no output.', { size: 11, serif: true, hue: 'ink-soft' });
  f.text(330, 274, 'wasm2wat: 4 funcs, import env.log, data at 1024.', { size: 11, serif: true, hue: 'ink-soft' });
  f.text(330, 290, 'From capture/out/16-wabt.txt.', { size: 11, serif: true, hue: 'ink-soft' });
});
