import React, { useState } from 'react';
import { usePageTitle } from './hooks/usePageTitle';
import './styles/KnowledgeCenter.css';

interface Article {
  title: string;
  link: string;
}

interface Category {
  name: string;
  slug: string;
  image: string;
  articles: Article[];
}

const KnowledgeCenter: React.FC = () => {
  usePageTitle('Knowledge Center');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Category[] = [
    {
      name: "Alzheimer's",
      slug: 'alzheimers',
      image: '/assets/images/knowledge/alzheimers.jpg',
      articles: [
        {
          title: "Could Alzheimer's Eventually Be Spotted by an Optician?",
          link: 'https://braintest.com/alzheimers-eventually-spotted-optician/'
        },
        {
          title: "A Team of Scientists Have Made Another 'Breakthrough' In Alzheimer's Research",
          link: 'https://braintest.com/team-scientists-made-another-breakthrough-alzheimers-research/'
        },
        {
          title: 'A New Drug Has Been Shown to Improve Brain Function in Mice',
          link: 'https://braintest.com/new-drug-shown-improve-brain-function-mice/'
        },
        {
          title: 'Nearly Half of Caregivers Experience Distress',
          link: 'https://braintest.com/nearly-half-caregivers-experience-distress/'
        }
      ]
    },
    {
      name: 'Dementia',
      slug: 'dementia',
      image: '/assets/images/knowledge/dementia.jpg',
      articles: [
        {
          title: 'A New Drug Has Been Shown to Improve Brain Function in Mice',
          link: 'https://braintest.com/new-drug-shown-improve-brain-function-mice/'
        },
        {
          title: "Green Vegetables Help Keep Elderly Brains 'Younger'",
          link: 'https://braintest.com/green-vegetables-help-keep-elderly-brains-younger/'
        },
        {
          title: 'Could Eating at the Same Time Every Day Really Stave off Symptoms of Dementia?',
          link: 'https://braintest.com/eating-time-every-day-really-stave-off-dementia-symptoms/'
        },
        {
          title: 'Could More Lean Protein Really Protect Your Brain?',
          link: 'https://braintest.com/lean-protein-really-protect-brain/'
        }
      ]
    },
    {
      name: 'Mild Cognitive Impairment',
      slug: 'cognitive-impairments',
      image: '/assets/images/knowledge/mci.jpg',
      articles: [
        {
          title: "Struggling with Your Memory? Could It Be the First Sign of Alzheimer's?",
          link: 'https://braintest.com/struggling-memory-first-sign-alzheimers/'
        },
        {
          title: 'The Connection Between Mild Cognitive Impairment and Mental Activities',
          link: 'https://braintest.com/connection-mild-cognitive-impairment-mental-activities/'
        },
        {
          title: "Difference Between Mild Cognitive Impairment (MCI) and Alzheimer's",
          link: 'https://braintest.com/difference-between-mci-and-alzheimers/'
        },
        {
          title: 'Mild Cognitive Impairment (MCI) Myths & Facts',
          link: 'https://braintest.com/mild-cognitive-impairment-myths-facts/'
        }
      ]
    },
    {
      name: 'Other Dementias',
      slug: 'other-dementias',
      image: '/assets/images/knowledge/other-dementias.jpg',
      articles: [
        {
          title: "Alzheimer's Disease and Dementia Research Highlights From 2018",
          link: 'https://braintest.com/alzheimers-dementia-research-highlights-2018/'
        },
        {
          title: "Could Your Tears Provide Clues About Your Risk of Parkinson's?",
          link: 'https://braintest.com/tears-provide-clues-risk-parkinsons/'
        },
        {
          title: "Difference Between Vascular Dementia and Alzheimer's",
          link: 'https://braintest.com/difference-between-vascular-dementia-and-alzheimers/'
        },
        {
          title: 'Mixed Dementia – Diet & Nutrition',
          link: 'https://braintest.com/mixed-dementia-diet-nutrition/'
        }
      ]
    }
  ];

  const popularArticles = [
    {
      title: "Alzheimer's Statistics – United States & Worldwide Stats",
      link: 'https://braintest.com/alzheimers-statistics-throughout-the-united-states-and-worldwide/'
    },
    {
      title: 'Dementia Statistics – U.S. & Worldwide Stats',
      link: 'https://braintest.com/dementia-stats-u-s-worldwide/'
    },
    {
      title: "12 Early Signs of Alzheimer's Disease",
      link: 'https://braintest.com/12-early-signs-of-alzheimers-disease/'
    },
    {
      title: 'Early Intervention Is Key (Here Is How to Spot Alzheimer\'s in Those You Love)',
      link: 'https://braintest.com/early-intervention-key-spot-alzheimers-love/'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `https://braintest.com/?s=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="knowledge-center-page">
      {/* Hero Section with Search */}
      <section className="knowledge-hero">
        <div className="knowledge-hero-content">
          <h1>Knowledge Center</h1>
          <p className="knowledge-intro">
            Explore our comprehensive library of articles about brain health, 
            cognitive impairment, and the latest research in Alzheimer's and dementia.
          </p>
          
          {/* Search Bar */}
          <form className="knowledge-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <span>🔍</span>
            </button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <section className="knowledge-content">
        <div className="knowledge-container">
          {/* Categories Grid */}
          <div className="knowledge-main">
            <div className="categories-grid">
              {categories.map((category, index) => (
                <div key={index} className="category-card">
                  <div className="category-header">
                    <h2 className="category-title">
                      <a href={`https://braintest.com/${category.slug}/`}>
                        {category.name}
                      </a>
                    </h2>
                  </div>
                  
                  <div className="category-image">
                    <a href={`https://braintest.com/${category.slug}/`}>
                      <img
                        src={category.image}
                        alt={category.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 
                            'https://via.placeholder.com/400x250/472A76/ffffff?text=' + 
                            encodeURIComponent(category.name);
                        }}
                      />
                    </a>
                  </div>

                  <ul className="article-list">
                    {category.articles.map((article, idx) => (
                      <li key={idx}>
                        <a 
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {article.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="knowledge-sidebar">
            {/* Action Buttons */}
            <div className="sidebar-actions">
              <a href="https://app.braintest.com/login" className="action-btn subscribe-btn">
                <span className="btn-icon">📧</span>
                <span>Stay up to date</span>
              </a>
              <a href="/about" className="action-btn">
                <span className="btn-icon">📄</span>
                <span>About BrainTest</span>
              </a>
              <a href="/blog" className="action-btn">
                <span className="btn-icon">📝</span>
                <span>Blog</span>
              </a>
            </div>

            {/* Popular Articles */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Popular Articles</h3>
              <ul className="popular-list">
                {popularArticles.map((article, index) => (
                  <li key={index}>
                    <a 
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Widget */}
            <div className="sidebar-widget resources-widget">
              <h3 className="widget-title">Resources</h3>
              <p>
                Access comprehensive information about cognitive health, 
                prevention strategies, and support for caregivers.
              </p>
              <a href="https://braintest.com/what-is-dementia/" className="resource-link">
                Learn More →
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeCenter;