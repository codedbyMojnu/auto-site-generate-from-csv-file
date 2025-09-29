export default function Hero() {
  return (
    <div>
      <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        {/* এই লাইনটি আমাদের জেনারেটর স্ক্রিপ্ট দ্বারা পরিবর্তিত হবে */}
        [[Quick | Fast | Speedy]] {{ TITLE }}.
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">{{ DESCRIPTION }}.</p>
    </div>
  );
}
