const About = require('../models/About');

// @desc    Get about content
// @route   GET /api/about
// @access  Public
const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    // If no about document exists, create default one
    if (!about) {
      about = await About.create({
        heading: 'About Me',
        paragraph1:
          'I’m a designer focused on Website Design, Digital Product Design, and No-Code Development. I help individuals and businesses bring ideas to life through clean, modern, and functional design.',
        paragraph2:
          'With a strong eye for detail and a user-first mindset, I create websites and digital products that not only look great but also work seamlessly — combining aesthetic simplicity with exceptional performance.',
        image: 'https://framerusercontent.com/images/Lwf11bejG2ckx3QD9tlBaUP3kE.jpg',
        resumeText: 'View Resume',
        resumeLink: '#contact',
        resumeFile: '',
        resumeFileName: '',
        linkedinUrl: 'https://www.linkedin.com/in/mohammed-afsal-8a52b23aa',
        githubUrl: 'https://github.com/afsallll005-cloud',
        instagramUrl: 'https://www.instagram.com/web.tek_?stkn=MWwxZ3JuamVldHl2dQ==',
        facebookUrl: '',
        twitterUrl: '',
      });
    }

    res.json(about);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update about content
// @route   PUT /api/about
// @access  Public
const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = await About.create(req.body);
      return res.json(about);
    }

    if (req.body.heading !== undefined) about.heading = req.body.heading;
    if (req.body.paragraph1 !== undefined) about.paragraph1 = req.body.paragraph1;
    if (req.body.paragraph2 !== undefined) about.paragraph2 = req.body.paragraph2;
    if (req.body.image !== undefined) about.image = req.body.image;
    if (req.body.resumeText !== undefined) about.resumeText = req.body.resumeText;
    if (req.body.resumeLink !== undefined) about.resumeLink = req.body.resumeLink;
    if (req.body.resumeFile !== undefined) about.resumeFile = req.body.resumeFile;
    if (req.body.resumeFileName !== undefined) about.resumeFileName = req.body.resumeFileName;
    if (req.body.linkedinUrl !== undefined) about.linkedinUrl = req.body.linkedinUrl;
    if (req.body.githubUrl !== undefined) about.githubUrl = req.body.githubUrl;
    if (req.body.instagramUrl !== undefined) about.instagramUrl = req.body.instagramUrl;
    if (req.body.facebookUrl !== undefined) about.facebookUrl = req.body.facebookUrl;
    if (req.body.twitterUrl !== undefined) about.twitterUrl = req.body.twitterUrl;

    const updatedAbout = await about.save();
    res.json(updatedAbout);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getAbout,
  updateAbout,
};
