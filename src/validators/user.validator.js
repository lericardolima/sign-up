const {body, validationResult} = require('express-validator');
const EMPTY_FIELD_ERROR_MSG = 'Field should not be empty.';
const EMAIL_FORMAT_ERROR_MSG = 'Should have a email format.';
const MIN_LENGTH_6_ERROR_MSG = 'Should have at least 6 characters.';

exports.userRegisterValidationRules = () => {
  return [
    body('name')
        .notEmpty().withMessage(EMPTY_FIELD_ERROR_MSG),

    body('email')
        .notEmpty().withMessage(EMPTY_FIELD_ERROR_MSG)
        .isEmail().withMessage(EMAIL_FORMAT_ERROR_MSG),

    body('password')
        .notEmpty().withMessage(EMPTY_FIELD_ERROR_MSG)
        .isLength({min: 6}).withMessage(MIN_LENGTH_6_ERROR_MSG),
  ];
};

exports.userLoginValidationRules = () => {
  return [
    body('email')
        .notEmpty().withMessage(EMPTY_FIELD_ERROR_MSG)
        .isEmail().withMessage(EMAIL_FORMAT_ERROR_MSG),

    body('password')
        .notEmpty().withMessage(EMPTY_FIELD_ERROR_MSG),
  ];
};

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => {
    extractedErrors.push({[err.param]: err.msg});
  });

  return res.status(422).json({
    errors: extractedErrors,
  });
};
