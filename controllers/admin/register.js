import Admin from '../../models/adminModel.js';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export default async (req, res) => {
  try {
    const { email, password, full_name, phone, image } = req.body;
    const checked = await Admin.findOne({ email });
    if (checked) {
      console.log(checked.full_name);
      return res.status(400).json({
        message: 'User is already found in the DB',
        email,
      });
    } else {
      const NewAdmin = await Admin.create({
        full_name,
        password,
        phone,
        email,
      });
      if (NewAdmin) {
        return res.status(200).json({
          message: 'User Created Successfully',
          email,
          full_name,
          phone,
          image: NewAdmin.image,
          id: NewAdmin._id,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
