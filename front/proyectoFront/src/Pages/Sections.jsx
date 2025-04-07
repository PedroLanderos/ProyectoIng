import React from 'react';
import SectionBlock from './SectionBlokc.jsx';

const sectionsData = [
  {
    title: 'Life Sciences',
    categories: ['Agricultural and Biological Sciences', 'Biochemistry, Genetics and Molecular Biology', 'Environmental Science', 'Immunology and Microbiology', 'Neuroscience'],
    description: 'Explore our wide selection of Life Sciences journal articles and book chapters...',
    popularArticles: [
      { title: 'Sleep during development: Sex and gender differences', detail: 'Sleep Medicine Reviews, Volume 51' },
      { title: 'Female Penis, Male Vagina...', detail: 'Current Biology, Volume 24, Issue 9' }
    ],
    recentPublications: [
      { title: 'Neurobiology of Aging', detail: 'Volume 150' },
      { title: 'Vaccine', detail: 'Volume 52' }
    ]
  },
  {
    title: 'Life Sciences',
    categories: ['Agricultural and Biological Sciences', 'Biochemistry, Genetics and Molecular Biology', 'Environmental Science', 'Immunology and Microbiology', 'Neuroscience'],
    description: 'Explore our wide selection of Life Sciences journal articles and book chapters...',
    popularArticles: [
      { title: 'Sleep during development: Sex and gender differences', detail: 'Sleep Medicine Reviews, Volume 51' },
      { title: 'Female Penis, Male Vagina...', detail: 'Current Biology, Volume 24, Issue 9' }
    ],
    recentPublications: [
      { title: 'Neurobiology of Aging', detail: 'Volume 150' },
      { title: 'Vaccine', detail: 'Volume 52' }
    ]
  },
  {
    title: 'Life Sciences',
    categories: ['Agricultural and Biological Sciences', 'Biochemistry, Genetics and Molecular Biology', 'Environmental Science', 'Immunology and Microbiology', 'Neuroscience'],
    description: 'Explore our wide selection of Life Sciences journal articles and book chapters...',
    popularArticles: [
      { title: 'Sleep during development: Sex and gender differences', detail: 'Sleep Medicine Reviews, Volume 51' },
      { title: 'Female Penis, Male Vagina...', detail: 'Current Biology, Volume 24, Issue 9' }
    ],
    recentPublications: [
      { title: 'Neurobiology of Aging', detail: 'Volume 150' },
      { title: 'Vaccine', detail: 'Volume 52' }
    ]
  },
  {
    title: 'Life Sciences',
    categories: ['Agricultural and Biological Sciences', 'Biochemistry, Genetics and Molecular Biology', 'Environmental Science', 'Immunology and Microbiology', 'Neuroscience'],
    description: 'Explore our wide selection of Life Sciences journal articles and book chapters...',
    popularArticles: [
      { title: 'Sleep during development: Sex and gender differences', detail: 'Sleep Medicine Reviews, Volume 51' },
      { title: 'Female Penis, Male Vagina...', detail: 'Current Biology, Volume 24, Issue 9' }
    ],
    recentPublications: [
      { title: 'Neurobiology of Aging', detail: 'Volume 150' },
      { title: 'Vaccine', detail: 'Volume 52' }
    ]
  },
];

const Sections = () => {
  return (
    <div>
      {sectionsData.map((section, idx) => (
        <SectionBlock key={idx} {...section} />
      ))}
    </div>
  );
};

export default Sections;
