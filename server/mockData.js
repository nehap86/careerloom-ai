// Mock data for when OPENAI_API_KEY is not set
// Provides realistic sample data so the entire app works without paid API

const OCCUPATIONS = [
  {
    id: 'marketing-manager',
    title: 'Marketing Manager',
    onet_code: '11-2021.00',
    median_salary: 140000,
    growth_rate: 10,
    category: 'Management',
  },
  {
    id: 'software-developer',
    title: 'Software Developer',
    onet_code: '15-1252.00',
    median_salary: 130000,
    growth_rate: 25,
    category: 'Technology',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    onet_code: '15-2051.00',
    median_salary: 100000,
    growth_rate: 35,
    category: 'Technology',
  },
  {
    id: 'ux-designer',
    title: 'UX Designer',
    onet_code: '15-1255.00',
    median_salary: 110000,
    growth_rate: 16,
    category: 'Design',
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    onet_code: '11-1021.00',
    median_salary: 145000,
    growth_rate: 12,
    category: 'Management',
  },
];

const SKILLS_DATABASE = [
  { name: 'Project Management', category: 'Management', onet_code: '2.B.1.a' },
  { name: 'Data Analysis', category: 'Analytical', onet_code: '2.A.1.e' },
  { name: 'Python Programming', category: 'Technical', onet_code: '2.B.3.a' },
  { name: 'JavaScript', category: 'Technical', onet_code: '2.B.3.b' },
  { name: 'SQL & Databases', category: 'Technical', onet_code: '2.B.3.c' },
  { name: 'Machine Learning', category: 'Technical', onet_code: '2.B.3.d' },
  { name: 'Strategic Planning', category: 'Management', onet_code: '2.B.1.b' },
  { name: 'Communication', category: 'Interpersonal', onet_code: '2.A.1.a' },
  { name: 'Leadership', category: 'Management', onet_code: '2.B.1.c' },
  { name: 'User Research', category: 'Design', onet_code: '2.A.1.f' },
  { name: 'Visual Design', category: 'Design', onet_code: '2.B.4.a' },
  { name: 'Agile/Scrum', category: 'Management', onet_code: '2.B.1.d' },
  { name: 'Digital Marketing', category: 'Marketing', onet_code: '2.B.5.a' },
  { name: 'SEO/SEM', category: 'Marketing', onet_code: '2.B.5.b' },
  { name: 'Content Strategy', category: 'Marketing', onet_code: '2.B.5.c' },
  { name: 'Financial Analysis', category: 'Analytical', onet_code: '2.A.1.g' },
  { name: 'Presentation Skills', category: 'Interpersonal', onet_code: '2.A.1.b' },
  { name: 'Negotiation', category: 'Interpersonal', onet_code: '2.A.1.c' },
  { name: 'Problem Solving', category: 'Analytical', onet_code: '2.A.2.a' },
  { name: 'Critical Thinking', category: 'Analytical', onet_code: '2.A.2.b' },
  { name: 'Cloud Computing (AWS/GCP)', category: 'Technical', onet_code: '2.B.3.e' },
  { name: 'API Development', category: 'Technical', onet_code: '2.B.3.f' },
  { name: 'Figma / Design Tools', category: 'Design', onet_code: '2.B.4.b' },
  { name: 'Stakeholder Management', category: 'Management', onet_code: '2.B.1.e' },
  { name: 'A/B Testing', category: 'Analytical', onet_code: '2.A.1.h' },
];

