import type { Metadata } from "next";
import { photos } from "@/data/photos";
import HobbiesGallery from "@/components/HobbiesGallery";

export const metadata: Metadata = {
  title: "Hobbies",
  description: "Photography and outdoor activities by Rui Lebre.",
};

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
