'use strict';

const { figure, color } = require('../../../_shared/figkit.js');

const rows = [
  ['operation', 'analyze_function', 'the MCP name'],
  ['available', 'true', 'false carries reason and code'],
  ['reason', 'null', 'text when available is false'],
  ['availability_code', 'null', 'a code when available is false'],
  ['effects.mutates_artifact', 'false', 'true for 3 Ghidra operations'],
  ['effects.launches_process', 'true', 'every Ghidra operation'],
  ['effects.may_show_ui', 'false', 'true for every Hopper operation'],
  ['effects.may_access_network', 'false', 'true for the IDA adapter'],
  ['effects.may_write_filesystem', 'true', 'every Ghidra operation'],
  ['effects.changes_permissions', 'false', 'false in the whole capture'],
  ['effects.requires_root', 'false', 'false in the whole capture'],
  ['limitations', '9 strings', '4 session, 5 for the dossier'],
];

module.exports = figure('fig-2-3', {
  height: 380,
  title: 'One capability record: analyze_function under ghidra',
  desc: 'The capability record for analyze_function in the ghidra candidate of rea capabilities, drawn as a table of twelve fields with the value each one holds and a note. operation is analyze_function. available is true, so reason and availability_code are null. Of the seven effects, launches_process and may_write_filesystem are true, as for every Ghidra operation, and mutates_artifact, may_show_ui, may_access_network, changes_permissions, and requires_root are false. limitations has 9 strings, 4 shared by the session and 5 specific to the dossier.',
}, f => {
  f.kicker(20, 18, 'one capability record');
  f.kicker(396, 18, 'what the value means');
  f.box({ x: 20, y: 26, w: 360, h: 28, hue: 'violet', title: 'analysis_provider_candidates[0].capabilities[2]', align: 'left', titleSize: 11, pad: 10 });
  rows.forEach(([field, value, note], index) => {
    const y = 54 + index * 26;
    f.rect(20, y, 360, 26, { fill: color('paper'), stroke: color('panel-edge') });
    f.text(30, y + 17, field, { size: 12, hue: 'ink-soft' });
    f.text(250, y + 17, value, { size: 12 });
    f.rule(380, y + 13, 390, y + 13, { hue: 'violet' });
    f.text(396, y + 17, note, { size: 11, serif: true, hue: 'ink-soft' });
  });
});
