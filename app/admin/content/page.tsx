import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { resetContentAction } from "@/app/actions/admin-settings";
import SubmitButton from "@/components/portal/SubmitButton";
import { Badge, Card, Empty, Flash, PortalPage, Table, Td, btnSecondary, inputCls } from "@/components/portal/ui";

// Where each key's file id points, for a human-readable "page" column.
const pageOf = (fileId: string) => (fileId.startsWith("c.") ? `Shared section: ${fileId.slice(2)}` : fileId === "home" ? "Home" : `/${fileId}`);

export default async function AdminContentPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string; q?: string }> }) {
  const { ok, error, q = "" } = await searchParams;
  const { texts, images } = await getSettings();
  const needle = q.toLowerCase();
  const textRows = Object.entries(texts)
    .map(([key, o]) => ({ key, o, file: key.split(":")[0] }))
    .filter((r) => !needle || `${r.o.o ?? ""} ${r.o.t ?? ""} ${r.file}`.toLowerCase().includes(needle))
    .sort((a, b) => a.file.localeCompare(b.file));
  const imageRows = Object.entries(images);

  return (
    <PortalPage
      title="Page content"
      subtitle="Every text and image on the public pages can be edited in place: open any page while logged in as admin and click “Edit page” (bottom-left)."
      width="max-w-7xl"
      actions={
        <Link href="/" target="_blank" className={btnSecondary}>
          Open the website to edit
        </Link>
      }
    >
      <Flash ok={ok} error={error} />
      <div className="space-y-6">
        <Card
          title={`Edited texts (${Object.keys(texts).length})`}
          actions={
            <form className="flex gap-2">
              <input name="q" defaultValue={q} placeholder="Search text or page" className={`${inputCls} !w-56 !py-2 !text-sm`} />
              <button className={btnSecondary}>Search</button>
            </form>
          }
        >
          {textRows.length === 0 ? (
            <Empty>{q ? "No edits match." : "No text has been edited yet."}</Empty>
          ) : (
            <Table head={["Where", "Original", "Now", "Style", ""]}>
              {textRows.map(({ key, o, file }) => (
                <tr key={key}>
                  <Td className="whitespace-nowrap text-xs">{pageOf(file)}</Td>
                  <Td className="max-w-xs text-xs text-slate-500">{o.o ?? <em>(not recorded)</em>}</Td>
                  <Td className="max-w-sm text-sm">{o.h ? <Badge tone="red">hidden</Badge> : (o.t ?? <span className="text-slate-400">unchanged</span>)}</Td>
                  <Td className="whitespace-nowrap text-xs">
                    {o.s && <Badge>{Math.round(o.s * 100)}%</Badge>} {o.b && <Badge>bold</Badge>}{" "}
                    {o.c && (
                      <span className="inline-flex items-center gap-1">
                        <span className="inline-block h-3 w-3 rounded-full border" style={{ background: o.c }} /> {o.c}
                      </span>
                    )}
                  </Td>
                  <Td className="text-right">
                    <form action={resetContentAction}>
                      <input type="hidden" name="type" value="text" />
                      <input type="hidden" name="key" value={key} />
                      <SubmitButton className={btnSecondary} pendingText="…">
                        Reset
                      </SubmitButton>
                    </form>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
        <Card title={`Replaced images (${imageRows.length})`}>
          {imageRows.length === 0 ? (
            <Empty>No images have been replaced yet.</Empty>
          ) : (
            <Table head={["Original", "Replacement", ""]}>
              {imageRows.map(([src, url]) => (
                <tr key={src}>
                  <Td className="text-xs">{src}</Td>
                  <Td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-14 rounded border border-slate-200 object-contain" />
                  </Td>
                  <Td className="text-right">
                    <form action={resetContentAction}>
                      <input type="hidden" name="type" value="image" />
                      <input type="hidden" name="key" value={src} />
                      <SubmitButton className={btnSecondary} pendingText="…">
                        Restore original
                      </SubmitButton>
                    </form>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </div>
    </PortalPage>
  );
}
