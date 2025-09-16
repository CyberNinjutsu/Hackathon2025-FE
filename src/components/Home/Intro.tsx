import WordAnimate from "@/components/WordAnimate";

export default function Intro() {
  return (
    <section className="bg-transparent px-6 py-20 text-center max-w-4xl mx-auto">
      <WordAnimate
        as="h2"
        className="text-4xl font-normal leading-snug text-white"
      >
        Simplicity, performance, and security, empowering you to navigate the
        digital world with confidence and agility.
      </WordAnimate>
    </section>
  );
}
