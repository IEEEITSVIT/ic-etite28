// Lists editable in Admin → Lists (add, remove, reorder, edit). Shared by the admin editor,
// the save API (validation) and the pages (defaults). Saved copies live in the `collections`
// setting; until a list is saved, pages show these defaults.
import { internationalAdvisoryData, nationalAdvisoryData, technicalCommitteeData } from "@/data/advisory";
import { ieeeItsLeadership } from "@/data/team";
import { conferenceTracksData } from "@/data/tracks";
import { executiveLeadershipLeft, executiveLeadershipRight, functionalCommittees, studentLeads } from "@/data/committeeSections";

export type FieldType = "text" | "textarea" | "url" | "image" | "lines" | "select" | "list";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  fields?: FieldDef[]; // for "list": the fields of each sub-item
  itemLabel?: string; // for "list"
}

export interface CollectionDef {
  label: string;
  group: string;
  description: string;
  page: string; // where the list appears (for the preview)
  itemLabel: string;
  titleField: string; // field shown as each item's heading in the editor
  fields: FieldDef[];
  defaults: unknown[];
}

const MEMBER_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "affiliation", label: "Designation / affiliation", type: "text" },
];

const SECTION_FIELDS: FieldDef[] = [
  { key: "title", label: "Section title", type: "text", required: true },
  { key: "members", label: "Members", type: "list", itemLabel: "member", fields: MEMBER_FIELDS },
];

const ADVISORY_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "role", label: "Role / designation", type: "text" },
  { key: "department", label: "Department", type: "text" },
  { key: "institution", label: "Institution", type: "text", required: true },
  { key: "location", label: "Location", type: "text" },
  { key: "country", label: "Country", type: "text" },
  { key: "image", label: "Photo", type: "image" },
  { key: "portfolioUrl", label: "Profile link", type: "url" },
];

export const COLLECTIONS: Record<string, CollectionDef> = {
  "committees.leadershipLeft": {
    label: "Organizing committee — leadership (left column)",
    group: "Committees",
    description: "Chief Patron, Patrons, Organizing and Conference Chairs.",
    page: "/committees",
    itemLabel: "section",
    titleField: "title",
    fields: SECTION_FIELDS,
    defaults: executiveLeadershipLeft,
  },
  "committees.leadershipRight": {
    label: "Organizing committee — leadership (right column)",
    group: "Committees",
    description: "Publication, Finance and Technical Programme Chairs.",
    page: "/committees",
    itemLabel: "section",
    titleField: "title",
    fields: SECTION_FIELDS,
    defaults: executiveLeadershipRight,
  },
  "committees.functional": {
    label: "Functional committees",
    group: "Committees",
    description: "Advisory, publication, sponsorship, registration, BOLT, TechNext and other committees.",
    page: "/committees",
    itemLabel: "committee",
    titleField: "title",
    fields: SECTION_FIELDS,
    defaults: functionalCommittees,
  },
  "committees.students": {
    label: "Student committee",
    group: "Committees",
    description: "Student leads shown in the Student tab.",
    page: "/committees",
    itemLabel: "student",
    titleField: "name",
    fields: MEMBER_FIELDS,
    defaults: studentLeads,
  },
  "advisory.international": {
    label: "International advisory board",
    group: "Advisory board",
    description: "Shown on the Advisory and Committees pages.",
    page: "/advisory",
    itemLabel: "member",
    titleField: "name",
    fields: ADVISORY_FIELDS,
    defaults: internationalAdvisoryData,
  },
  "advisory.national": {
    label: "National advisory board",
    group: "Advisory board",
    description: "Shown on the Advisory and Committees pages.",
    page: "/advisory",
    itemLabel: "member",
    titleField: "name",
    fields: ADVISORY_FIELDS,
    defaults: nationalAdvisoryData,
  },
  "advisory.technical": {
    label: "Technical programme committee",
    group: "Advisory board",
    description: "Shown on the Advisory and Committees pages.",
    page: "/advisory",
    itemLabel: "member",
    titleField: "name",
    fields: ADVISORY_FIELDS,
    defaults: technicalCommitteeData,
  },
  "team.members": {
    label: "Web development team",
    group: "Team",
    description: "The Team page.",
    page: "/team",
    itemLabel: "member",
    titleField: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "badge", label: "Badge (e.g. Project Lead)", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "affiliation", label: "Affiliation", type: "text", required: true },
      { key: "image", label: "Photo", type: "image" },
      { key: "portfolioUrl", label: "Profile link (LinkedIn, website)", type: "url" },
    ],
    defaults: ieeeItsLeadership,
  },
  tracks: {
    label: "Research tracks",
    group: "Conference",
    description: "Tracks and topics on the Tracks and Call for Papers pages.",
    page: "/tracks",
    itemLabel: "track",
    titleField: "title",
    fields: [
      { key: "number", label: "Track number", type: "text", placeholder: "01" },
      { key: "title", label: "Track title", type: "text", required: true },
      { key: "shortCode", label: "Short code", type: "text", placeholder: "IT" },
      { key: "icon", label: "Icon", type: "select", options: ["Database", "Radio", "Cpu", "Zap", "Network", "Brain", "Shield", "Cloud", "Globe", "Code"] },
      { key: "description", label: "Description", type: "textarea" },
      { key: "topics", label: "Topics (one per line)", type: "lines" },
      { key: "id", label: "Track id (used in links)", type: "text" },
    ],
    defaults: conferenceTracksData,
  },
};

export type CollectionKey = keyof typeof COLLECTIONS;

const MAX_ITEMS = 500;
const LIMITS: Partial<Record<FieldType, number>> = { text: 300, textarea: 3000, url: 500, image: 500, select: 60 };

function cleanItem(fields: FieldDef[], raw: unknown, depth = 0): Record<string, unknown> {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const v = src[f.key];
    if (f.type === "list") {
      out[f.key] = Array.isArray(v) && depth < 2 ? v.slice(0, MAX_ITEMS).map((x) => cleanItem(f.fields ?? [], x, depth + 1)) : [];
    } else if (f.type === "lines") {
      out[f.key] = Array.isArray(v) ? v.map((x) => String(x).trim().slice(0, 300)).filter(Boolean).slice(0, 200) : [];
    } else if (v != null && String(v).trim() !== "") {
      let s = String(v).trim().slice(0, LIMITS[f.type] ?? 300);
      if (f.type === "url" && !/^(https?:\/\/|\/)/i.test(s)) s = "";
      if (f.type === "image" && !/^(\/|https?:\/\/)/i.test(s)) s = "";
      if (f.type === "select" && f.options && !f.options.includes(s)) s = f.options[0];
      out[f.key] = s;
    } else {
      out[f.key] = ""; // keep every field present so pages can rely on the shape
    }
  }
  return out;
}

// Validates a submitted list against its field definitions (unknown keys are dropped).
export function cleanCollection(key: string, items: unknown[]): Record<string, unknown>[] {
  const def = COLLECTIONS[key];
  if (!def || !Array.isArray(items)) return [];
  return items.slice(0, MAX_ITEMS).map((it) => cleanItem(def.fields, it));
}
