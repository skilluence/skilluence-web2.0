import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, ArrowUpRight, Tag } from "lucide-react";
import SiteFooter from "@/components/footer/Footer";
import { posts } from "@/lib/posts";
import styles from "./page.module.css";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | Skilluence Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = posts
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  return (
    <main>

      {/* Article Hero */}
      <section className={styles["post-hero"]}>
        <div className={styles["post-hero-inner"]}>
          <div className={styles["post-kicker"]}>
            <span>Skilluence Blog</span>
            <span>Career Insights</span>
          </div>
          <div className={styles["post-hero-layout"]}>
            <div className={styles["post-hero-main"]}>
              <Link href="/blog" className={styles["back-link"]}>
                <ArrowLeft size={16} /> Back to Blog
              </Link>
              <p className="eyebrow">Article Detail</p>
              <div className={styles["post-tags"]}>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles["tag"]}>
                    <Tag size={11} /> {tag}
                  </span>
                ))}
              </div>
              <h1>{post.title}</h1>
              <p className={styles["post-excerpt"]}>{post.excerpt}</p>
            </div>

            <aside className={styles["post-hero-snapshot"]}>
              <span>Written by</span>
              <strong>{post.author}</strong>
              <p>
                Practical guidance for international students, career builders,
                and teams navigating placement strategy.
              </p>
              <div className={styles["post-meta"]}>
                <span><Calendar size={15} />{post.date}</span>
                <span><Clock size={15} />{post.readTime}</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Featured image */}
      {post.imageUrl && (
        <div className={styles["post-image-wrap"]}>
          <img src={post.imageUrl} alt={post.title} className={styles["post-image"]} />
        </div>
      )}

      {/* Article body */}
      <div className={styles["post-layout"]}>
        <article className={styles["post-body"]}>
          {post.body.map((section, i) => {
            if (section.type === "h2") {
              return <h2 key={i}>{section.content as string}</h2>;
            }
            if (section.type === "h3") {
              return <h3 key={i}>{section.content as string}</h3>;
            }
            if (section.type === "p") {
              return <p key={i}>{section.content as string}</p>;
            }
            if (section.type === "quote") {
              return (
                <blockquote key={i}>
                  <p>{section.content as string}</p>
                </blockquote>
              );
            }
            if (section.type === "ul") {
              return (
                <ul key={i}>
                  {(section.content as string[]).map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            }
            return null;
          })}
        </article>

        {/* Sidebar */}
        <aside className={styles["post-sidebar"]}>
          <div className={styles["sidebar-card"]}>
            <div className={styles["sidebar-avatar"]}>{post.author[0]}</div>
            <p className={styles["sidebar-label"]}>Written by</p>
            <strong>{post.author}</strong>
            <p className={styles["sidebar-bio"]}>
              Career strategist at Skilluence helping international talent navigate the U.S. job market.
            </p>
          </div>
          <div className={styles["sidebar-cta"]}>
            <p className={styles["sidebar-cta-label"]}>Ready to land your role?</p>
            <p>Talk to a Skilluence advisor about your placement strategy.</p>
            <Link href="/contact" className={styles["sidebar-cta-btn"]}>
              Book a Consultation <ArrowUpRight size={15} />
            </Link>
          </div>
        </aside>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className={`section ${styles["related-section"]}`}>
          <div className={styles["related-heading"]}>
            <p className="eyebrow">Keep Reading</p>
            <h2>Related articles.</h2>
          </div>
          <div className={styles["related-grid"]}>
            {related.map((rp) => (
              <article key={rp.slug} className={styles["related-card"]}>
                {rp.imageUrl && (
                  <div className={styles["related-card-img-wrap"]}>
                    <img src={rp.imageUrl} alt="" loading="lazy" />
                  </div>
                )}
                <div className={styles["related-card-body"]}>
                  <div className={styles["post-tags"]}>
                    {rp.tags.map((t) => (
                      <span key={t} className={styles["tag"]}>{t}</span>
                    ))}
                  </div>
                  <h3>{rp.title}</h3>
                  <p>{rp.excerpt}</p>
                  <Link href={`/blog/${rp.slug}`} className={styles["related-read-more"]}>
                    Read article <ArrowUpRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
