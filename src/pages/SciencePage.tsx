import React from 'react';
import { usePageTitle } from './hooks/usePageTitle';
import './styles/Science.css';

interface Publication {
  title: string;
  authors: string;
  journal: string;
  link: string;
}

const TheScience: React.FC = () => {
  usePageTitle('The Science');

  const publications: Publication[] = [
    {
      title: 'Cognitive self-assessment scales in surgical settings: Acceptability and feasibility',
      authors: 'N. Stoicea, MD, PhD, Research Scientist, Adj. Assistant Professor, K.N. Koehler, BS, Medical Student, D.W. Scharre, MD, Professor, Neurology, S.D. Bergese, MD, Professor, Anesthesiology',
      journal: 'Best Practice & Research Clinical Anaesthesiology, 2018, 32 (2018) 303-309',
      link: 'https://braintest.com/wp-content/uploads/SAGE-in-surgical-setttings.pdf'
    },
    {
      title: 'Getting Closer? Differences Remain in Neuropsychological Assessments Converted to Mobile Devices',
      authors: 'Áine Maguire, Jennifer Martin, Hannes Jarke, and Kai Ruggeri',
      journal: 'Psychological Services, Accepted July 22, 2018.',
      link: 'http://dx.doi.org/10.1037/ser0000307'
    },
    {
      title: 'Cognitive Impairment in Diabetes: Rationale and Design Protocol of the Cog-ID Study',
      authors: 'Paula S Koekkoek, MD, PhD; Jolien Janssen, MSc; Minke Kooistra, PhD; Esther van den Berg, PhD; L Jaap Kappelle, MD, PhD; Geert Jan Biessels, MD, PhD; Guy EHM Rutten, MD, PhD',
      journal: 'JMIR Research Protocols, 2015;4(2):e69.',
      link: 'https://braintest.com/wp-content/uploads/Cog-ID-Protocol-design-with-SAGE.pdf'
    },
    {
      title: 'Digitally translated Self-Administered Gerocognitive Examination (eSAGE): relationship with its validated paper version, neuropsychological evaluations, and clinical assessments.',
      authors: 'Scharre DW, Chang SI, Nagaraja HN, Vrettos NE, Bornstein RA.',
      journal: 'Alzheimers Res Ther. 2017 Jun 27;9(1):44.',
      link: 'https://alzres.biomedcentral.com/articles/10.1186/s13195-017-0269-3'
    },
    {
      title: 'Self-administered Gerocognitive Examination (SAGE): a brief cognitive assessment Instrument for mild cognitive impairment (MCI) and early dementia.',
      authors: 'Scharre DW, Chang SI, Murden RA, Lamb J, Beversdorf DQ, Kataki M, Nagaraja HN, Bornstein RA.',
      journal: 'Alzheimer Dis Assoc Disord. 2010 Jan-Mar;24(1):64-71.',
      link: 'http://journals.lww.com/alzheimerjournal/Abstract/2010/01000/Self_administered_Gerocognitive_Examination.9.aspx/'
    },
    {
      title: 'Community Cognitive Screening Using the Self-Administered Gerocognitive Examination (SAGE).',
      authors: 'Scharre DW, Chang SI, Nagaraja HN, Yager-Schweller J, Murden RA.',
      journal: 'J Neuropsychiatry Clin Neurosci. 2014 Fall;26(4):369-75.',
      link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4261807/'
    },
    {
      title: 'Are We There Yet? Exploring the Impact of Translating Cognitive Tests for Dementia Using Mobile Technology in an Aging Population',
      authors: 'Ruggeri K, Maguire Á, Andrews JL, Martin E and Menon S',
      journal: 'Front. Aging Neurosci., 17 March 2016.',
      link: 'http://journal.frontiersin.org/article/10.3389/fnagi.2016.00021/full'
    },
    {
      title: "Brain Health: The Importance of Recognizing Cognitive Impairment: An IAGG Consensus Conference",
      authors: 'John E. Morley, MB, BCh, John C. Morris, MD, and others',
      journal: 'Journal of the American Medical Directors Association, Volume 16, Issue 9, 731-739.',
      link: 'http://dx.doi.org/10.1016/j.jamda.2015.06.017'
    }
  ];

  return (
    <div className="science-page">
      {/* Hero Section */}
      <section className="science-hero">
        <div className="science-hero-content">
          <h1>The Science</h1>
          <p className="science-intro">
            BrainTest is based on scientifically validated research and peer-reviewed publications. 
            Our cognitive assessment tools are grounded in rigorous scientific methodology and 
            continuous research collaboration with leading medical institutions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="science-content">
        <div className="content-container">
          {/* Publications Section */}
          <div className="publications-section">
            <h2 className="science-section-title">Publications</h2>
            <ul className="publications-list">
              {publications.map((pub, index) => (
                <li key={index} className="publication-item">
                  <h3 className="publication-title">
                    <a 
                      href={pub.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="publication-link"
                    >
                      {pub.title}
                    </a>
                  </h3>
                  <p className="publication-authors">{pub.authors}</p>
                  <p className="publication-journal">
                    <em>{pub.journal}</em>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar */}
          <aside className="science-sidebar">
            <div className="sidebar-card">
              <h3>Scientific Liaison</h3>
              <p>
                To explore scientific collaboration with BrainTest or Dr. Scharre at 
                the Ohio State University, please contact:
              </p>
              <p className="contact-person">
                <strong>Michael Kader</strong>
              </p>
              <a href="mailto:press@braintest.com" className="contact-email">
                press@braintest.com
              </a>
            </div>

            <div className="sidebar-card info-card">
              <h3>About SAGE</h3>
              <p>
                The Self-Administered Gerocognitive Examination (SAGE) is a brief 
                cognitive assessment tool designed to detect early signs of cognitive 
                impairment.
              </p>
              <p>
                SAGE was developed at The Ohio State University Wexner Medical Center 
                and has been validated through extensive clinical research.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default TheScience;