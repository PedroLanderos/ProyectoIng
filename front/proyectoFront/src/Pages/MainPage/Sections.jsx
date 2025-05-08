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
    },
    {
      title: 'Cellular Automata',
      categories: ['Complex Systems', 'Emergent Behavior', 'Computational Models', 'Discrete Mathematics', 'Simulation'],
      description: 'Explore how simple rules in cellular automata give rise to complex behaviors, with applications in modeling biological systems, physics, and computation theory.',
      popularArticles: [
        {
          id: '874752',
          title: 'Computations on Nondeterministic Cellular Automata',
          detail: 'Ozhigov, Yuri, 1998 – CORE.ac.uk',
        },
        {
          id: '41805933',
          title: 'Self-verifying cellular automata',
          detail: 'A Malcher, AR Smith III, 2018 – CORE.ac.uk',
        },
        {
          id: '606740',
          title: 'Quantum Cellular Automata',
          detail: 'Wiesner, K., 2008 – CORE.ac.uk',
        },
      ]
    },
    {
      title: 'Neural Networks and Deep Learning',
      categories: ['Machine Learning', 'Artificial Intelligence', 'Pattern Recognition', 'Computer Vision', 'Natural Language Processing'],
      description: 'Dive into the foundations and advancements of neural networks and deep learning, which power modern AI applications in image recognition, language understanding, and predictive modeling.',
      popularArticles: [
        {
          id: '42848755',
          title: 'Deep learning with convolutional neural networks for EEG decoding and visualization',
          detail: 'Ball, Tonio, 2017 – CORE.ac.uk',
        },
        {
          id: '18058560',
          title: 'Simultaneous Feature Learning and Hash Coding with Deep Neural Networks',
          detail: 'Lai, Hanjiang, Liu, Ye, Pan, Yan, Yan, Shuicheng, 2015 – CORE.ac.uk',
        },
        {
          id: '58952014',
          title: 'A parallel Fortran framework for neural networks and deep learning',
          detail: 'Curcic, Milan, 2019 – CORE.ac.uk',
        },
      ]
    },
    {
      title: 'Quantum Computing',
      categories: ['Quantum Algorithms', 'Quantum Mechanics', 'Computational Complexity', 'Quantum Information Theory', 'Cryptography'],
      description: 'Learn about the principles of quantum computing and how it challenges classical computation, enabling new possibilities in cryptography, optimization, and simulation of quantum systems.',
      popularArticles: [
        {
          id: '588207',
          title: 'Optical Quantum Computing',
          detail: 'Aoki, Bennett, 2007 – CORE.ac.uk',
        },
        {
          id: '44765149',
          title: 'Quantum Computing and Quantum Algorithms',
          detail: 'Serban, Daniel, 2020 – CORE.ac.uk',
        },
        {
          id: '718483',
          title: 'Quantum Computing',
          detail: 'A Andre, A Batra, 2010 – CORE.ac.uk',
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