function mockExtractSkills(resumeText) {
  const text = resumeText.toLowerCase();
  const detected = [];

  const keywordMap = {
    'project': { name: 'Project Management', category: 'Management', onet_code: '2.B.1.a', proficiency: 75 },
    'manage': { name: 'Project Management', category: 'Management', onet_code: '2.B.1.a', proficiency: 70 },
    'data': { name: 'Data Analysis', category: 'Analytical', onet_code: '2.A.1.e', proficiency: 70 },
    'analys': { name: 'Data Analysis', category: 'Analytical', onet_code: '2.A.1.e', proficiency: 72 },
    'python': { name: 'Python Programming', category: 'Technical', onet_code: '2.B.3.a', proficiency: 80 },
    'javascript': { name: 'JavaScript', category: 'Technical', onet_code: '2.B.3.b', proficiency: 78 },
    'react': { name: 'JavaScript', category: 'Technical', onet_code: '2.B.3.b', proficiency: 82 },
    'sql': { name: 'SQL & Databases', category: 'Technical', onet_code: '2.B.3.c', proficiency: 75 },
    'database': { name: 'SQL & Databases', category: 'Technical', onet_code: '2.B.3.c', proficiency: 68 },
    'machine learning': { name: 'Machine Learning', category: 'Technical', onet_code: '2.B.3.d', proficiency: 60 },
    'ai': { name: 'Machine Learning', category: 'Technical', onet_code: '2.B.3.d', proficiency: 55 },
    'strateg': { name: 'Strategic Planning', category: 'Management', onet_code: '2.B.1.b', proficiency: 72 },
    'communicat': { name: 'Communication', category: 'Interpersonal', onet_code: '2.A.1.a', proficiency: 80 },
    'lead': { name: 'Leadership', category: 'Management', onet_code: '2.B.1.c', proficiency: 75 },
    'team': { name: 'Leadership', category: 'Management', onet_code: '2.B.1.c', proficiency: 70 },
    'research': { name: 'User Research', category: 'Design', onet_code: '2.A.1.f', proficiency: 65 },
    'design': { name: 'Visual Design', category: 'Design', onet_code: '2.B.4.a', proficiency: 60 },
    'agile': { name: 'Agile/Scrum', category: 'Management', onet_code: '2.B.1.d', proficiency: 78 },
    'scrum': { name: 'Agile/Scrum', category: 'Management', onet_code: '2.B.1.d', proficiency: 80 },
    'marketing': { name: 'Digital Marketing', category: 'Marketing', onet_code: '2.B.5.a', proficiency: 75 },
    'seo': { name: 'SEO/SEM', category: 'Marketing', onet_code: '2.B.5.b', proficiency: 70 },
    'content': { name: 'Content Strategy', category: 'Marketing', onet_code: '2.B.5.c', proficiency: 68 },
    'financ': { name: 'Financial Analysis', category: 'Analytical', onet_code: '2.A.1.g', proficiency: 65 },
    'budget': { name: 'Financial Analysis', category: 'Analytical', onet_code: '2.A.1.g', proficiency: 62 },
    'present': { name: 'Presentation Skills', category: 'Interpersonal', onet_code: '2.A.1.b', proficiency: 72 },
    'negotiat': { name: 'Negotiation', category: 'Interpersonal', onet_code: '2.A.1.c', proficiency: 68 },
    'problem': { name: 'Problem Solving', category: 'Analytical', onet_code: '2.A.2.a', proficiency: 80 },
    'critical': { name: 'Critical Thinking', category: 'Analytical', onet_code: '2.A.2.b', proficiency: 78 },
    'aws': { name: 'Cloud Computing (AWS/GCP)', category: 'Technical', onet_code: '2.B.3.e', proficiency: 65 },
    'cloud': { name: 'Cloud Computing (AWS/GCP)', category: 'Technical', onet_code: '2.B.3.e', proficiency: 60 },
    'api': { name: 'API Development', category: 'Technical', onet_code: '2.B.3.f', proficiency: 70 },
    'figma': { name: 'Figma / Design Tools', category: 'Design', onet_code: '2.B.4.b', proficiency: 72 },
    'stakeholder': { name: 'Stakeholder Management', category: 'Management', onet_code: '2.B.1.e', proficiency: 70 },
    'testing': { name: 'A/B Testing', category: 'Analytical', onet_code: '2.A.1.h', proficiency: 65 },
  };

  const seen = new Set();
  for (const [keyword, skill] of Object.entries(keywordMap)) {
    if (text.includes(keyword) && !seen.has(skill.name)) {
      seen.add(skill.name);
      detected.push(skill);
    }
  }

  // Always return at least some skills for demo purposes
  if (detected.length < 3) {
    const defaults = [
      { name: 'Communication', category: 'Interpersonal', onet_code: '2.A.1.a', proficiency: 75 },
      { name: 'Problem Solving', category: 'Analytical', onet_code: '2.A.2.a', proficiency: 72 },
      { name: 'Critical Thinking', category: 'Analytical', onet_code: '2.A.2.b', proficiency: 70 },
      { name: 'Project Management', category: 'Management', onet_code: '2.B.1.a', proficiency: 65 },
      { name: 'Presentation Skills', category: 'Interpersonal', onet_code: '2.A.1.b', proficiency: 68 },
    ];
    for (const d of defaults) {
      if (!seen.has(d.name)) {
        detected.push(d);
        seen.add(d.name);
      }
      if (detected.length >= 5) break;
    }
  }

  return detected;
}

