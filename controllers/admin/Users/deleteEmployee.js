import { Employee } from '../../../models/index.js';
import mongoose from 'mongoose';
export default async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        status: 'Failure',
        message: 'Bad request, expected employee ID recieved null',
      });
    } else if (id != mongoose.Types.ObjectId(id)) {
      return res.status(400).json({
        status: 'Failure',
        message: 'Bad request, wrong employee id format',
      });
    }
    const EMPLOYEE = await Employee.findById(id);
    if (!EMPLOYEE) {
      return res.status(404).json({
        status: 'Failure',
        message: 'Employee was not found. 😢',
        employeeID: id,
        employee: null,
        requestTime: req.requestedAt,
      });
    }
    const DELETED_EMPLOYEE = await Employee.deleteOne({ _id: id });
    if (!DELETED_EMPLOYEE) {
      throw new Error('Something went wrong 😢');
    }
    return res.status(200).json({
      status: 'Success',
      message: 'Employee was deleted successfully 😍',
      employee: null,
      employeeID: id,
      requestTime: req.requestedAt,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
      requestTime: req.requestedAt,
    });
  }
};
