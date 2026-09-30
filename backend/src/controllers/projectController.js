const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: 1, _id: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Public (should be protected in production)
const createProject = async (req, res) => {
  try {
    const { title, type, tags, year, image, numberId, isFeatured, link, description } = req.body;

    const project = new Project({
      title,
      type,
      tags,
      year,
      image,
      numberId,
      isFeatured,
      link,
      description,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Public (should be protected in production)
const updateProject = async (req, res) => {
  try {
    const { title, type, tags, year, image, numberId, isFeatured, link, description } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = title || project.title;
      project.type = type || project.type;
      project.tags = tags || project.tags;
      project.year = year || project.year;
      project.image = image || project.image;
      project.numberId = numberId || project.numberId;
      project.isFeatured = isFeatured !== undefined ? isFeatured : project.isFeatured;
      project.link = link !== undefined ? link : project.link;
      project.description = description !== undefined ? description : project.description;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Public (should be protected in production)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