function mockCareerPaths(sourceRole, skills) {
  const skillNames = skills.map(s => s.name || s.skill_name);
  const paths = [
    {
      target_role: 'Product Manager',
      median_salary: 145000,
      growth_rate: 12,
      market_demand: 'High',
      skill_overlap: 0,
      feasibility_score: 0,
      skill_gaps: ['Product Roadmapping', 'User Story Writing', 'Market Analysis'],
      transition_time_months: 4,
    },
    {
      target_role: 'Data Analyst',
      median_salary: 100000,
      growth_rate: 35,
      market_demand: 'Very High',
      skill_overlap: 0,
      feasibility_score: 0,
      skill_gaps: ['Advanced SQL', 'Tableau/Power BI', 'Statistical Modeling'],
      transition_time_months: 5,
    },
    {
      target_role: 'UX Designer',
      median_salary: 110000,
      growth_rate: 16,
      market_demand: 'High',
      skill_overlap: 0,
      feasibility_score: 0,
      skill_gaps: ['Wireframing', 'Usability Testing', 'Interaction Design'],
      transition_time_months: 6,
    },
    {
      target_role: 'Software Developer',
      median_salary: 130000,
      growth_rate: 25,
      market_demand: 'Very High',
      skill_overlap: 0,
      feasibility_score: 0,
      skill_gaps: ['Data Structures', 'System Design', 'Version Control (Git)'],
      transition_time_months: 8,
    },
    {
      target_role: 'Marketing Manager',
      median_salary: 140000,
      growth_rate: 10,
      market_demand: 'Medium',
      skill_overlap: 0,
      feasibility_score: 0,
      skill_gaps: ['Brand Strategy', 'Campaign Analytics', 'Marketing Automation'],
      transition_time_months: 3,
    },
    {
      target_role: 'DevOps Engineer',
      median_salary: 135000,
      growth_rate: 22,
      market_demand: 'High',
      skill_overlap: 0,
      feasibility_score: 0,
      skill_gaps: ['CI/CD Pipelines', 'Docker & Kubernetes', 'Infrastructure as Code'],
      transition_time_months: 7,
    },
    {
      target_role: 'Business Analyst',
      median_salary: 95000,
      growth_rate: 14,
      market_demand: 'Medium',
      skill_overlap: 0,
      feasibility_score: 0,
      skill_gaps: ['Requirements Gathering', 'Process Modeling', 'JIRA Administration'],
      transition_time_months: 3,
    },
  ];

  // Remove current role from paths
  const filtered = paths.filter(
    p => p.target_role.toLowerCase() !== (sourceRole || '').toLowerCase()
  );

  // Calculate skill overlap based on role relevance
  const roleSkillMap = {
    'Product Manager': ['Project Management', 'Strategic Planning', 'Communication', 'Leadership', 'Agile/Scrum', 'Stakeholder Management', 'Data Analysis'],
    'Data Analyst': ['Data Analysis', 'SQL & Databases', 'Python Programming', 'Problem Solving', 'Critical Thinking', 'Presentation Skills', 'A/B Testing'],
    'UX Designer': ['User Research', 'Visual Design', 'Figma / Design Tools', 'Communication', 'Problem Solving', 'A/B Testing', 'Presentation Skills'],
    'Software Developer': ['JavaScript', 'Python Programming', 'SQL & Databases', 'API Development', 'Cloud Computing (AWS/GCP)', 'Problem Solving', 'Agile/Scrum'],
    'Marketing Manager': ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Data Analysis', 'Strategic Planning', 'Communication', 'A/B Testing'],
    'DevOps Engineer': ['Cloud Computing (AWS/GCP)', 'Python Programming', 'API Development', 'Problem Solving', 'Agile/Scrum', 'SQL & Databases'],
    'Business Analyst': ['Data Analysis', 'Communication', 'Problem Solving', 'SQL & Databases', 'Stakeholder Management', 'Presentation Skills', 'Critical Thinking'],
  };

  for (const path of filtered) {
    const targetSkills = roleSkillMap[path.target_role] || [];
    const matching = skillNames.filter(s => targetSkills.includes(s));
    path.skill_overlap = targetSkills.length > 0
      ? Math.round((matching.length / targetSkills.length) * 100)
      : Math.floor(Math.random() * 30) + 20;
    path.feasibility_score = Math.min(100, path.skill_overlap + Math.floor(Math.random() * 15) + 10);
  }

  return filtered.sort((a, b) => b.feasibility_score - a.feasibility_score);
}

