import mongoose from 'mongoose';
import Project from '../../models/projectModel.js';

export default async (req, res) => {
  try {
    const {
      title,
      duration,
      startingDate,
      projectManager,
      projectEmployees,
    } = req.body;

    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
