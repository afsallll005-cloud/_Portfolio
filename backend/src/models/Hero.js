const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema(
  {
    backgroundText: {
      type: String,
      default: 'DEVELOPER',
    },
    title: {
      type: String,
      default: 'MHDAFSAL',
    },
    subtitle: {
      type: String,
      default: 'I’m Specialized in Creating Website Design.',
    },
    image: {
      type: String,
      default: './images/glitchme.jpeg',
    },
    stat1Value: {
      type: String,
      default: '98%',
    },
    stat1Label: {
      type: String,
      default: 'CLIENT SATISFACTION RATE',
    },
    stat2Value: {
      type: String,
      default: '20+',
    },
    stat2Label: {
      type: String,
      default: 'PROJECTS COMPLETED',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Hero', heroSchema);
