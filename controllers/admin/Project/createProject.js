import { Project } from '../../../models/index.js';

export default async (req, res) => {
  const { type } = req.user;
  if (!type === 'Admin') {
    return res.status(401).json({
      status: 'Failed',
      message: 'This route is only accepted to a certain clearance level',
    });
  }
  try {
    const {
      title,
      duration,
      startingDate,
      projectManager,
      projectEmployees,
      description,
    } = req.body;
    const NewProject = await Project.create({
      title,
      duration,
      startingDate,
      projectManager,
      projectEmployees,
      description,
    });
    if (NewProject) {
      return res.status(200).json({
        status: 'Success',
        message: 'Project was created succsessully',
        requestTime: req.requestedAt,
        project: NewProject,
      });
    }
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
