// Line illustrations of the staircase steps, ported verbatim from the mockup
// (docs/bugs&correction/index (1).html). viewBox 200x140, strokes use
// currentColor, the orange accent is hard-coded like in the mockup.
// Static, authored markup only: safe to inject with dangerouslySetInnerHTML.

const A = "#E87C0A"

function t(
  x: number,
  y: number,
  s: string,
  anchor = "middle",
  fill = "currentColor",
  size = 10,
  fam = "JetBrains Mono, monospace"
) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-family="${fam}" fill="${fill}" stroke="none">${s}</text>`
}

export const serviceIllustrations: Record<string, string> = {
  // 01 Site: the shop window
  "site-web": `<path d="M14 126 H186"/><path d="M44 126 V52 H156 V126"/><path stroke="${A}" d="M36 52 L44 36 H156 L164 52 Z"/><path stroke="${A}" d="M36 52 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 16 0"/><path d="M78 36 V20 H122 V36"/>${t(100, 31, "www")}<rect x="56" y="70" width="50" height="40" rx="3"/><path d="M64 80 l10 -6 M64 92 l18 -12"/><path d="M120 126 V78 H146 V126"/><circle cx="140" cy="104" r="1.8"/><path d="M28 126 c0 -10 -5 -15 -10 -19 M28 126 c0 -12 6 -17 11 -21"/><path stroke="${A}" d="M178 18 v10 M173 23 h10"/>`,
  // 02 Database: the chest of drawers
  "base-de-donnees": `<path d="M14 126 H186"/><path d="M70 126 V22 H140 V126"/><path d="M70 57 H140 M70 92 H140"/><path d="M95 44 h20 M95 79 h20 M95 114 h20"/>${t(62, 43, "clients", "end")}${t(62, 78, "commandes", "end")}${t(62, 113, "produits", "end")}<rect stroke="${A}" x="150" y="14" width="40" height="30" rx="3"/><path stroke="${A}" d="M157 24 h24 M157 33 h16"/><path stroke="${A}" d="M142 42 q4 -2 8 -6"/>`,
  // 03 Online sales: the cart and the moon
  "vente-en-ligne": `<path d="M14 128 H186"/><path d="M22 32 H40 L56 98 H146 L160 50 H44"/><circle cx="70" cy="113" r="8"/><circle cx="134" cy="113" r="8"/><rect x="66" y="60" width="22" height="22" rx="2"/><rect stroke="${A}" x="94" y="54" width="22" height="28" rx="2"/><path d="M124 82 V66 q7 -9 14 0 V82"/><circle stroke="${A}" cx="172" cy="96" r="11"/>${t(172, 100, "€", "middle", A, 12, "Manrope, sans-serif")}<path stroke="${A}" d="M172 14 a13 13 0 1 0 12 20 a10 10 0 1 1 -12 -20 z"/><path d="M150 20 v6 M147 23 h6"/>`,
  // 04 Business app: the dedicated screen
  application: `<path d="M14 126 H186"/><rect x="46" y="28" width="108" height="72" rx="5"/><path d="M32 114 H168 L158 100 H42 Z"/><path d="M58 42 h34"/><path stroke="${A}" d="M64 90 V74 M76 90 V64 M88 90 V70 M100 90 V56"/><path d="M116 52 l3 3 l6 -6 M116 68 l3 3 l6 -6 M116 84 l3 3 l6 -6"/><path d="M130 53 h14 M130 69 h14 M130 85 h10"/>`,
  // 05 Connections: tools talking to each other
  api: `<rect x="10" y="14" width="56" height="30" rx="6"/>${t(38, 33, "caisse")}<rect x="134" y="14" width="56" height="30" rx="6"/>${t(162, 33, "stock")}<rect x="72" y="104" width="56" height="30" rx="6"/>${t(100, 123, "clients")}<rect stroke="${A}" x="78" y="54" width="44" height="32" rx="9"/>${t(100, 74, "app", "middle", A, 11)}<path d="M66 32 C80 32 72 62 78 66"/><path d="M134 32 C120 32 128 62 122 66"/><path d="M100 86 V104"/><circle cx="73" cy="44" r="2.6" fill="${A}" stroke="none"/><circle cx="127" cy="44" r="2.6" fill="${A}" stroke="none"/><circle cx="100" cy="95" r="2.6" fill="${A}" stroke="none"/>`,
  // 06 Automations: the dominoes
  automatisations: `<path d="M10 120 H190"/><rect stroke="${A}" x="38" y="76" width="12" height="44" rx="2" transform="rotate(62 50 120)"/><rect x="60" y="76" width="12" height="44" rx="2" transform="rotate(42 72 120)"/><rect x="82" y="76" width="12" height="44" rx="2" transform="rotate(22 94 120)"/><rect x="104" y="76" width="12" height="44" rx="2" transform="rotate(7 116 120)"/><rect x="126" y="76" width="12" height="44" rx="2"/><rect x="148" y="76" width="12" height="44" rx="2"/><path stroke="${A}" d="M10 60 H32 M26 54 l6 6 l-6 6"/><path stroke="${A}" d="M166 46 l7 7 l14 -16"/>`,
  // 07 AI & MCP: the universal plug
  "ia-mcp": `<path stroke="${A}" d="M40 32 l6 16 l16 6 l-16 6 l-6 16 l-6 -16 l-16 -6 l16 -6 z"/>${t(40, 58, "IA", "middle", "currentColor", 9)}<path d="M68 22 v8 M64 26 h8"/><path d="M40 82 C40 106 66 100 88 100"/><rect x="88" y="90" width="22" height="20" rx="4"/><path d="M110 95 h13 M110 105 h13"/><rect stroke="${A}" x="122" y="84" width="68" height="32" rx="7"/><circle cx="142" cy="100" r="5"/><circle cx="160" cy="100" r="5"/><circle cx="177" cy="100" r="5"/>${t(156, 76, "MCP", "middle", A, 11)}`,
}
