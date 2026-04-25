import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
        🤖 Panduan AI Content Creation
      </h1>
      <p className="text-lg text-fd-muted-foreground max-w-2xl mb-8">
        Panduan lengkap A-Z AI untuk content creation — dari pemilihan platform hingga workflow produksi konten UGC &amp; branded.
      </p>
      <div className="flex gap-4">
        <Link
          href="/docs"
          className="rounded-lg bg-fd-primary px-6 py-3 text-sm font-semibold text-fd-primary-foreground shadow-sm hover:bg-fd-primary/90 transition-colors"
        >
          Mulai Membaca →
        </Link>
      </div>
    </div>
  );
}
