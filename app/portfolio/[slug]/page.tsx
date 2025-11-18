import { caseStudies } from '@/lib/caseStudies';
import { notFound } from 'next/navigation';
import Image from 'next/image';

type Params = { slug: string };

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export function generateMetadata({ params }: { params: Params }) {
  const cs = caseStudies.find((c) => c.slug === params.slug);
  if (!cs) return {};
  return {
    title: `${cs.title} | Case Study`,
    description: cs.problem,
  };
}

export default function CaseStudyDetail({ params }: { params: Params }) {
  const cs = caseStudies.find((c) => c.slug === params.slug);
  if (!cs) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      {/* Header */}
      <h1 className="font-heading text-3xl md:text-4xl text-neon mb-4">
        {cs.title}
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        Industry: {cs.industry} · Services: {cs.services.join(', ')}
      </p>

      {/* Hero image */}
      <div className="relative mb-10 rounded-2xl overflow-hidden border border-white/10 h-64 md:h-80">
        <Image src={cs.image} alt={cs.title} fill className="object-cover" />
      </div>

      {/* Problem – text left, image right */}
      <section className="my-10 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-heading text-2xl text-neon mb-3">Problem</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {cs.problem}
          </p>
        </div>
        {cs.problemImage && (
          <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden border border-white/10">
            <Image
              src={cs.problemImage}
              alt={`${cs.title} – problem`}
              fill
              className="object-cover"
            />
          </div>
        )}
      </section>

      {/* Approach – image left, text right */}
      <section className="my-10 grid md:grid-cols-2 gap-8 items-center">
        {cs.approachImage && (
          <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden border border-white/10">
            <Image
              src={cs.approachImage}
              alt={`${cs.title} – approach`}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <h2 className="font-heading text-2xl text-neon mb-3">Approach</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {cs.approach}
          </p>
        </div>
      </section>

      {/* Results – text left, image right */}
      <section className="my-10 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-heading text-2xl text-neon mb-3">Results</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {cs.results}
          </p>
        </div>
        {cs.resultsImage && (
          <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden border border-white/10">
            <Image
              src={cs.resultsImage}
              alt={`${cs.title} – results`}
              fill
              className="object-cover"
            />
          </div>
        )}
      </section>

      {/* CTA */}
      <div className="mt-12 text-center">
        <a href="/contact" className="btn-neon inline-block">
          Discuss Your Project
        </a>
      </div>
    </div>
  );
}
