const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String, // e.g., 'E-commerce Platform', 'Personal Portfolio'
      required: true,
    },
    tags: {
      type: [String], // e.g., ['React', 'Node.js', 'MongoDB']
      required: true,
    },
    year: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    numberId: {
      type: String, // e.g., '01', '02'
      required: true,
    },
    isFeatured: {
      type: Boolean, // To distinguish between main 'Projects' and 'More Works'
      default: false,
    },
    link: {
      type: String, // Optional URL to the live project or github
    },
    description: {
      type: String, // Project details / modal description
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