function mockGenerateRoadmap(targetRole, skillGaps) {
  const weekTemplates = {
    'Product Manager': [
      { week: 1, topic: 'Product Management Foundations', description: 'Understand the PM role, responsibilities, and how PMs drive product strategy across organizations.', resources: ['Product School Free Course', 'Inspired by Marty Cagan (Book)', 'Mind the Product Blog'], hours: 10 },
      { week: 2, topic: 'User Research & Discovery', description: 'Learn qualitative and quantitative research methods to deeply understand user needs and pain points.', resources: ['IDEO Human-Centered Design Kit', 'Google UX Research Course', 'User Interviews Platform'], hours: 12 },
      { week: 3, topic: 'Product Roadmapping', description: 'Master frameworks for prioritization (RICE, MoSCoW) and build compelling product roadmaps.', resources: ['Productboard Academy', 'Roadmunk Templates', 'ProductPlan Guides'], hours: 10 },
      { week: 4, topic: 'User Stories & Requirements', description: 'Write effective user stories, acceptance criteria, and product requirement documents (PRDs).', resources: ['Atlassian Agile Guide', 'User Story Mapping by Jeff Patton', 'JIRA Fundamentals'], hours: 8 },
      { week: 5, topic: 'Data-Driven Product Decisions', description: 'Use analytics, A/B testing, and metrics frameworks to make evidence-based product decisions.', resources: ['Google Analytics Academy', 'Mixpanel Free Tier', 'Lean Analytics (Book)'], hours: 12 },
      { week: 6, topic: 'Market Analysis & Competitive Intelligence', description: 'Analyze market trends, evaluate competitors, and identify strategic opportunities for your product.', resources: ['CB Insights Reports', 'Porter\'s Five Forces Framework', 'Crunchbase Research'], hours: 10 },
      { week: 7, topic: 'Agile & Scrum for PMs', description: 'Lead sprint planning, backlog grooming, and retrospectives as a product manager in agile teams.', resources: ['Scrum.org Free Course', 'Agile Manifesto', 'Mountain Goat Software Blog'], hours: 8 },
      { week: 8, topic: 'Stakeholder Communication', description: 'Develop executive communication skills, build alignment across teams, and manage competing priorities.', resources: ['Crucial Conversations (Book)', 'Presentation Zen', 'TED Talks Presentation Guide'], hours: 8 },
      { week: 9, topic: 'Technical Fluency for PMs', description: 'Build enough technical knowledge to have productive conversations with engineering teams.', resources: ['CS50 Introduction (Harvard)', 'APIs for Non-Developers', 'System Design Primer'], hours: 12 },
      { week: 10, topic: 'Product Strategy & Vision', description: 'Develop and articulate a compelling product vision, strategy, and measurable OKRs.', resources: ['Good Strategy Bad Strategy (Book)', 'Measure What Matters (OKRs)', 'Reforge Product Strategy'], hours: 10 },
      { week: 11, topic: 'Portfolio Project: End-to-End Product Case', description: 'Build a complete product case study: identify a problem, research users, define solution, create roadmap, and present to stakeholders.', resources: ['Product School Case Studies', 'Figma for Mockups', 'Notion for Documentation'], hours: 15 },
      { week: 12, topic: 'Interview Prep & Career Launch', description: 'Prepare for PM interviews with case studies, practice product sense questions, and build your professional brand.', resources: ['Cracking the PM Interview (Book)', 'Exponent PM Practice', 'LinkedIn Profile Optimization Guide'], hours: 12 },
    ],
    'Data Analyst': [
      { week: 1, topic: 'Data Analysis Fundamentals', description: 'Build a strong foundation in data types, analysis workflows, and statistical thinking.', resources: ['Google Data Analytics Certificate', 'Khan Academy Statistics', 'Naked Statistics (Book)'], hours: 10 },
      { week: 2, topic: 'Advanced SQL Mastery', description: 'Master complex queries including window functions, CTEs, subqueries, and query optimization techniques.', resources: ['SQLZoo Interactive', 'Mode Analytics SQL Tutorial', 'LeetCode SQL Problems'], hours: 12 },
      { week: 3, topic: 'Python for Data Analysis', description: 'Learn pandas, NumPy, and data manipulation techniques for efficient data processing and analysis.', resources: ['Python for Data Analysis (Book)', 'Kaggle Learn Python', 'DataCamp Free Tier'], hours: 14 },
      { week: 4, topic: 'Data Visualization & Storytelling', description: 'Create compelling visualizations and learn to tell stories with data using modern tools and techniques.', resources: ['Tableau Public Free', 'Storytelling with Data (Book)', 'Matplotlib/Seaborn Docs'], hours: 10 },
      { week: 5, topic: 'Statistical Methods & Hypothesis Testing', description: 'Apply statistical tests, understand p-values, confidence intervals, and experimental design principles.', resources: ['Statistics 110 (Harvard)', 'Think Stats (Free Book)', 'SciPy Documentation'], hours: 12 },
      { week: 6, topic: 'Business Intelligence & Dashboards', description: 'Build interactive dashboards and BI reports that drive business decisions using Power BI and Tableau.', resources: ['Microsoft Power BI Learning Path', 'Tableau Desktop Training', 'Dashboard Design Patterns'], hours: 10 },
      { week: 7, topic: 'A/B Testing & Experimentation', description: 'Design and analyze experiments, calculate sample sizes, and interpret results for product teams.', resources: ['Trustworthy Online Experiments (Book)', 'Google Optimize', 'Evan Miller A/B Calculator'], hours: 10 },
      { week: 8, topic: 'Data Cleaning & ETL Pipelines', description: 'Handle messy real-world data: cleaning, transformation, validation, and building reliable data pipelines.', resources: ['OpenRefine Tutorial', 'dbt Fundamentals', 'Great Expectations Docs'], hours: 12 },
      { week: 9, topic: 'Machine Learning Basics for Analysts', description: 'Understand ML concepts like regression, classification, and clustering to enhance analytical capabilities.', resources: ['Scikit-learn Tutorial', 'Andrew Ng ML Course (Coursera)', 'Kaggle Competitions'], hours: 14 },
      { week: 10, topic: 'Excel & Spreadsheet Mastery', description: 'Advanced spreadsheet techniques including pivot tables, VLOOKUP, array formulas, and VBA basics.', resources: ['ExcelJet Tutorials', 'Google Sheets Functions', 'Chandoo Excel Blog'], hours: 8 },
      { week: 11, topic: 'Portfolio Project: Full Analysis Case Study', description: 'Complete an end-to-end data analysis project: data collection, cleaning, analysis, visualization, and presentation.', resources: ['Kaggle Datasets', 'GitHub Portfolio Guide', 'Jupyter Notebook'], hours: 15 },
      { week: 12, topic: 'Interview Prep & Career Strategy', description: 'Prepare for data analyst interviews with SQL challenges, case studies, and portfolio presentation practice.', resources: ['StrataScratch SQL Practice', 'Glassdoor Interview Questions', 'Data Analyst Resume Guide'], hours: 12 },
    ],
  };

  // Default template for roles not specifically mapped
  const defaultWeeks = [
    { week: 1, topic: `${targetRole} Fundamentals`, description: `Build a solid foundation in core ${targetRole} concepts, methodologies, and industry best practices.`, resources: [`${targetRole} Beginner Course`, 'Industry Overview Guide', 'Professional Community Forums'], hours: 10 },
    { week: 2, topic: `Core Skills Deep Dive: ${(skillGaps && skillGaps[0]) || 'Technical Skills'}`, description: `Intensive focus on the most critical skill gap for your ${targetRole} transition.`, resources: ['Online Course Platform', 'Hands-on Tutorial', 'Practice Exercises'], hours: 12 },
    { week: 3, topic: `Core Skills Deep Dive: ${(skillGaps && skillGaps[1]) || 'Domain Knowledge'}`, description: 'Continue building essential skills with practical projects and real-world applications.', resources: ['Intermediate Course', 'Project-Based Learning', 'Mentor Sessions'], hours: 12 },
    { week: 4, topic: 'Industry Tools & Technologies', description: `Master the key tools and technologies used daily by ${targetRole} professionals.`, resources: ['Tool Documentation', 'YouTube Tutorials', 'Free Trial Accounts'], hours: 10 },
    { week: 5, topic: `Core Skills Deep Dive: ${(skillGaps && skillGaps[2]) || 'Advanced Techniques'}`, description: 'Address your third major skill gap with structured learning and practice exercises.', resources: ['Advanced Course', 'Case Studies', 'Peer Study Group'], hours: 12 },
    { week: 6, topic: 'Cross-Functional Collaboration', description: 'Learn to work effectively with adjacent teams and understand their workflows and needs.', resources: ['Communication Workshop', 'Team Dynamics Guide', 'Stakeholder Management Course'], hours: 8 },
    { week: 7, topic: 'Practical Application & Mini Projects', description: 'Apply learned skills to realistic scenarios and build small projects for your portfolio.', resources: ['Project Templates', 'Real-World Datasets', 'Portfolio Examples'], hours: 14 },
    { week: 8, topic: 'Advanced Techniques & Best Practices', description: `Explore advanced ${targetRole} techniques that separate good practitioners from great ones.`, resources: ['Advanced Workshop', 'Industry Conference Talks', 'Research Papers'], hours: 12 },
    { week: 9, topic: 'Professional Workflows & Processes', description: 'Understand end-to-end professional workflows, documentation standards, and quality practices.', resources: ['Process Documentation', 'Quality Assurance Guide', 'Workflow Templates'], hours: 10 },
    { week: 10, topic: 'Industry Trends & Emerging Technologies', description: `Stay current with the latest trends and emerging technologies affecting the ${targetRole} field.`, resources: ['Industry Reports', 'Conference Videos', 'Newsletter Subscriptions'], hours: 8 },
    { week: 11, topic: 'Capstone Portfolio Project', description: `Build a comprehensive portfolio project that demonstrates your readiness for a ${targetRole} position.`, resources: ['Project Brief Template', 'GitHub Portfolio Guide', 'Peer Review Platform'], hours: 16 },
    { week: 12, topic: 'Interview Preparation & Job Search', description: 'Prepare for interviews, optimize your resume, practice case studies, and build your professional network.', resources: ['Interview Question Bank', 'Resume Templates', 'LinkedIn Optimization Guide'], hours: 12 },
  ];

  const weeks = weekTemplates[targetRole] || defaultWeeks;

  return {
    title: `12-Week ${targetRole} Career Transition Roadmap`,
    description: `A structured learning path designed to help you transition into a ${targetRole} role. Each week builds on the previous, combining theory with practical application to ensure job-readiness.`,
    weeks,
  };
}

