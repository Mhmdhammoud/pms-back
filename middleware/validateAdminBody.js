import { check } from 'express-validator';

module.exports = [
  check('email', ' Your email is not valid ').not().isEmpty(),
  check('password').not().isEmpty().withMessage('Empty password'),
];
