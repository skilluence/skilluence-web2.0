import Link from "next/link";
import { Calendar, User, ArrowUpRight, Clock } from "lucide-react";
import SiteFooter from "@/components/footer/Footer";
import { posts } from "@/lib/posts";
import styles from "./page.module.css";

export const metadata = {
  title: "Blog | Skilluence",
  description:
    "Career insights, H1B guidance, OPT strategies, and placement tips from the Skilluence team.",
};

const featured = posts.find((p) => p.featured)!;
const rest = posts.filter((p) => !p.featured);

export default function BlogPage() {
  return (
    <main>

      {/* Hero */}
      <section className={styles["blog-hero"]}>
        <div className={styles["blog-hero-inner"]}>
          <div className={styles["blog-kicker"]}>
            <span>Insights</span>
            <span>Skilluence Blog</span>
          </div>
          <div className={styles["blog-hero-layout"]}>
            <div className={styles["blog-hero-main"]}>
              <p className="eyebrow">Our Blog</p>
              <h1>Career insights that actually move the needle.</h1>
              <p>
                H1B strategies, OPT placement guides, interview prep, and
                workplace growth — written by people who live this work every day.
              </p>
            </div>
            <aside className={styles["blog-hero-snapshot"]}>
              <span>Updated</span>
              <strong>Weekly</strong>
              <p>
                Fresh perspectives on U.S. job market trends, international
                student career strategy, and workplace development.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Featured post */}
      <section className={`section ${styles["featured-section"]}`}>
        <p className={styles["featured-label"]}>Featured Article</p>
        <article className={styles["featured-card"]}>
          <div className={styles["featured-card-body"]}>
            <div className={styles["post-tags"]}>
              {featured.tags.map((tag) => (
                <span key={tag} className={styles["tag"]}>{tag}</span>
              ))}
            </div>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <div className={styles["post-meta"]}>
              <span><Calendar size={14} />{featured.date}</span>
              <span><User size={14} />{featured.author}</span>
              <span><Clock size={14} />{featured.readTime}</span>
            </div>
            <Link href={`/blog/${featured.slug}`} className={styles["read-more-featured"]}>
              Read Article <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className={styles["featured-card-visual"]}>
            <img
              src="/Webinar-rafiki.png"
              alt=""
              className={styles["featured-card-image"]}
            />
          </div>
        </article>
      </section>

      {/* All posts grid */}
      <section className={`section ${styles["posts-section"]}`}>
        <div className="section-heading">
          <p className="eyebrow">All Posts</p>
          <h2>More from the blog.</h2>
        </div>
        <div className={styles["posts-grid"]}>
          {rest.map((post) => (
            <article key={post.slug} className={styles["post-card"]}>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt=""
                  className={styles["post-card-image"]}
                  loading="lazy"
                />
              )}
              <div className={styles["post-card-overlay"]} />
              <div className={styles["post-card-inner"]}>
                <div className={styles["post-tags"]}>
                  {post.tags.map((tag) => (
                    <span key={tag} className={styles["tag"]}>{tag}</span>
                  ))}
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
              <div className={styles["post-card-footer"]}>
                <div className={styles["post-meta"]}>
                  <span><Calendar size={13} />{post.date}</span>
                  <span><Clock size={13} />{post.readTime}</span>
                </div>
                <Link href={`/blog/${post.slug}`} className={styles["read-more"]}>
                  Read more <ArrowUpRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
