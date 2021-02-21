import Employee from '../../models/employee.js';
import jwt from 'jsonwebtoken';
export default async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'User was not found',
        email: email,
      });
    }
    const login = user.matchPassword(password);
    console.log(`User : ${user.fullName}`);
    console.log(`login Status => ${login}`);
    if (login === false) {
      return res.status(401).json({
        message: 'Wrong Credentials',
      });
    } else {
      const payload = {
        email: email,
        id: user._id,
        fullName: user.fullName,
        image: user.image,
      };

      jwt.sign(
        payload,
        process.env.EMPLOYEE_SECRET,
        {
          expiresIn: '1460h',
        },
        (error, encoded) => {
          if (error) {
            console.log(error);
            return res.status(500).json({
              message: 'Internal Server Error',
            });
          }
          console.log(`[i] Access Token generated for Employee : ${email}`);
          return res.status(200).json({
            status: 'success',
            id: user._id,
            token: encoded,
            image: user.image,
            fullName: user.fullName,
            email: email,
            type: 'Employee',
          });
        }
      );
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
