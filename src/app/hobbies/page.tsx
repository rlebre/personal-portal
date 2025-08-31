import HobbiesGallery, { Photo } from "@/components/HobbiesGallery";

const photos: Photo[] = [
  // Landscape 3:2
  {
    src: "/images/hobbies/1.png",
    alt: "Landscape 1",
    title: "Mountain Lake",
    description: "A peaceful mountain lake at sunrise.",
  },
  {
    src: "/images/hobbies/2.png",
    alt: "Landscape 2",
    title: "Forest Path",
    description: "A winding path through a dense forest.",
  },
  {
    src: "/images/hobbies/3.png",
    alt: "Landscape 3",
    title: "Desert Dunes",
    description: "Rolling sand dunes under a blue sky.",
  },
  {
    src: "/images/hobbies/4.png",
    alt: "Landscape 4",
    title: "Countryside Road",
    description: "A quiet road in the countryside.",
  },
  {
    src: "/images/hobbies/5.png",
    alt: "Landscape 5",
    title: "Mountain Lake",
    description: "A peaceful mountain lake at sunrise.",
  },
  {
    src: "/images/hobbies/6.png",
    alt: "Landscape 6",
    title: "Mountain Lake",
    description: "A peaceful mountain lake at sunrise.",
  },
  {
    src: "/images/hobbies/7.png",
    alt: "Landscape 7",
    title: "Forest Stream",
    description: "A gentle stream flowing through a lush forest.",
  },
  {
    src: "/images/hobbies/8.png",
    alt: "Landscape 8",
    title: "Sunset Beach",
    description: "Waves crashing on the shore at sunset.",
  },
  {
    src: "/images/hobbies/9.png",
    alt: "Landscape 9",
    title: "Snowy Peaks",
    description: "Snow-covered mountains under a clear sky.",
  },
  {
    src: "/images/hobbies/10.png",
    alt: "Landscape 10",
    title: "Autumn Leaves",
    description: "Colorful autumn leaves covering the ground.",
  },
  {
    src: "/images/hobbies/11.png",
    alt: "Landscape 11",
    title: "City Park",
    description: "A tranquil park in the heart of the city.",
  },
  {
    src: "/images/hobbies/12.png",
    alt: "Landscape 12",
    title: "Lakeside Cabin",
    description: "A cozy cabin by the lake at dusk.",
  },
];

export default function HobbiesPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-2">Hobbies</h1>
      <p className="mb-8 text-muted-foreground">
        As a computer and software engineer, I spend a lot of my time during the
        day behind my screens. I constantly try to get out and stay in contact
        with nature and the environment. During working days, unless abnormal
        event, I do not exempt from daily exercise. Whether it be walking,
        cycling, swimming, or just a little bit of gym classes.
      </p>
      <p className="mb-8 text-muted-foreground">
        When the weekend approaches, I start doing my plans to go hiking in the
        mountain, surf, spend time with my family, or just relax. Honestly,
        often relaxing is replaced by learning new things related to software
        engineering (mostly frontend) or just learning a new language (german).
        In fact, I really enjoy learning new things, which makes it also a hobby
        for me.
      </p>
      <p className="mb-8 text-muted-foreground">
        In this section, I show some pictures from my other hobby: photography.
        Hope you enjoyed to know a bit more about me!
      </p>

      <HobbiesGallery photos={photos} />
    </div>
  );
}
