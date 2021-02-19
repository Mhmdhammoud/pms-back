import mongoose from 'mongoose';
import Project from '../../models/projectModel.js';

export default async (req, res) => {
  try {
    console.log(req.user);
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