function mockJobListings(userSkills, targetRole) {
  const skillNames = (userSkills || []).map(s => s.name || s.skill_name);

  const allJobs = [
    // Product Manager roles
    { id: 'pm-1', title: 'Associate Product Manager', company: 'TechFlow Inc.', location: 'San Francisco, CA (Hybrid)', salary_min: 110000, salary_max: 140000, type: 'Full-time', experience: '2-4 years', role_category: 'Product Manager', required_skills: ['Product Roadmapping', 'Data Analysis', 'Communication', 'Agile/Scrum', 'User Research'], posted_days_ago: 2, description: 'Join our growing team to drive product strategy for our SaaS platform. Work with cross-functional teams to deliver features that delight users.' },
    { id: 'pm-2', title: 'Senior Product Manager', company: 'DataBridge AI', location: 'New York, NY (Remote)', salary_min: 150000, salary_max: 185000, type: 'Full-time', experience: '5-8 years', role_category: 'Product Manager', required_skills: ['Strategic Planning', 'Leadership', 'Data Analysis', 'Stakeholder Management', 'Market Analysis'], posted_days_ago: 5, description: 'Lead product vision and strategy for our AI-powered analytics suite. Drive cross-team alignment and deliver world-class data products.' },
    { id: 'pm-3', title: 'Product Manager - Growth', company: 'Nextera Health', location: 'Austin, TX (Hybrid)', salary_min: 125000, salary_max: 155000, type: 'Full-time', experience: '3-5 years', role_category: 'Product Manager', required_skills: ['A/B Testing', 'Data Analysis', 'Communication', 'SEO/SEM', 'Strategic Planning'], posted_days_ago: 1, description: 'Own growth product initiatives, experiment with user acquisition funnels, and optimize conversion across our health-tech platform.' },

    // Data Analyst roles
    { id: 'da-1', title: 'Data Analyst', company: 'Meridian Financial', location: 'Chicago, IL (On-site)', salary_min: 85000, salary_max: 105000, type: 'Full-time', experience: '1-3 years', role_category: 'Data Analyst', required_skills: ['SQL & Databases', 'Data Analysis', 'Python Programming', 'Presentation Skills', 'Critical Thinking'], posted_days_ago: 3, description: 'Analyze financial datasets to uncover trends, build dashboards, and present insights to senior leadership.' },
    { id: 'da-2', title: 'Senior Data Analyst', company: 'CloudPeak Systems', location: 'Seattle, WA (Remote)', salary_min: 115000, salary_max: 140000, type: 'Full-time', experience: '4-6 years', role_category: 'Data Analyst', required_skills: ['SQL & Databases', 'Python Programming', 'Machine Learning', 'Data Analysis', 'A/B Testing'], posted_days_ago: 7, description: 'Drive data-informed decision-making across the organization. Build predictive models and lead analytics projects end-to-end.' },
    { id: 'da-3', title: 'Business Intelligence Analyst', company: 'RetailEdge Co.', location: 'Denver, CO (Hybrid)', salary_min: 90000, salary_max: 115000, type: 'Full-time', experience: '2-4 years', role_category: 'Data Analyst', required_skills: ['SQL & Databases', 'Data Analysis', 'Presentation Skills', 'Problem Solving', 'Financial Analysis'], posted_days_ago: 4, description: 'Create and maintain BI dashboards, analyze retail performance metrics, and provide actionable recommendations to stakeholders.' },

    // UX Designer roles
    { id: 'ux-1', title: 'UX Designer', company: 'PixelCraft Studio', location: 'Los Angeles, CA (Hybrid)', salary_min: 95000, salary_max: 120000, type: 'Full-time', experience: '2-4 years', role_category: 'UX Designer', required_skills: ['User Research', 'Visual Design', 'Figma / Design Tools', 'Communication', 'Problem Solving'], posted_days_ago: 6, description: 'Design intuitive user experiences for our creative collaboration platform. Conduct user research and iterate on designs based on feedback.' },
    { id: 'ux-2', title: 'Senior UX/UI Designer', company: 'HealthFirst Digital', location: 'Boston, MA (Remote)', salary_min: 120000, salary_max: 150000, type: 'Full-time', experience: '5-7 years', role_category: 'UX Designer', required_skills: ['User Research', 'Visual Design', 'Figma / Design Tools', 'A/B Testing', 'Leadership'], posted_days_ago: 3, description: 'Lead design for our patient-facing health platform. Mentor junior designers and establish design system standards.' },

    // Software Developer roles
    { id: 'sd-1', title: 'Full-Stack Developer', company: 'BuildStack Technologies', location: 'Remote (US)', salary_min: 120000, salary_max: 155000, type: 'Full-time', experience: '3-5 years', role_category: 'Software Developer', required_skills: ['JavaScript', 'Python Programming', 'SQL & Databases', 'API Development', 'Cloud Computing (AWS/GCP)'], posted_days_ago: 1, description: 'Build and scale our developer tools platform. Work across the stack with React, Node.js, and PostgreSQL.' },
    { id: 'sd-2', title: 'Backend Engineer', company: 'PayStream Inc.', location: 'New York, NY (Hybrid)', salary_min: 140000, salary_max: 175000, type: 'Full-time', experience: '4-7 years', role_category: 'Software Developer', required_skills: ['Python Programming', 'SQL & Databases', 'API Development', 'Cloud Computing (AWS/GCP)', 'Problem Solving'], posted_days_ago: 8, description: 'Design and build scalable backend services for our payment processing infrastructure. Focus on reliability and performance.' },

    // Marketing Manager roles
    { id: 'mm-1', title: 'Digital Marketing Manager', company: 'GrowthLab Agency', location: 'Miami, FL (Hybrid)', salary_min: 100000, salary_max: 130000, type: 'Full-time', experience: '4-6 years', role_category: 'Marketing Manager', required_skills: ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Data Analysis', 'A/B Testing'], posted_days_ago: 2, description: 'Lead multi-channel marketing campaigns for Fortune 500 clients. Analyze performance data and optimize for maximum ROI.' },
    { id: 'mm-2', title: 'Marketing Director', company: 'Evergreen Brands', location: 'Portland, OR (On-site)', salary_min: 135000, salary_max: 165000, type: 'Full-time', experience: '7-10 years', role_category: 'Marketing Manager', required_skills: ['Strategic Planning', 'Leadership', 'Digital Marketing', 'Communication', 'Content Strategy'], posted_days_ago: 10, description: 'Set the strategic direction for brand marketing across all channels. Build and lead a team of marketing professionals.' },

    // DevOps Engineer roles
    { id: 'de-1', title: 'DevOps Engineer', company: 'InfraScale Solutions', location: 'Remote (US)', salary_min: 125000, salary_max: 160000, type: 'Full-time', experience: '3-5 years', role_category: 'DevOps Engineer', required_skills: ['Cloud Computing (AWS/GCP)', 'Python Programming', 'API Development', 'Problem Solving', 'Agile/Scrum'], posted_days_ago: 4, description: 'Build and maintain CI/CD pipelines, manage cloud infrastructure, and improve developer experience across the engineering org.' },

    // Business Analyst roles
    { id: 'ba-1', title: 'Business Analyst', company: 'ConsultPro Group', location: 'Washington, DC (Hybrid)', salary_min: 80000, salary_max: 105000, type: 'Full-time', experience: '2-4 years', role_category: 'Business Analyst', required_skills: ['Data Analysis', 'Communication', 'Problem Solving', 'SQL & Databases', 'Presentation Skills'], posted_days_ago: 5, description: 'Gather and document business requirements, facilitate stakeholder workshops, and drive process improvement initiatives.' },
    { id: 'ba-2', title: 'Senior Business Analyst', company: 'Vanguard Consulting', location: 'Atlanta, GA (Remote)', salary_min: 100000, salary_max: 130000, type: 'Full-time', experience: '5-8 years', role_category: 'Business Analyst', required_skills: ['Stakeholder Management', 'Data Analysis', 'Critical Thinking', 'Communication', 'Strategic Planning'], posted_days_ago: 6, description: 'Lead complex business analysis engagements, define solution architectures, and mentor junior analysts.' },
  ];

  // Filter by target role if provided, otherwise show all
  let jobs = targetRole
    ? allJobs.filter(j => j.role_category.toLowerCase() === targetRole.toLowerCase())
    : allJobs;

  // If no exact match, show all
  if (jobs.length === 0) jobs = allJobs;

  // Calculate match score based on user skills
  jobs = jobs.map(job => {
    const matching = job.required_skills.filter(s => skillNames.includes(s));
    const match_score = job.required_skills.length > 0
      ? Math.round((matching.length / job.required_skills.length) * 100)
      : 30;
    const missing_skills = job.required_skills.filter(s => !skillNames.includes(s));
    return { ...job, match_score, matching_skills: matching, missing_skills };
  });

  return jobs.sort((a, b) => b.match_score - a.match_score);
}

const RESOURCES = {
  pre_landing: [
    {
      id: 'resume',
      category: 'Resume & Portfolio',
      title: 'Resume Optimization',
      description: 'Tailor your resume to highlight transferable skills for your target role.',
      items: [
        { title: 'Action Verb Cheat Sheet', type: 'guide', url: '#' },
        { title: 'Resume Template for Career Changers', type: 'template', url: '#' },
        { title: 'Portfolio Building Guide', type: 'guide', url: '#' },
        { title: 'LinkedIn Profile Optimization', type: 'checklist', url: '#' },
      ],
    },
    {
      id: 'interview',
      category: 'Interview Prep',
      title: 'Interview Preparation',
      description: 'Practice common questions and build confidence for your target role interviews.',
      items: [
        { title: 'STAR Method Response Framework', type: 'guide', url: '#' },
        { title: 'Behavioral Interview Questions Bank', type: 'practice', url: '#' },
        { title: 'Technical Interview Prep Checklist', type: 'checklist', url: '#' },
        { title: 'Salary Negotiation Scripts', type: 'template', url: '#' },
      ],
    },
    {
      id: 'networking',
      category: 'Networking',
      title: 'Building Your Network',
      description: 'Connect with professionals in your target field to accelerate your transition.',
      items: [
        { title: 'Cold Outreach Message Templates', type: 'template', url: '#' },
        { title: 'Informational Interview Guide', type: 'guide', url: '#' },
        { title: 'Industry Event Finder', type: 'tool', url: '#' },
        { title: 'Professional Community Directory', type: 'directory', url: '#' },
      ],
    },
  ],
  post_landing: [
    {
      id: 'onboarding',
      category: 'First 90 Days',
      title: 'Onboarding Success',
      description: 'Make a strong start in your new role with a structured 30-60-90 day plan.',
      items: [
        { title: '30-60-90 Day Plan Template', type: 'template', url: '#' },
        { title: 'Questions to Ask Your Manager', type: 'checklist', url: '#' },
        { title: 'Building Credibility in a New Role', type: 'guide', url: '#' },
        { title: 'New Role Transition Journal', type: 'template', url: '#' },
      ],
    },
    {
      id: 'growth',
      category: 'Career Growth',
      title: 'Continued Development',
      description: 'Keep growing in your new career with ongoing learning and mentorship.',
      items: [
        { title: 'Skill Gap Tracker Spreadsheet', type: 'template', url: '#' },
        { title: 'Finding a Mentor Guide', type: 'guide', url: '#' },
        { title: 'Conference & Workshop Calendar', type: 'directory', url: '#' },
        { title: 'Professional Certification Roadmap', type: 'guide', url: '#' },
      ],
    },
    {
      id: 'community',
      category: 'Community & Support',
      title: 'Stay Connected',
      description: 'Join communities of fellow career changers for ongoing support and advice.',
      items: [
        { title: 'Career Changers Slack Communities', type: 'directory', url: '#' },
        { title: 'Industry-Specific Subreddits', type: 'directory', url: '#' },
        { title: 'Peer Mentoring Program', type: 'program', url: '#' },
        { title: 'Success Stories & Case Studies', type: 'inspiration', url: '#' },
      ],
    },
  ],
};

function isMockMode() {
  return !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '' || process.env.OPENAI_API_KEY === 'optional_key_here';
}

module.exports = {
  OCCUPATIONS,
  SKILLS_DATABASE,
  mockExtractSkills,
  mockCareerPaths,
  mockGenerateRoadmap,
  mockJobListings,
  RESOURCES,
  isMockMode,
};
