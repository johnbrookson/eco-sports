import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { posts, getPostBySlug, getAllSlugs } from "@/lib/blog-data";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDots,
  Clock,
  User,
} from "@phosphor-icons/react/dist/ssr";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className="flex flex-col min-h-screen">
      <SiteNav variant="primary" active="blog" />

      {/* Article */}
      <article className="flex-1 py-12 sm:py-20 px-4 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl animate-page-enter">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao blog
          </Link>

          {/* Header */}
          <header>
            <span className="inline-block rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {post.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-8 border-b border-border">
              <span className="flex items-center gap-1.5">
                <User weight="duotone"className="h-3.5 w-3.5" />
                {post.author.name} · {post.author.role}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDots weight="duotone"className="h-3.5 w-3.5" />
                {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock weight="duotone"className="h-3.5 w-3.5" />
                {post.readingTime}
              </span>
            </div>
          </header>

          {/* Content */}
          <div className="mt-10 prose prose-lg max-w-none text-foreground prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-ul:my-4">
            {post.content.split("\n\n").map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i}>{block.replace("## ", "")}</h2>
                );
              }
              if (block.startsWith("- ")) {
                const items = block.split("\n").filter((l) => l.startsWith("- "));
                return (
                  <ul key={i}>
                    {items.map((item, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/^- /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
              );
            })}
          </div>

          {/* Prev / Next navigation */}
          <ScrollReveal>
            <nav className="mt-16 pt-8 border-t border-border grid gap-4 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="group flex flex-col rounded-2xl border bg-card p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <ArrowLeft className="h-3 w-3" />
                    Anterior
                  </span>
                  <span className="text-sm font-bold group-hover:text-primary transition-colors leading-snug">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {next && (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group flex flex-col items-end text-right rounded-2xl border bg-card p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    Próximo
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="text-sm font-bold group-hover:text-primary transition-colors leading-snug">
                    {next.title}
                  </span>
                </Link>
              )}
            </nav>
          </ScrollReveal>
        </div>
      </article>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
