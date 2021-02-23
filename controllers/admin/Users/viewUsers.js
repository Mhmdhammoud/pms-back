import { Employee, Manager } from '../../../models/index.js';

export default async (req, res) => {
  try {
    const { type } = req.query;
    if (!type) {
      return res.status(400).json({
        status: 'Failure',
        mesage: 'Bad request, expected user type',
        requestTime: req.requestedAt,
      });
    }
    switch (type) {
      case 'Employee':
        const ALL_EMPLOYEES = await Employee.find({}).select('-__v');
        return res.status(200).json({
          status: 'Success',
          message: 'All Employees were fetched successfully.😍',
          length: ALL_EMPLOYEES.length,
          requestTime: req.requestedAt,
          employees: ALL_EMPLOYEES,
        });
      case 'Manager':
        const ALL_MANAGERS = await Manager.find({}).select('-__v');
        return res.status(200).json({
          status: 'Success',
          message: 'All Managers were fetched successfully.😍',
          length: ALL_MANAGERS.length,
          requestTime: req.requestedAt,
          managers: ALL_MANAGERS,
        });
      default:
        return res.status(400).json({
          status: 'Failure',
          message: 'Bad request, user type was not recognized.😢',
          requestTime: req.requestedAt,
          type: type,
          typesAllowed: 'Employee || Manager',
        });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
      requestTime: req.requestedAt,
    });
  }
};
