try { require('dotenv').config(); } catch (e) { /* optional */ }
const bcrypt = require('bcryptjs');
const { ready, getDb } = require('./db');

async function seed() {
  const db = await ready;

  console.log('Seeding CareerLoom AI database...\n');

  // Clear existing data
  db.exec('DELETE FROM session_logs');
  db.exec('DELETE FROM learning_roadmaps');
  db.exec('DELETE FROM career_paths');
  db.exec('DELETE FROM skill_profiles');
  db.exec('DELETE FROM users');

  // Create demo users
  const hashedPassword = bcrypt.hashSync('demo1234', 12);

  const users = [
    { name: 'Sarah Chen', email: 'sarah@demo.com', password: hashedPassword, current_role: 'Marketing Manager', years_experience: 8 },
    { name: 'James Rodriguez', email: 'james@demo.com', password: hashedPassword, current_role: 'Financial Analyst', years_experience: 12 },
    { name: 'Emily Watson', email: 'emily@demo.com', password: hashedPassword, current_role: 'Project Manager', years_experience: 6 },
  ];

  const userIds = [];
  for (const u of users) {
    const result = db.prepare(
      'INSERT INTO users (name, email, password, current_role, years_experience) VALUES (?, ?, ?, ?, ?)'
    ).run(u.name, u.email, u.password, u.current_role, u.years_experience);
    userIds.push(result.lastInsertRowid);
    console.log(`  Created user: ${u.name} (${u.email})`);
  }

  // Seed skills for user 1 (Sarah - Marketing Manager)
  const sarahSkills = [
    { name: 'Digital Marketing', category: 'Marketing', proficiency: 90, onet_code: '2.B.5.a' },
    { name: 'SEO/SEM', category: 'Marketing', proficiency: 85, onet_code: '2.B.5.b' },
    { name: 'Content Strategy', category: 'Marketing', proficiency: 82, onet_code: '2.B.5.c' },
    { name: 'Data Analysis', category: 'Analytical', proficiency: 70, onet_code: '2.A.1.e' },
    { name: 'Communication', category: 'Interpersonal', proficiency: 88, onet_code: '2.A.1.a' },
    { name: 'Leadership', category: 'Management', proficiency: 78, onet_code: '2.B.1.c' },
    { name: 'Project Management', category: 'Management', proficiency: 75, onet_code: '2.B.1.a' },
    { name: 'A/B Testing', category: 'Analytical', proficiency: 72, onet_code: '2.A.1.h' },
    { name: 'Presentation Skills', category: 'Interpersonal', proficiency: 85, onet_code: '2.A.1.b' },
    { name: 'Strategic Planning', category: 'Management', proficiency: 76, onet_code: '2.B.1.b' },
  ];

  const jamesSkills = [
    { name: 'Financial Analysis', category: 'Analytical', proficiency: 92, onet_code: '2.A.1.g' },
    { name: 'Data Analysis', category: 'Analytical', proficiency: 88, onet_code: '2.A.1.e' },
    { name: 'SQL & Databases', category: 'Technical', proficiency: 75, onet_code: '2.B.3.c' },
    { name: 'Python Programming', category: 'Technical', proficiency: 60, onet_code: '2.B.3.a' },
    { name: 'Presentation Skills', category: 'Interpersonal', proficiency: 80, onet_code: '2.A.1.b' },
    { name: 'Critical Thinking', category: 'Analytical', proficiency: 85, onet_code: '2.A.2.b' },
    { name: 'Problem Solving', category: 'Analytical', proficiency: 82, onet_code: '2.A.2.a' },
    { name: 'Negotiation', category: 'Interpersonal', proficiency: 70, onet_code: '2.A.1.c' },
  ];

  const emilySkills = [
    { name: 'Project Management', category: 'Management', proficiency: 90, onet_code: '2.B.1.a' },
    { name: 'Agile/Scrum', category: 'Management', proficiency: 88, onet_code: '2.B.1.d' },
    { name: 'Stakeholder Management', category: 'Management', proficiency: 82, onet_code: '2.B.1.e' },
    { name: 'Communication', category: 'Interpersonal', proficiency: 85, onet_code: '2.A.1.a' },
    { name: 'Leadership', category: 'Management', proficiency: 80, onet_code: '2.B.1.c' },
    { name: 'Problem Solving', category: 'Analytical', proficiency: 78, onet_code: '2.A.2.a' },
    { name: 'Data Analysis', category: 'Analytical', proficiency: 55, onet_code: '2.A.1.e' },
    { name: 'Strategic Planning', category: 'Management', proficiency: 72, onet_code: '2.B.1.b' },
    { name: 'Presentation Skills', category: 'Interpersonal', proficiency: 78, onet_code: '2.A.1.b' },
  ];

  const allSkillSets = [
    { userId: userIds[0], skills: sarahSkills },
    { userId: userIds[1], skills: jamesSkills },
    { userId: userIds[2], skills: emilySkills },
  ];

  for (const { userId, skills } of allSkillSets) {
    for (const s of skills) {
      db.prepare(
        'INSERT INTO skill_profiles (user_id, skill_name, category, proficiency, onet_code) VALUES (?, ?, ?, ?, ?)'
      ).run(userId, s.name, s.category, s.proficiency, s.onet_code);
    }
  }
  console.log(`  Seeded ${sarahSkills.length + jamesSkills.length + emilySkills.length} skills across 3 users`);

  // Seed career paths
  const careerPaths = [
    { user_id: userIds[0], source_role: 'Marketing Manager', target_role: 'Product Manager', skill_overlap: 68, feasibility_score: 82, median_salary: 145000, growth_rate: 12, market_demand: 'High', skill_gaps: ['Product Roadmapping', 'User Story Writing', 'Market Analysis'], transition_time_months: 4 },
    { user_id: userIds[0], source_role: 'Marketing Manager', target_role: 'Data Analyst', skill_overlap: 42, feasibility_score: 58, median_salary: 100000, growth_rate: 35, market_demand: 'Very High', skill_gaps: ['Advanced SQL', 'Tableau/Power BI', 'Statistical Modeling'], transition_time_months: 6 },
    { user_id: userIds[0], source_role: 'Marketing Manager', target_role: 'UX Designer', skill_overlap: 52, feasibility_score: 65, median_salary: 110000, growth_rate: 16, market_demand: 'High', skill_gaps: ['Wireframing', 'Usability Testing', 'Interaction Design'], transition_time_months: 5 },
    { user_id: userIds[1], source_role: 'Financial Analyst', target_role: 'Data Analyst', skill_overlap: 75, feasibility_score: 88, median_salary: 100000, growth_rate: 35, market_demand: 'Very High', skill_gaps: ['Tableau/Power BI', 'Python for Data Science', 'Machine Learning Basics'], transition_time_months: 3 },
    { user_id: userIds[1], source_role: 'Financial Analyst', target_role: 'Product Manager', skill_overlap: 45, feasibility_score: 62, median_salary: 145000, growth_rate: 12, market_demand: 'High', skill_gaps: ['Product Strategy', 'Agile Methodology', 'User Research'], transition_time_months: 6 },
    { user_id: userIds[2], source_role: 'Project Manager', target_role: 'Product Manager', skill_overlap: 72, feasibility_score: 85, median_salary: 145000, growth_rate: 12, market_demand: 'High', skill_gaps: ['Product Roadmapping', 'Market Analysis', 'User Story Writing'], transition_time_months: 3 },
  ];

  for (const p of careerPaths) {
    db.prepare(
      `INSERT INTO career_paths (user_id, source_role, target_role, skill_overlap, feasibility_score, median_salary, growth_rate, market_demand, skill_gaps, transition_time_months) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(p.user_id, p.source_role, p.target_role, p.skill_overlap, p.feasibility_score, p.median_salary, p.growth_rate, p.market_demand, JSON.stringify(p.skill_gaps), p.transition_time_months);
  }
  console.log(`  Seeded ${careerPaths.length} career paths`);

  // Seed session logs
  const logEntries = [
    [userIds[0], 'register', 'Account created'],
    [userIds[0], 'skill_assessment', 'Extracted 10 skills'],
    [userIds[0], 'career_explore', 'Generated 3 career paths'],
    [userIds[1], 'register', 'Account created'],
    [userIds[1], 'skill_assessment', 'Extracted 8 skills'],
    [userIds[2], 'register', 'Account created'],
  ];
  for (const [uid, action, details] of logEntries) {
    db.prepare('INSERT INTO session_logs (user_id, action, details) VALUES (?, ?, ?)').run(uid, action, details);
  }
  console.log(`  Seeded 6 session logs`);

  console.log('\nDatabase seeded successfully!');
  console.log('\nDemo accounts:');
  console.log('  sarah@demo.com / demo1234 (Marketing Manager)');
  console.log('  james@demo.com / demo1234 (Financial Analyst)');
  console.log('  emily@demo.com / demo1234 (Project Manager)\n');

  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
