// app/services/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/lib/services";
import Timeline from "@/components/Timeline";
import Accordion from "@/components/Accordion";
import CaseSlider from "@/components/CaseSlider";
import CalendlyPopupButton from "@/components/CalendlyPopupButton";

type Params = { slug: string };

export async function generateStaticParams() {
  return services.map((svc) => ({ slug: svc.slug }));
}

export function generateMetadata({ params }: { params: Params }) {
  const svc = services.find((s) => s.slug === params.slug);
  if (!svc) return {};
  const title = `${svc.title} | ZenithView`;
  const description = svc.tagline ?? svc.problem ?? "Service detail";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: "en_US",
      siteName: "ZenithView",
      url: `https://your-domain.com/services/${svc.slug}`,
    },
    alternates: {
      canonical: `https://your-domain.com/services/${svc.slug}`,
    },
  };
}

export default function ServiceDetailPage({ params }: { params: Params }) {
  const svc = services.find((s) => s.slug === params.slug);
  if (!svc) notFound();

  const deliverables: string[] = Array.isArray(svc!.deliverables) ? svc!.deliverables : [];
  const techStack: string[] = Array.isArray(svc!.techStack) ? svc!.techStack : [];
  const pricing:
    | { name: string; description?: string; price?: string; features?: string[] }[] =
    Array.isArray(svc!.pricing) ? svc!.pricing : [];
  const faq: { question: string; answer: string }[] = Array.isArray(svc!.faq) ? svc!.faq : [];
  const caseStudies: { title: string; slug: string }[] = Array.isArray(svc!.caseStudies)
    ? svc!.caseStudies
    : [];
  const tags: string[] = Array.isArray((svc as any).tags) ? (svc as any).tags : [];

  const timelineSteps = deliverables.map((item, index) => ({
    number: index + 1,
    title: item,
    description: "",
  }));

  const hasDemo = Boolean(svc.demoUrl);
  const primaryCaseStudy = caseStudies.length > 0 ? caseStudies[0] : null;

  // JSON-LD for SEO
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc!.title,
    description: svc!.tagline ?? svc!.problem,
    provider: {
      "@type": "Organization",
      name: "ZenithView",
      url: "https://your-domain.com",
    },
    areaServed: "Global",
    offers:
      pricing.length > 0
        ? pricing.map((p) => ({
            "@type": "Offer",
            name: p.name,
            price: p.price ?? undefined,
            priceCurrency: p.price?.match(/[€$₹]/) ? undefined : "USD",
            description: p.description,
            url: `https://your-domain.com/services/${svc!.slug}`,
          }))
        : undefined,
  };

  if (svc.demoUrl) {
    jsonLd.hasPart = {
      "@type": "CreativeWork",
      name: `${svc.title} live demo`,
      url: svc.demoUrl,
    };
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-20">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-gray-400">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <span className="mx-2 opacity-60">/</span>
        <Link href="/services" className="hover:text-white">
          Services
        </Link>
        <span className="mx-2 opacity-60">/</span>
        <span className="text-white">{svc!.title}</span>
      </nav>

      {/* Hero */}
      <header className="relative mb-12 rounded-2xl border border-white/10 bg-base/70 p-6 md:p-10 glass overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-1 rounded-md border border-white/10 text-gray-300"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="font-heading text-3xl md:text-5xl text-neon mb-3">{svc!.title}</h1>
          {svc!.tagline && (
            <p className="text-lg md:text-2xl text-gray-300 max-w-3xl">{svc!.tagline}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {hasDemo && (
              <a
                href={svc.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon"
              >
                View Live Demo
              </a>
            )}
            {primaryCaseStudy && (
              <Link
                href={`/portfolio/${primaryCaseStudy.slug}`}
                className="btn-neon bg-transparent border border-neon text-neon hover:bg-neon/10"
              >
                See Case Studies
              </Link>
            )}
          </div>
        </div>

        {/* Decorative orbs */}
        <div className="absolute -top-20 -right-14 h-56 w-56 rounded-full orb bg-neon/30" />
        <div className="absolute -bottom-20 -left-14 h-64 w-64 rounded-full orb bg-violet/25" />
      </header>

      {/* Main content layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-10">
        <main className="space-y-12">
          {/* Problem / Solution */}
          <section className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading text-2xl mb-3 text-neon">Problem</h3>
              <p className="text-gray-300 leading-relaxed">{svc!.problem}</p>
            </div>
            <div>
              <h3 className="font-heading text-2xl mb-3 text-neon">Solution</h3>
              <p className="text-gray-300 leading-relaxed">{svc!.solution}</p>
            </div>
          </section>

          {/* Workflow */}
          {timelineSteps.length > 0 && (
            <section>
              <h3 className="font-heading text-2xl mb-4 text-neon">Workflow</h3>
              <Timeline steps={timelineSteps} />
            </section>
          )}

          {/* Tech Stack */}
          {techStack.length > 0 && (
            <section>
              <h3 className="font-heading text-2xl mb-4 text-neon">Tech Stack</h3>
              <div className="flex flex-wrap gap-3">
                {techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-base/70 border border-white/10 text-sm text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Pricing */}
          {pricing.length > 0 && (
            <section>
              <h3 className="font-heading text-2xl mb-4 text-neon">Pricing</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {pricing.map((tier, idx) => (
                  <div
                    key={idx}
                    className="p-6 border border-white/10 rounded-2xl bg-base/80 card-border"
                  >
                    <h4 className="font-heading text-xl text-neon mb-1">{tier.name}</h4>
                    {tier.description && (
                      <p className="text-gray-400 mb-3 text-sm">{tier.description}</p>
                    )}
                    {tier.price && (
                      <p className="text-2xl mb-4 text-electric font-bold">{tier.price}</p>
                    )}
                    <ul className="space-y-2 text-sm text-gray-300">
                      {(tier.features ?? []).map((feat, i) => (
                        <li key={i}>• {feat}</li>
                      ))}
                    </ul>
                    <a href="/contact" className="btn-neon mt-5 inline-block w-full text-center">
                      Get Started
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          {faq.length > 0 && (
            <section>
              <h3 className="font-heading text-2xl mb-4 text-neon">FAQs</h3>
              <Accordion items={faq} />
            </section>
          )}
        </main>

        {/* Sticky side rail */}
        <aside className="space-y-6 lg:sticky lg:top-28 h-fit">
          <div className="p-5 rounded-2xl border border-white/10 bg-base/80">
            <h4 className="font-heading text-lg mb-2 text-neon">Quick actions</h4>
            <div className="flex flex-col gap-3">
              {hasDemo && (
                <a
                  href={svc.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon text-center"
                >
                  View Live Demo
                </a>
              )}
              <CalendlyPopupButton className="btn-neon text-center w-full" />
              {primaryCaseStudy && (
                <Link
                  href={`/portfolio/${primaryCaseStudy.slug}`}
                  className="btn-neon bg-transparent border border-neon text-neon hover:bg-neon/10 text-center"
                >
                  See Portfolio
                </Link>
              )}
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-white/10 bg-base/70">
            <h4 className="font-heading text-lg mb-2 text-neon">Need something custom?</h4>
            <p className="text-gray-300 text-sm mb-3">
              Tell us your criteria — we’ll scope the solution and send a quick plan.
            </p>
            <a href="/contact" className="underline text-electric hover:text-neon text-sm">
              Describe your project →
            </a>
          </div>
        </aside>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
