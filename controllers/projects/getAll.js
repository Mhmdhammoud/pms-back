import Project from '../../models/projectModel.js';

export default async (req, res) => {
  try {
    const AllProjects = await Project.find({})
      .populate('projectManager', 'fullName email image')
      .populate('projectEmployees.employeeID', 'fullName email image')
      .populate('tasks.employeeID', 'fullName image email');

    return res.status(200).json({
      status: 'Success',
      message: 'All Projects were fetched successfully',
      projects: AllProjects,
      length: AllProjects.length,
      requestTime: req.requestedAt,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
