import React from 'react';
import SectionBlock from './SectionBlokc.jsx';
import { useNavigate } from 'react-router-dom';

const Sections = () => {
  const navigate = useNavigate();

  const sectionsData = [
    {
      title: 'Artificial Intelligence in Video Games',
      categories: ['Game AI', 'Behavior Trees', 'Machine Learning', 'Pathfinding', 'Agent-Based Systems'],
      description: 'Discover key research exploring how AI is implemented in modern video games, from rule-based systems to emergent learning models.',
      popularArticles: [
        {
          id: '200716567',
          title: 'Artificial Intelligence in Video Games: Towards a Unified Framework',
          detail: 'Carvalho et al., 2021 – CORE.ac.uk',
        },
        {
          id: '200147144',
          title: 'Artificial Intelligence for Games',
          detail: 'Millington & Funge, 2019 – CORE.ac.uk',
        },
        {
          id: '4365308',
          title: 'Playing Smart - Artificial Intelligence in Computer Games',
          detail: 'Anderson, 2003 – CORE.ac.uk',
        },
      ]
    }
  ];

  const handleCategoryClick = (cat) => {
    const params = new URLSearchParams();
    params.append("query", cat);
    navigate(`/SearchArticle?${params.toString()}`);
  };

  return (
    <>
      {sectionsData.map((section, idx) => (
        <SectionBlock
          key={idx}
          {...section}
          onCategoryClick={handleCategoryClick}
          onArticleClick={(id) => navigate(`/ArticleDetail/${id}`)}
        />
      ))}
    </>
  );
};

export default Sections;
