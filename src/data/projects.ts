export type Project = {
  title: string;
  image: string;
  description: string;
  github: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    title: "LightLex",
    image: "/images/portfolio/lightlex.png",
    description:
      "A lightweight app built to run in low end devices such as TVs. It mimics the former Plex TV app layout with a performant framework: LightningJS",
    github: "https://github.com/rlebre/lightlex",
    demo: "https://ruilebre.com/lightlex",
  },
  {
    title: "LightningJS TicTacToe",
    image: "/images/portfolio/lightningjs-tictactoe.png",
    description:
      "A fast, interactive Tic Tac Toe game for TV built with LightningJS.",
    github: "https://github.com/rlebre/lightningjs-tictactoe",
    demo: "https://rlebre.github.io/lightningjs-tictactoe/",
  },
  {
    title: "Dicoogle Website",
    image: "/images/portfolio/dicoogle-website.png",
    description: "Official website for Dicoogle, an open-source PACS archive.",
    github: "https://github.com/rlebre/dicoogle-website",
    demo: "https://dicoogle.com",
  },
  {
    title: "Lost Heritage",
    image: "/images/portfolio/lost-heritage.png",
    description:
      "A project to document and visualize lost cultural heritage sites in Portugal. This project was covered in the media and supported by Maria Manuel Leitão, a MEP in the period 2019-2024.",
    github: "https://github.com/rlebre/lost-heritage",
    demo: "https://lostheritage.ruilebre.com",
  },
  {
    title: "Old Website",
    image: "/images/portfolio/old-website.png",
    description:
      "The previous personal portal used in the domain ruilebre.com. Built with Next.JS.",
    github: "https://github.com/rlebre/personal-portal",
    demo: "https://ruilebre.com",
  },
];
