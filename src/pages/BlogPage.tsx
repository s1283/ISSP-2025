import React, { useState } from 'react';
import './styles/Blog.css';
import { usePageTitle } from './hooks/usePageTitle';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image?: string;
  link: string;
}

const BlogPage: React.FC = () => {
    usePageTitle('Blog');
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (postId: number) => {
    setImageErrors(prev => new Set(prev).add(postId));
  };

  // Sample blog posts data - use placeholder images or remove image property
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Prevent Dementia With These 5 Key Foods",
      date: "October 18, 2019",
      category: "Dementia",
      excerpt: "Adherence to a healthy, fruit and vegetable-based diet is becoming increasingly popular and is very promising for maintaining one's brain health...",
      // Remove or comment out the image if it doesn't exist
      // image: "/assets/images/blog/avocado.jpg",
      link: "https://braintest.com/prevent-dementia-with-these-5-key-foods/"
    },
    {
      id: 2,
      title: "How to Recognize if a Loved One Needs Alzheimer's Screening",
      date: "October 11, 2019",
      category: "Alzheimer's",
      excerpt: "Alzheimer's disease can have a very noticeable onset. Unfortunately, it is uncommon for a victim of Alzheimer's to seek help...",
      link: "https://braintest.com/how-to-recognize-if-a-loved-one-needs-alzheimers-screening/"
    },
    {
      id: 3,
      title: "3 Ways to Sleep Better to Prevent Alzheimer's Disease",
      date: "October 3, 2019",
      category: "Alzheimer's",
      excerpt: "It is not news that getting a proper night's sleep is beneficial for your brain health...",
      link: "https://braintest.com/3-ways-to-sleep-better-to-prevent-alzheimers-disease/"
    },
    {
      id: 4,
      title: "Debunking Myths About Early Dementia Diagnosis (Part 2)",
      date: "September 24, 2019",
      category: "Dementia",
      excerpt: "Myths about dementia are damaging and unfortunately abundant...",
      link: "https://braintest.com/debunking-myths-early-dementia-diagnosis-part-2/"
    },
    {
      id: 5,
      title: "Debunking Myths About Early Dementia Diagnosis (Part 1)",
      date: "September 19, 2019",
      category: "Dementia",
      excerpt: "Some myths can be fun and relatively harmless in nature...",
      link: "https://braintest.com/debunking-myths-early-dementia-diagnosis-part-1/"
    }
  ];

  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div className="blog-page">
      <div className="blog-container">
        <header className="blog-header">
          <h1>Blog</h1>
        </header>

        <div className="blog-layout">
          {/* Main Content */}
          <section className="blog-main">
            <div className="blog-posts">
              {blogPosts.map((post, index) => (
                <article key={post.id} className={`blog-post ${index === 0 ? 'featured' : ''}`}>
                  <header className="post-header">
                    <h2 className={index === 0 ? 'post-title-main' : 'post-title'}>
                      <a href={post.link}>{post.title}</a>
                    </h2>
                    <ul className="post-meta">
                      <li className="post-date">
                        <i className="icon-calendar">📅</i>
                        <time>{post.date}</time>
                      </li>
                    </ul>
                  </header>

                  {/* Only render image if it exists and hasn't errored */}
                  {post.image && !imageErrors.has(post.id) && (
                    <figure className="post-image">
                      <a href={post.link}>
                        <img 
                          src={post.image} 
                          alt={post.title}
                          onError={() => handleImageError(post.id)}
                        />
                      </a>
                    </figure>
                  )}

                  <section className="post-excerpt">
                    {post.excerpt}
                  </section>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <nav className="blog-pagination">
              <a href="https://braintest.com/blog/" className="pagination-next">More Posts →</a>
            </nav>
          </section>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            {/* Feature Buttons */}
            <div className="sidebar-widget feature-buttons">
              <a href="https://app.braintest.com/login" className="feature-btn">
                <i className="icon-subscribe">📧</i>
                <span>Stay up to date</span>
              </a>
              <a href="/knowledge" className="feature-btn">
                <i className="icon-brain">🧠</i>
                <span>Knowledge Center</span>
              </a>
              <a href="/about" className="feature-btn">
                <i className="icon-info">ℹ️</i>
                <span>About BrainTest</span>
              </a>
            </div>

            {/* Recent Posts */}
            <div className="sidebar-widget recent-posts-widget">
              <h3 className="widget-title">
                <a href="/blog">Recent Posts</a>
              </h3>
              <ul className="recent-posts-list">
                {recentPosts.map((post) => (
                  <li key={post.id}>
                    <a href={post.link}>{post.title}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* App Download Banner */}
            <div className="sidebar-widget app-banner">
              <a href="https://app.braintest.com" target="_blank" rel="noopener noreferrer">
                <div className="banner-placeholder">
                  <p>Download BrainTest App</p>
                  <div className="app-icon">📱</div>
                </div>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;