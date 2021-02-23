import { Project } from '../../../models/index.js';
import mongoose from 'mongoose';
export default async (req, res) => {
  try {
    const { id: PROJECT_ID, employeeID: EMPLOYEE_ID } = req.query;
    if (!EMPLOYEE_ID || EMPLOYEE_ID === '') {
      return res.status(400).json({
        status: 'Failure',
        message: 'Bad Request, expected employee ID',
        requestTime: req.requestedAt,
      });
    } else if (EMPLOYEE_ID != mongoose.Types.ObjectId(EMPLOYEE_ID)) {
      return res.status(400).json({
        status: 'Failure',
        message: 'Bad request, wrong employee id format',
      });
    }
    await Project.findByIdAndUpdate(PROJECT_ID, {
      $push: {
        projectEmployees: {
          employeeID: EMPLOYEE_ID,
        },
      },
    });
    const UpdatedProject = await Project.findById(PROJECT_ID)
      .select('-__v -updatedAt -createdAt')
      .populate('projectManager', 'fullName email image')
      .populate('projectEmployees.employeeID', 'fullName email image')
      .populate('tasks.employeeID', 'fullName image email');
    return res.status(200).json({
      status: 'Success',
      message: 'Employee was added successfully',
      employeeID: EMPLOYEE_ID,
      project: UpdatedProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
      requestTime: req.requestedAt,
    });
  }
};
