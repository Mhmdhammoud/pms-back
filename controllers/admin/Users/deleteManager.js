import { Manager } from '../../../models/index.js';
import mongoose from 'mongoose';
export default async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        status: 'Failure',
        message: 'Bad request, expected manager ID recieved null',
      });
    } else if (id != mongoose.Types.ObjectId(id)) {
      return res.status(400).json({
        status: 'Failure',
        message: 'Bad request, wrong manager id format',
      });
    }
    const MANAGER = await Manager.findById(id);
    if (!MANAGER) {
      return res.status(404).json({
        status: 'Failure',
        message: 'Manager was not found 😢',
        manager: null,
        managerID: id,
        requestTime: req.requestedAt,
      });
    }
    const DELETED_MANAGER = await Manager.deleteOne({ _id: id });
    if (!DELETED_MANAGER) {
      throw new Error('Something went wrong 😢');
    }
    return res.status(200).json({
      status: 'Success',
      message: 'Manager was deleted successfully',
      manager: null,
      managerID: id,
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
