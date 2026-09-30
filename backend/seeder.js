const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const Project = require('./src/models/Project');
const Skill = require('./src/models/Skill');
const Contact = require('./src/models/Contact');
const Hero = require('./src/models/Hero');
const projects = require('./src/data/projects');

dotenv.config();

connectDB();

const skillsData = [
  { name: 'React / Next.js', category: 'Frontend', level: 95 },
  { name: 'UI/UX & Figma', category: 'Design', level: 90 },
  { name: 'JavaScript / TypeScript', category: 'Frontend', level: 92 },
  { name: 'Node.js & Express', category: 'Backend', level: 85 },
  { name: 'MongoDB', category: 'Database', level: 80 },
  { name: 'Framer & Animations', category: 'Design', level: 88 },
];

const importData = async () => {
  try {
    // Clear existing data
    await Project.deleteMany();
    await Skill.deleteMany();
    await Contact.deleteMany();
    await Hero.deleteMany();

    // Import projects (if any)
    if (projects && projects.length > 0) {
      await Project.insertMany(projects);
    }
    await Skill.insertMany(skillsData);
    await Hero.create({
      backgroundText: 'DEVELOPER',
      title: 'MHDAFSAL',
      subtitle: 'I’m Specialized in Creating Website Design.',
      image: './images/glitchme.jpeg',
      stat1Value: '98%',
      stat1Label: 'CLIENT SATISFACTION RATE',
      stat2Value: '20+',
      stat2Label: 'PROJECTS COMPLETED',
    });

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Project.deleteMany();
    await Skill.deleteMany();
    await Contact.deleteMany();
    await Hero.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
