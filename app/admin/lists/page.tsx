import { getSettings } from "@/lib/settings";
import ListsEditor from "@/components/admin/cms/ListsEditor";

export const dynamic = "force-dynamic";

// Admin → Lists: committees, advisory boards, team and tracks, with a live preview.
export default async function AdminListsPage() {
  const { collections } = await getSettings();
  return <ListsEditor saved={collections} />;
}
