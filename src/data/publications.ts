export type Publication = {
  authors: string[];
  year: string;
  title: string;
  venue: string;
  note?: string;
};

export const journalPublications: Publication[] = [
  {
    authors: ["Rui Lebre", "Luís Bastião Silva", "Carlos Costa"],
    year: "2022",
    title:
      "Dicoogle Open Source: the establishment of a new paradigm in medical imaging",
    venue: "Journal of Medical Systems",
    note: "IF: 5.7",
  },
  {
    authors: ["Micael Pedrosa", "Rui Lebre", "Carlos Costa"],
    year: "2021",
    title: "A performant protocol for distributed health records databases",
    venue: "IEEE Access",
    note: "IF: 3.6",
  },
  {
    authors: ["Rui Lebre", "Luís Bastião", "Carlos Costa"],
    year: "2020",
    title: "A Cloud-ready Architecture for Shared Medical Imaging Repository",
    venue: "Journal of Digital Imaging",
    note: "IF: 4.056",
  },
  {
    authors: ["Tiago Godinho", "Rui Lebre", "João Almeida", "Carlos Costa"],
    year: "2019",
    title:
      "ETL Framework for Real-Time Business Intelligence over Medical Imaging Repositories",
    venue: "Journal of Digital Imaging",
    note: "IF: 1.536, Q3 in Radiology, Nuclear Medicine and Medical Imaging",
  },
  {
    authors: [
      "Tiago Godinho",
      "Rui Lebre",
      "Luís Bastião Silva",
      "Carlos Costa",
    ],
    year: "2017",
    title:
      "An efficient architecture to support digital pathology in standard medical imaging repositories",
    venue: "Journal of Biomedical Informatics",
    note: "IF: 2.753, Q1 in Computer Science, Interdisciplinary Applications",
  },
];

export const bookChapterPublications: Publication[] = [
  {
    authors: ["Rui Lebre", "Rui Jesus", "Pedro Nunes", "Carlos Costa"],
    year: "2021",
    title:
      "Pathobox: The Collaborative Tele-pathology Platform with Access Management",
    venue: "Communications in Computer and Information Science",
    note: "Accepted on March 2021",
  },
];

export const conferencePublications: Publication[] = [
  {
    authors: ["Rui Lebre", "Carlos Costa"],
    year: "2021",
    title:
      "An efficient and reliable architecture for distributing medical imaging data",
    venue: "IEEE EHB 2021",
    note: "Accepted on October 2021",
  },
  {
    authors: ["Micael Pedrosa", "Rui Lebre", "Carlos Costa"],
    year: "2021",
    title:
      "Holder-of-key threshold access token for anonymous data resources",
    venue: "IEEE ISCC 2021",
    note: "Accepted on July 2021",
  },
  {
    authors: ["Rui Lebre", "Luís Bastião Silva", "Carlos Costa"],
    year: "2021",
    title: "Decentralizing the storage of a DICOM compliant PACS",
    venue: "IEEE BIBM 2021",
    note: "Accepted on June 2021",
  },
  {
    authors: ["Rui Lebre", "Carlos Costa"],
    year: "2021",
    title:
      "A non-relational approach for distributed medical imaging databases",
    venue: "IEEE BHI-BSH 2021",
    note: "Accepted on June 2021",
  },
  {
    authors: ["Rui Lebre", "Micael Pedrosa", "Marcos Gestal", "Carlos Costa"],
    year: "2020",
    title:
      "A safe architecture for authorisation grant in healthcare ecosystems",
    venue: "ICHI 2020",
    note: "Accepted on April 2020",
  },
  {
    authors: [
      "Rui Lebre",
      "Eduardo Pinho",
      "Jorge Silva",
      "Carlos Costa",
    ],
    year: "2020",
    title: "Dicoogle Framework for Medical Imaging Teaching and Research",
    venue: "IEEE ICTS4eHealth 2020",
    note: "Accepted on February 2020",
  },
  {
    authors: [
      "Ana Almeida",
      "Francisco Oliveira",
      "Rui Lebre",
      "Carlos Costa",
    ],
    year: "2020",
    title: "NoSQL distributed database for DICOM objects",
    venue: "ICHI 2020",
    note: "Accepted on January 2020",
  },
  {
    authors: ["Rui Jesus", "Pedro Nunes", "Rui Lebre", "Carlos Costa"],
    year: "2020",
    title:
      "Role-based architecture for secure management of telepathology sessions",
    venue: "MIE 2020",
    note: "Accepted on December 2019",
  },
  {
    authors: ["Pedro Nunes", "Rui Jesus", "Rui Lebre", "Carlos Costa"],
    year: "2020",
    title: "Data and sessions management in a telepathology platform",
    venue: "Healthinf 2020",
    note: "Accepted on December 2019",
  },
  {
    authors: ["Fátima Solange", "Rui Lebre"],
    year: "2019",
    title:
      "Automated pattern recognition of cerebral amyloid angiopathy patients",
    venue: "RecPad 2019",
    note: "Accepted on October 2019",
  },
  {
    authors: ["Rui Lebre", "Rui Jesus", "Pedro Nunes", "Carlos Costa"],
    year: "2019",
    title: "Collaborative Framework for a Whole-Slide Image Viewer",
    venue: "IEEE CBMS 2019",
    note: "Accepted on April 2019",
  },
  {
    authors: ["Rui Lebre", "Luís Bastião", "Carlos Costa"],
    year: "2019",
    title: "An Accounting Mechanism for Standard Medical Imaging Services",
    venue: "IEEE EMBS 2019",
    note: "Accepted on December 2018",
  },
  {
    authors: [
      "Rui Lebre",
      "Tiago Godinho",
      "Carlos Costa",
      "Luis Silva",
    ],
    year: "2018",
    title:
      "A performant and fully DICOM compliant Web PACS for Digital Pathology",
    venue: "CARS 2018",
    note: "Accepted on February 2018",
  },
  {
    authors: ["Rui Lebre", "Luís Bastião Silva", "Carlos Costa"],
    year: "2018",
    title: "Shared Medical Imaging Repositories",
    venue: "MIE 2018",
    note: "Accepted on January 2018",
  },
];
