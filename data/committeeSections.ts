// Default content of the Committees page sections, as originally hard-coded on the page.
// Admins edit copies of these in Admin → Lists; these remain the fallback.
import {
  chiefPatron,
  patrons,
  organizingChairs,
  technicalProgrammeChairs,
  executiveAdvisoryCommittee,
  publicationCommittee,
  sponsorshipCommittee,
  publicityAndMediaCommittee,
  registrationCommittee,
  boltHackathonCommittee,
  technextExpoCommittee,
  eventManagementCommittee,
  guestCareCommittee,
  conferenceCoordinatingCommittee,
} from "@/data/committees";

export interface TextMember {
  name: string;
  affiliation?: string;
}

export interface CommitteeSection {
  title: string;
  members: TextMember[];
}

// Organizing Committee: Executive Leadership Sections
export const executiveLeadershipLeft: CommitteeSection[] = [
  {
    title: "Chief Patron",
    members: [
      {
        name: chiefPatron.name,
        affiliation: chiefPatron.affiliation,
      },
    ],
  },
  {
    title: "Patrons",
    members: patrons.map((p) => ({
      name: p.name,
      affiliation: p.affiliation,
    })),
  },
  {
    title: "Organizing Chair",
    members: [
      {
        name: organizingChairs.organizingChair.name,
        affiliation: organizingChairs.organizingChair.affiliation,
      },
    ],
  },
  {
    title: "Organizing Co-chair",
    members: [
      {
        name: organizingChairs.organizingCoChair.name,
        affiliation: organizingChairs.organizingCoChair.affiliation,
      },
    ],
  },
  {
    title: "Conference Chair",
    members: [
      {
        name: organizingChairs.conferenceChair.name,
        affiliation: organizingChairs.conferenceChair.affiliation,
      },
    ],
  },
];

export const executiveLeadershipRight: CommitteeSection[] = [
  {
    title: "Publication Chair",
    members: [
      {
        name: organizingChairs.publicationChair.name,
        affiliation: organizingChairs.publicationChair.affiliation,
      },
    ],
  },
  {
    title: "Publication Co-chairs",
    members: organizingChairs.publicationCoChairs.map((p) => ({
      name: p.name,
      affiliation: p.affiliation,
    })),
  },
  {
    title: "Finance Chair",
    members: [
      {
        name: organizingChairs.financeChair.name,
        affiliation: organizingChairs.financeChair.affiliation,
      },
    ],
  },
  {
    title: "Finance Co-chair",
    members: [
      {
        name: organizingChairs.financeCoChair.name,
        affiliation: organizingChairs.financeCoChair.affiliation,
      },
    ],
  },
  {
    title: "Technical Programme Chairs",
    members: technicalProgrammeChairs.map((m) => ({
      name: m.name,
      affiliation: m.affiliation,
    })),
  },
];

// Specific Functional Committees from Official Directory
export const functionalCommittees: CommitteeSection[] = [
  {
    title: "Executive Advisory Committee",
    members: executiveAdvisoryCommittee.map((m) => ({
      name: m.name,
      affiliation: `${m.role}, ${m.affiliation}`,
    })),
  },
  {
    title: "Publication Committee",
    members: publicationCommittee.map((m) => ({
      name: m.name,
      affiliation: `${m.role}, ${m.affiliation}`,
    })),
  },
  {
    title: "Sponsorship Committee",
    members: sponsorshipCommittee.map((m) => ({
      name: m.name,
      affiliation: `${m.role}, ${m.affiliation}`,
    })),
  },
  {
    title: "Publicity and Media Committee",
    members: publicityAndMediaCommittee.map((m) => ({
      name: m.name,
      affiliation: `${m.role}, ${m.affiliation}`,
    })),
  },
  {
    title: "Registration Committee",
    members: registrationCommittee.map((m) => ({
      name: m.name,
      affiliation: `${m.role}, ${m.affiliation}`,
    })),
  },
  {
    title: "BOLT 3.0 Hackathon Committee",
    members: boltHackathonCommittee.map((m) => ({
      name: m.name,
      affiliation: `${m.role}, ${m.affiliation}`,
    })),
  },
  {
    title: "Technext’28 Expo Committee",
    members: technextExpoCommittee.map((m) => ({
      name: m.name,
      affiliation: `${m.role}, ${m.affiliation}`,
    })),
  },
  {
    title: "Event Management Committee",
    members: eventManagementCommittee.map((m) => ({
      name: m.name,
      affiliation: `${m.role}, ${m.affiliation}`,
    })),
  },
  {
    title: "Guest Care Committee",
    members: guestCareCommittee.map((m) => ({
      name: m.name,
      affiliation: `${m.role}, ${m.affiliation}`,
    })),
  },
  {
    title: "Conference Coordinating Committee",
    members: conferenceCoordinatingCommittee.map((m) => ({
      name: m.name,
      affiliation: `${m.role}, ${m.affiliation}`,
    })),
  },
];

// Student Committee Members
export const studentLeads: TextMember[] = [
  { name: "Likhith Medarametla", affiliation: "SCORE, VIT Vellore" },
  { name: "Judson Daniel", affiliation: "SCORE, VIT Vellore" },
  { name: "M.J.V.Maheswara Reddy", affiliation: "SCORE, VIT Vellore" },
];
