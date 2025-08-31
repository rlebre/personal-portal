import Link from "next/link";

export default function AcademicPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Academic</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">About</h2>
        <p className="mb-2 font-mono">
          <Link href="mailto:ruilebre@ua.pt" className="underline">
            ruilebre@ua.pt
          </Link>
          <br />
          <span>PhD @ University of A Coruña</span>
        </p>
        <p className="mb-2">
          This section describes my academic journey, since the beginning of my
          studies until I graduated and obtained my PhD later on.
        </p>
        <p className="mb-2">
          My interests in engineering started at an early age and converged to
          computer fields at sixteen. Two years later, I began my academic
          journey, leading to a Masters degree. During his Masters at University
          of Aveiro, Portugal, my interests in medical informatics and software
          grew, and in 2016 I started collaborating with UA.PT Bioinformatics.
          The first project as a junior researcher was developing a web DICOM
          viewer for Digital Pathology. I also developed a Role-Based Access
          Control for general Picture Archiving and Communication Systems.
        </p>
        <p className="mb-2">
          I applied my experience exploring profile-based, decentralized, and
          blockchain systems to improve healthcare. While pursuing the PhD
          dream, I have also mentored Masters students and junior researchers.
        </p>
        <p className="mb-2">
          The journey ended in 2022, when after writing the thesis entitled{" "}
          <i>Profile-based sharing of medical imaging data</i>, I decided to
          switch gears and join in a company working in the streaming world.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Skills</h2>
        <div className="mb-2">
          <strong>Architecture & Concepts:</strong> API Management Platforms,
          Webservices
        </div>
        <div className="mb-2">
          <strong>Technologies:</strong> Java, Python, Javascript, NodeJS,
          Angular, Django, Git, Maven, npm, SQL Server, MySQL
        </div>
        <div className="mb-2">
          <strong>Operating Systems:</strong> Windows, Linux, MacOS
        </div>
        <div className="mb-2">
          <strong>Languages:</strong> Portuguese, English, (learning) German
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Publications</h2>
        <h3 className="text-lg font-bold mt-4 mb-1">Journal</h3>
        <ul className="list-disc ml-6 mb-2 text-sm space-y-4">
          <li>
            Rui Lebre, Luís Bastião Silva and Carlos Costa (2022).{" "}
            <strong>
              Dicoogle Open Source: the establishment of a new paradigm in
              medical imaging
            </strong>
            . <em>Journal of Medical Systems</em> (IF: 5.7).
          </li>
          <li>
            Micael Pedrosa, Rui Lebre and Carlos Costa (2021).{" "}
            <strong>
              A performant protocol for distributed health records databases
            </strong>
            . <em>IEEE Access</em> (IF: 3.6).
          </li>
          <li>
            Rui Lebre, Luís Bastião and Carlos Costa (2020).{" "}
            <strong>
              A Cloud-ready Architecture for Shared Medical Imaging Repository
            </strong>
            . <em>Journal of Digital Imaging</em> (IF: 4.056).
          </li>
          <li>
            Tiago Godinho, Rui Lebre, João Almeida and Carlos Costa (2019).{" "}
            <strong>
              ETL Framework for Real-Time Business Intelligence over Medical
              Imaging Repositories
            </strong>
            . <em>Journal of Digital Imaging</em> (IF: 1.536, Q3 in Radiology,
            Nuclear Medicine and Medical Imaging).
          </li>
          <li>
            Tiago Godinho, Rui Lebre, Luís Bastião Silva and Carlos Costa.
            (2017).{" "}
            <strong>
              An efficient architecture to support digital pathology in standard
              medical imaging repositories
            </strong>
            . <em>Journal of Biomedical Informatics</em> (IF: 2.753, Q1 in
            Computer Science, Interdisciplinary Applications).
          </li>
        </ul>
        <h3 className="text-lg font-bold mt-4 mb-1">Book Chapter</h3>
        <ul className="list-disc ml-6 mb-2 text-sm space-y-4">
          <li>
            Rui Lebre, Rui Jesus, Pedro Nunes and Carlos Costa (2021).{" "}
            <strong>
              Pathobox: The Collaborative Tele-pathology Platform with Access
              Management
            </strong>
            . <em>Communications in Computer and Information Science</em>{" "}
            (Accepted on March 2021).
          </li>
        </ul>
        <h3 className="text-lg font-bold mt-4 mb-1">Conference</h3>
        <ul className="list-disc ml-6 text-sm space-y-4">
          <li>
            Rui Lebre and Carlos Costa (2021).{" "}
            <strong>
              An efficient and reliable architecture for distributing medical
              imaging data
            </strong>
            . <em>IEEE EHB 2021</em> (Accepted on October 2021)
          </li>
          <li>
            Micael Pedrosa, Rui Lebre and Carlos Costa (2021).{" "}
            <strong>
              Holder-of-key threshold access token for anonymous data resources
            </strong>
            . <em>IEEE ISCC 2021</em> (Accepted on July 2021).
          </li>
          <li>
            Rui Lebre, Luís Bastião Silva and Carlos Costa (2021).{" "}
            <strong>
              Decentralizing the storage of a DICOM compliant PACS
            </strong>
            . <em>IEEE BIBM 2021</em> (Accepted on June 2021).
          </li>
          <li>
            Rui Lebre and Carlos Costa (2021).{" "}
            <strong>
              A non-relational approach for distributed medical imaging
              databases
            </strong>
            . <em>IEEE BHI-BSH 2021</em> (Accepted on June 2021).
          </li>
          <li>
            Rui Lebre, Micael Pedrosa, Marcos Gestal and Carlos Costa (2020).{" "}
            <strong>
              A safe architecture for authorisation grant in healthcare
              ecosystems
            </strong>
            . <em>ICHI 2020</em> (Accepted on April 2020).
          </li>
          <li>
            Rui Lebre, Eduardo Pinho, Jorge Silva and Carlos Costa (2020),{" "}
            <strong>
              Dicoogle Framework for Medical Imaging Teaching and Research
            </strong>
            . <em>IEEE ICTS4eHealth 2020</em> (Accepted on February 2020).
          </li>
          <li>
            Ana Almeida, Francisco Oliveira, Rui Lebre and Carlos Costa (2020).{" "}
            <strong>NoSQL distributed database for DICOM objects</strong>.{" "}
            <em>ICHI 2020</em> (Accepted on January 2020).
          </li>
          <li>
            Rui Jesus, Pedro Nunes, Rui Lebre and Carlos Costa (2020).{" "}
            <strong>
              Role-based architecture for securemanagement of telepathology
              sessions
            </strong>
            . <em>MIE 2020</em> (Accepted on December 2019)
          </li>
          <li>
            Pedro Nunes, Rui Jesus, Rui Lebre and Carlos Costa (2020).{" "}
            <strong>
              Data and sessions management in a telepathology platform
            </strong>
            . <em>Healthinf 2020</em> (Accepted on December 2019)
          </li>
          <li>
            Fátima Solange and Rui Lebre (2019).{" "}
            <strong>
              Automated pattern recognition of cerebral amyloid angiopathy
              patients
            </strong>
            . <em>RecPad 2019</em> (Accepted on October 2019).
          </li>
          <li>
            Rui Lebre, Rui Jesus, Pedro Nunes and Carlos Costa (2019).{" "}
            <strong>
              Collaborative Framework for a Whole-Slide Image Viewer
            </strong>
            . <em>IEEE CBMS 2019</em> (Accepted on April 2019).
          </li>
          <li>
            Rui Lebre, Luís Bastião and Carlos Costa (2019).{" "}
            <strong>
              An Accounting Mechanism for Standard Medical Imaging Services
            </strong>
            . <em>IEEE EMBS 2019</em> (Accepted on December 2018).
          </li>
          <li>
            Rui Lebre, Tiago Godinho, Carlos Costa and Luis Silva. (2018).{" "}
            <strong>
              A performant and fully DICOM compliant Web PACS for Digital
              Pathology
            </strong>
            . <em>CARS 2018</em> (Accepted on February 2018).
          </li>
          <li>
            Rui Lebre, Luís Bastião Silva and Carlos Costa. (2018).{" "}
            <strong>Shared Medical Imaging Repositories</strong>.{" "}
            <em>MIE 2018</em> (Accepted on January 2018).
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Experience</h2>
        <ul className="list-disc ml-6 text-sm space-y-4">
          <li>
            <strong>Researcher</strong> – IEETA - Institute of Electronics and
            Informatics Engineering of Aveiro
            <br />
            Development and maintenance of the Dicoogle project, aiming to
            increase the success of the platform among other research units,
            academic institutions or in healthcare industry.
            <br />
            <span className="text-muted-foreground">
              September 2017 - December 2019
            </span>
          </li>
          <li>
            <strong>Intern</strong> – BMD Software
            <br />
            Development of the Master thesis in a company environment.
            <br />
            <span className="text-muted-foreground">
              October 2016 - July 2017
            </span>
          </li>
          <li>
            <strong>Junior Researcher</strong> – IEETA - Institute of
            Electronics and Informatics Engineering of Aveiro
            <br />
            Engineering and development of a world’s pioneer system targeting to
            support Digital Pathology (whole-slide Images) in the format of the
            DICOM standard in general medical imaging repositories. The
            challenge was dealing with several gigapixels images not only in the
            medical images repositories but also in the web-based viewer.
            <br />
            <span className="text-muted-foreground">
              March 2016 - September 2017
            </span>
          </li>
          <li>
            <strong>Collaborator</strong> – Office of Former Students -
            University of Aveiro
            <br />
            Contacting former students under the study “Follow-up of the UA
            graduated students, between 2008 and 2011, working conditions”
            <br />
            <span className="text-muted-foreground">
              March 2016 - July 2016
            </span>
          </li>
          <li>
            <strong>Collaborator</strong> – Communications, Image and Public
            Relations Services - University of Aveiro
            <br />
            Working in a project as ambassador of the University of Aveiro,
            promoting the institutions in Portuguese high schools
            <br />
            <span className="text-muted-foreground">
              November 2015 - August 2017
            </span>
          </li>
          <li>
            <strong>Collaborator</strong> – Office of Former Students
            Collaborator - University of Aveiro
            <br />
            Contacting former students under the study “The employability of the
            UA graduated students between 2012 and 2014”
            <br />
            <span className="text-muted-foreground">
              October 2015 - December 2015
            </span>
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-2">Education</h2>
        <ul className="list-disc ml-6 text-sm space-y-4">
          <li>
            <strong>University of A Coruña</strong>
            <br />
            PhD - Doctor of Philosophy, Information and Communications
            Technology
            <br />
            <span className="text-muted-foreground">
              Ongoing (2018 - Present)
            </span>
          </li>
          <li>
            <strong>University of Aveiro</strong>
            <br />
            MSc - Master of Science, Computer and Telematics Engineering
            <br />
            Master Thesis developed in a company environment (at BMD Software,
            Lda) entitled &quot;Accounting Mechanism for Shared Medical Imaging
            Repositories&quot;
            <br />
            <span className="text-muted-foreground">2015 - 2017</span>
          </li>
          <li>
            <strong>University of Aveiro</strong>
            <br />
            BSc - Bachelor of Science, Sciences of Computer and Telematics
            Engineering
            <br />
            <span className="text-muted-foreground">2011 - 2015</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
