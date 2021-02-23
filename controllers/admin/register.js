import { Admin } from '../../models/index.js';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  try {
    const { email, password, fullName, phone, image } = req.body;
    if (isNaN(phone)) {
      return res.status(400).json({
        message: 'Phone Number should be a number',
        phone: phone,
        'expected format': 12345678,
      });
    }
    const checked = await Admin.findOne({
      $or: [
        {
          email: `${email}`,
        },
        {
          phone: `${phone}`,
        },
      ],
    });

    if (checked) {
      console.log(checked.fullName);
      return res.status(400).json({
        message:
          'User is already found in the DB, please choose a different email or phone number',
        email,
        phone,
      });
    } else {
      const NewAdmin = await Admin.create({
        fullName,
        password,
        phone,
        email,
      });
      if (NewAdmin) {
        const payload = {
          email: email,
          id: NewAdmin._id,
          fullName: NewAdmin.fullName,
          image: NewAdmin.image,
        };

        jwt.sign(
          payload,
          process.env.ADMIN_SECRET,
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
            console.log(`[i] Access Token generated for Admin : ${email}`);
            return res.status(200).json({
              message: 'User Created Successfully',
              email,
              fullName,
              phone,
              image: NewAdmin.image,
              id: NewAdmin._id,
              token: encoded,
            });
          }
        );
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
