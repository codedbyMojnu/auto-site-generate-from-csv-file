import Contact from "@/components/Contact";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-4xl rounded-lg bg-white p-10 text-center shadow-xl">
        <Hero />
        <div className="mt-8 border-t-2 border-gray-200 pt-8">
          <Contact />
        </div>
      </div>
    </main>
  );
}
