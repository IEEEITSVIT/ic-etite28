#!/usr/bin/env node
// Makes public pages editable from the inline CMS:
//   • wraps visible JSX text and text-rendering expressions ({item.title}) in <E f="…">
//   • swaps next/image for components/cms/EImage (admin-replaceable images)
// Idempotent: already-wrapped text is skipped. Usage: node scripts/cms-codemod.mjs [--dry]
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const DRY = process.argv.includes("--dry");
const ROOT = process.cwd();

const PAGES = [
  "", "about", "advisory", "call-for-papers", "committees", "contact", "hackathon", "hotels", "ic-ETITE20", "ic-ETITE24",
  "important-dates", "keynote-speakers", "registration", "sponsorship", "team", "technext", "tracks", "venue", "visa",
].map((p) => path.join("app", p, "page.tsx"));

// Components that are not page content (or are managed elsewhere) stay untouched.
const SKIP_COMPONENTS = new Set(["AppNavbar", "TickerBar", "StartupAnimation", "LoadingScreen", "AnnouncementBar", "BackToTop"]);
const COMPONENTS = fs
  .readdirSync("components")
  .filter((f) => f.endsWith(".tsx") && !SKIP_COMPONENTS.has(f.replace(".tsx", "")))
  .map((f) => path.join("components", f));

const NO_WRAP_TAGS = new Set(["option", "title", "textarea", "style", "script", "svg", "text", "tspan", "E"]);

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", rarr: "→", larr: "←", middot: "·", copy: "©", reg: "®", trade: "™", hellip: "…", bull: "•", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", times: "×", deg: "°", hearts: "♥", star: "★" };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => {
    if (e[0] === "#") return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e.toLowerCase()] ?? m;
  });

// Same whitespace rules React/Babel apply to JSX text.
function cleanJsxText(raw) {
  const lines = raw.split(/\r\n|\n|\r/);
  let lastNonEmpty = 0;
  lines.forEach((l, i) => {
    if (/[^ \t]/.test(l)) lastNonEmpty = i;
  });
  let out = "";
  lines.forEach((line, i) => {
    let t = line.replace(/\t/g, " ");
    if (i !== 0) t = t.replace(/^[ ]+/, "");
    if (i !== lines.length - 1) t = t.replace(/[ ]+$/, "");
    if (t) {
      if (i !== lastNonEmpty) t += " ";
      out += t;
    }
  });
  return decode(out);
}

const fileId = (file) => {
  if (file.startsWith("app")) return path.dirname(file).replace(/^app\/?/, "") || "home";
  return `c.${path.basename(file, ".tsx")}`;
};

function tagName(el) {
  const open = ts.isJsxElement(el) ? el.openingElement : ts.isJsxSelfClosingElement(el) ? el : null;
  return open ? open.tagName.getText() : "";
}

// Text may be wrapped only if no enclosing element forbids extra markup.
function allowed(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isJsxElement(p) && NO_WRAP_TAGS.has(tagName(p))) return false;
    if (ts.isJsxAttribute(p)) return false;
  }
  return true;
}

const WRAPPABLE = new Set([
  ts.SyntaxKind.PropertyAccessExpression,
  ts.SyntaxKind.ElementAccessExpression,
  ts.SyntaxKind.StringLiteral,
  ts.SyntaxKind.NoSubstitutionTemplateLiteral,
  ts.SyntaxKind.TemplateExpression,
  ts.SyntaxKind.Identifier,
]);

let totalText = 0;
let totalExpr = 0;
let totalImg = 0;
const touched = [];

for (const file of [...PAGES, ...COMPONENTS]) {
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const id = fileId(file);
  const edits = [];
  let nText = 0;
  let nExpr = 0;

  const visit = (node) => {
    const parentIsChildren = node.parent && (ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent));
    if (parentIsChildren && ts.isJsxText(node) && allowed(node)) {
      const text = cleanJsxText(node.getFullText());
      if (text.trim()) {
        edits.push({ start: node.getFullStart(), end: node.getEnd(), text: `<E f="${id}">{${JSON.stringify(text)}}</E>` });
        nText++;
      }
    } else if (parentIsChildren && ts.isJsxExpression(node) && node.expression && allowed(node)) {
      const ex = node.expression;
      const skipIdent = ts.isIdentifier(ex) && (ex.text === "children" || /^[A-Z]/.test(ex.text));
      if (WRAPPABLE.has(ex.kind) && !skipIdent) {
        edits.push({ start: node.getStart(), end: node.getEnd(), text: `<E f="${id}">${node.getText()}</E>` });
        nExpr++;
        return; // nothing inside a simple expression needs wrapping
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  let out = src;
  for (const e of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.text + out.slice(e.end);

  let nImg = 0;
  out = out.replace(/import Image from "next\/image";/, () => {
    nImg++;
    return 'import Image from "@/components/cms/EImage";';
  });

  if (edits.length && !/import E from "@\/components\/cms\/E";/.test(out)) {
    // Insert after the last top-level import.
    const imports = sf.statements.filter(ts.isImportDeclaration);
    const lastImportText = imports.length ? imports[imports.length - 1].getText() : null;
    if (lastImportText && out.includes(lastImportText)) {
      const at = out.indexOf(lastImportText) + lastImportText.length;
      out = `${out.slice(0, at)}\nimport E from "@/components/cms/E";${out.slice(at)}`;
    } else {
      const directive = /^(["']use client["'];?\s*\n)/.exec(out);
      out = directive ? `${directive[1]}import E from "@/components/cms/E";\n${out.slice(directive[1].length)}` : `import E from "@/components/cms/E";\n${out}`;
    }
  }

  if (out !== src) {
    touched.push(`${file}: ${nText} text, ${nExpr} expr${nImg ? ", image" : ""}`);
    totalText += nText;
    totalExpr += nExpr;
    totalImg += nImg;
    if (!DRY) fs.writeFileSync(file, out);
  }
}

console.log(touched.join("\n"));
console.log(`\n${DRY ? "[dry run] " : ""}${touched.length} files · ${totalText} text nodes · ${totalExpr} expressions · ${totalImg} image imports`);
