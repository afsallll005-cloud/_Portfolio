const Hero = require('../models/Hero');

// @desc    Get hero content
// @route   GET /api/hero
// @access  Public
const getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();

    // If no hero document exists, create default one
    if (!hero) {
      hero = await Hero.create({
        backgroundText: 'DEVELOPER',
        title: 'MHDAFSAL',
        subtitle: 'I’m Specialized in Creating Website Design.',
        desktopImage: './images/glitchme.jpeg',
        mobileImage: './images/glitchme.jpeg',
        image: './images/glitchme.jpeg',
        stat1Value: '98%',
        stat1Label: 'CLIENT SATISFACTION RATE',
        stat2Value: '20+',
        stat2Label: 'PROJECTS COMPLETED',
      });
    }

    const heroObj = hero.toObject ? hero.toObject() : { ...hero };
    if (!heroObj.desktopImage && heroObj.image) {
      heroObj.desktopImage = heroObj.image;
    }
    if (!heroObj.mobileImage && heroObj.image) {
      heroObj.mobileImage = heroObj.image;
    }

    res.json(heroObj);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update hero content
// @route   PUT /api/hero
// @access  Public
const updateHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();

    if (!hero) {
      hero = await Hero.create(req.body);
      return res.json(hero);
    }

    hero.backgroundText = req.body.backgroundText !== undefined ? req.body.backgroundText : hero.backgroundText;
    hero.title = req.body.title !== undefined ? req.body.title : hero.title;
    hero.subtitle = req.body.subtitle !== undefined ? req.body.subtitle : hero.subtitle;

    // Laptop / Desktop Image
    if (req.body.desktopImage !== undefined) {
      hero.desktopImage = req.body.desktopImage;
      hero.image = req.body.desktopImage; // maintain compatibility
    } else if (req.body.image !== undefined) {
      hero.desktopImage = req.body.image;
      hero.image = req.body.image;
    }

    // Mobile Image
    if (req.body.mobileImage !== undefined) {
      hero.mobileImage = req.body.mobileImage;
    } else if (!hero.mobileImage && (req.body.desktopImage || req.body.image)) {
      hero.mobileImage = req.body.desktopImage || req.body.image;
    }

    hero.searchPhrase = req.body.searchPhrase !== undefined ? req.body.searchPhrase : hero.searchPhrase;
    hero.stat1Value = req.body.stat1Value !== undefined ? req.body.stat1Value : hero.stat1Value;
    hero.stat1Label = req.body.stat1Label !== undefined ? req.body.stat1Label : hero.stat1Label;
    hero.stat2Value = req.body.stat2Value !== undefined ? req.body.stat2Value : hero.stat2Value;
    hero.stat2Label = req.body.stat2Label !== undefined ? req.body.stat2Label : hero.stat2Label;

    const updatedHero = await hero.save();
    res.json(updatedHero);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getHero,
  updateHero,
};
