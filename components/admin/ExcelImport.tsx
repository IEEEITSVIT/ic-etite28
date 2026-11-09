"use client";

import { useMemo, useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import { importRecipientsAction } from "@/app/actions/admin-batches";
import SubmitButton from "@/components/portal/SubmitButton";
import { inputCls, labelCls } from "@/components/portal/ui";

type Cell = string | number | boolean | Date | null;

// Spreadsheet headers become placeholder keys: "Team Name" → team_name.
const keyOf = (h: string) => h.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "column";
const cellText = (c: Cell) => (c == null ? "" : c instanceof Date ? c.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : String(c).trim());
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

// Minimal RFC 4180 CSV parser (quoted fields, escaped quotes, CRLF).
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim()));
}

const guess = (headers: string[], patterns: RegExp[]) => {
  for (const p of patterns) {
    const i = headers.findIndex((h) => p.test(h.trim()));
    if (i >= 0) return i;
  }
  return -1;
};

export default function ExcelImport({ batchId, hasRecipients }: { batchId: string; hasRecipients: boolean }) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [nameCol, setNameCol] = useState(-1);
  const [emailCol, setEmailCol] = useState(-1);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  async function load(file: File) {
    setError("");
    setFileName(file.name);
    try {
      let table: string[][];
      if (/\.csv$/i.test(file.name) || file.type === "text/csv") {
        table = parseCsv((await file.text()).replace(/^﻿/, ""));
      } else {
        const { readSheet } = await import("read-excel-file/browser");
        const data = (await readSheet(file)) as Cell[][];
        table = data.map((r) => r.map(cellText)).filter((r) => r.some((c) => c));
      }
      if (table.length < 2) throw new Error("The sheet needs a header row and at least one data row.");
      const h = table[0].map((c, i) => c || `Column ${i + 1}`);
      setHeaders(h);
      setRows(table.slice(1));
      setNameCol(guess(h, [/^(full\s*)?name$/i, /participant|student|recipient|candidate/i, /name/i]));
      setEmailCol(guess(h, [/^e-?mail(\s*id|\s*address)?$/i, /mail/i]));
    } catch (e) {
      setHeaders([]);
      setRows([]);
      setError(e instanceof Error ? e.message : "Could not read that file. Save it as .xlsx or .csv and try again.");
    }
  }

  const parsed = useMemo(() => {
    if (nameCol < 0 || emailCol < 0) return { good: [], bad: [] as number[] };
    const keys = headers.map(keyOf);
    const good: { name: string; email: string; data: Record<string, string> }[] = [];
    const bad: number[] = [];
    rows.forEach((r, i) => {
      const name = (r[nameCol] ?? "").trim();
      const email = (r[emailCol] ?? "").trim().toLowerCase();
      if (!name || !isEmail(email)) {
        bad.push(i + 2);
        return;
      }
      const data: Record<string, string> = {};
      keys.forEach((k, j) => {
        if (j !== nameCol && j !== emailCol && r[j]) data[k] = r[j];
      });
      good.push({ name, email, data });
    });
    return { good, bad };
  }, [rows, headers, nameCol, emailCol]);

  const extraKeys = headers.map(keyOf).filter((_, j) => j !== nameCol && j !== emailCol);

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-wrap items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 hover:bg-slate-100">
        <FileSpreadsheet className="h-6 w-6 text-emerald-700" />
        <span className="text-sm text-slate-700">
          <span className="font-semibold">{fileName || "Choose an Excel (.xlsx) or CSV file"}</span>
          <span className="block text-xs text-slate-500">First row = column headings. Needs a name column and an email column; every other column can be printed on the certificate.</span>
        </span>
        <input type="file" accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="sr-only" onChange={(e) => e.target.files?.[0] && load(e.target.files[0])} />
      </label>
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      {headers.length > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className={labelCls}>Name column</span>
              <select value={nameCol} onChange={(e) => setNameCol(Number(e.target.value))} className={inputCls}>
                <option value={-1}>— choose —</option>
                {headers.map((h, i) => (
                  <option key={i} value={i}>
                    {h}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelCls}>Email column</span>
              <select value={emailCol} onChange={(e) => setEmailCol(Number(e.target.value))} className={inputCls}>
                <option value={-1}>— choose —</option>
                {headers.map((h, i) => (
                  <option key={i} value={i}>
                    {h}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="text-sm text-slate-600">
            <strong>{parsed.good.length}</strong> valid row(s)
            {parsed.bad.length > 0 && (
              <span className="text-red-700">
                {" "}
                · {parsed.bad.length} skipped (missing name or invalid email on sheet row{parsed.bad.length > 1 ? "s" : ""} {parsed.bad.slice(0, 8).join(", ")}
                {parsed.bad.length > 8 ? "…" : ""})
              </span>
            )}
          </p>
          {extraKeys.length > 0 && (
            <p className="text-xs text-slate-500">
              Extra columns become placeholders for custom certificate text: {extraKeys.map((k) => `{{${k}}}`).join("  ")}. Columns named team, position/rank/award or
              institution/college fill those certificate fields automatically.
            </p>
          )}
          {parsed.good.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Email</th>
                    {extraKeys.slice(0, 5).map((k) => (
                      <th key={k} className="px-3 py-2 text-left">
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsed.good.slice(0, 5).map((r, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-3 py-1.5">{r.name}</td>
                      <td className="px-3 py-1.5">{r.email}</td>
                      {extraKeys.slice(0, 5).map((k) => (
                        <td key={k} className="px-3 py-1.5">
                          {r.data[k] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <form action={importRecipientsAction} className="flex flex-wrap items-center gap-4">
            <input type="hidden" name="id" value={batchId} />
            <input type="hidden" name="rows" value={JSON.stringify(parsed.good)} />
            <input type="hidden" name="columns" value={JSON.stringify(extraKeys)} />
            {hasRecipients && (
              <>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="mode" value="replace" defaultChecked className="accent-brand-primary" /> Replace current list
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="mode" value="append" className="accent-brand-primary" /> Add to current list
                </label>
              </>
            )}
            <SubmitButton pendingText="Importing…">Import {parsed.good.length} recipient(s)</SubmitButton>
          </form>
        </>
      )}
    </div>
  );
}
