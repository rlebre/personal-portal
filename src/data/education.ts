export type Education = {
  institution: string;
  degree: string;
  details?: string;
  period: string;
};

export const education: Education[] = [
  {
    institution: "University of A Coruña",
    degree:
      "PhD - Doctor of Philosophy, Information and Communications Technology",
    period: "2018 - 2022",
  },
  {
    institution: "University of Aveiro",
    degree: "MSc - Master of Science, Computer and Telematics Engineering",
    details:
      'Master Thesis developed in a company environment (at BMD Software, Lda) entitled "Accounting Mechanism for Shared Medical Imaging Repositories"',
    period: "2015 - 2017",
  },
  {
    institution: "University of Aveiro",
    degree:
      "BSc - Bachelor of Science, Sciences of Computer and Telematics Engineering",
    period: "2011 - 2015",
  },
];
