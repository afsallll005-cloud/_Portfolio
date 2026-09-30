const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: 'About Me',
    },
    paragraph1: {
      type: String,
      default:
        'I’m a designer focused on Website Design, Digital Product Design, and No-Code Development. I help individuals and businesses bring ideas to life through clean, modern, and functional design.',
    },
    paragraph2: {
      type: String,
      default:
        'With a strong eye for detail and a user-first mindset, I create websites and digital products that not only look great but also work seamlessly — combining aesthetic simplicity with exceptional performance.',
    },
    image: {
      type: String,
      default: 'https://framerusercontent.com/images/Lwf11bejG2ckx3QD9tlBaUP3kE.jpg',
    },
    resumeText: {
      type: String,
      default: 'View Resume',
    },
    resumeLink: {
      type: String,
      default: '#contact',
    },
    resumeFile: {
      type: String,
      default: '',
    },
    resumeFileName: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      default: 'https://www.linkedin.com/in/mohammed-afsal-8a52b23aa',
    },
    githubUrl: {
      type: String,
      default: 'https://github.com/afsallll005-cloud',
    },
    instagramUrl: {
      type: String,
      default: 'https://www.instagram.com/web.tek_?stkn=MWwxZ3JuamVldHl2dQ==',
    },
    facebookUrl: {
      type: String,
      default: '',
    },
    twitterUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('About', aboutSchema);
