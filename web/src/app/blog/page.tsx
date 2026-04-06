import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { posts } from "@/lib/blog-data";
import {
  ArrowRight,
  CalendarDots,
  Clock,
  User,
} from "@phosphor-icons/react/dist/ssr";

export default function BlogPage() {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="flex flex-col min-h-screen">
      <SiteNav variant="primary" active="blog" />

      {/* Hero */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-8 lg:px-16 bg-gradient-to-br from-hero-start to-hero-end overflow-hidden">
        <div className="relative z-[1] mx-auto max-w-5xl text-center animate-page-enter">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Blog
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-relaxed text-white/65 font-light">
            Artigos, notícias e insights sobre desenvolvimento esportivo,
            carreira e tecnologia no esporte.
          </p>
        </div>
        <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-accent/10 blur-[100px]" />

        <div className="absolute -bottom-px left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-[50px] sm:h-[80px] block"
            preserveAspectRatio="none"
          >
            <path
              d="M0 80L1440 80L1440 0L0 72Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Featured post */}
      <section className="py-16 px-4 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-2xl border bg-card overflow-hidden shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
            >
              {featured.coverImage && (
                <div className="relative aspect-[21/9] w-full overflow-hidden">
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
              )}
              <div className="p-6 sm:p-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  {featured.category}
                </span>
                <span className="text-xs text-muted-foreground">Destaque</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                {featured.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User weight="duotone"className="h-3.5 w-3.5" />
                  {featured.author.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDots weight="duotone"className="h-3.5 w-3.5" />
                  {new Date(featured.publishedAt).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock weight="duotone"className="h-3.5 w-3.5" />
                  {featured.readingTime}
                </span>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Ler artigo
                <ArrowRight weight="bold"className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Post grid */}
      <section className="pb-28 px-4 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border bg-card overflow-hidden shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
              >
                {post.coverImage && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-6">
                <span className="inline-block self-start rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
                  {post.category}
                </span>
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                  {post.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDots weight="duotone"className="h-3 w-3" />
                    {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock weight="duotone"className="h-3 w-3" />
                    {post.readingTime}
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Ler mais
                  <ArrowRight weight="bold"className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
                </div>
              </Link>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
