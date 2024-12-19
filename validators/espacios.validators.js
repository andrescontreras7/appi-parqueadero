import { check, validationResult } from 'express-validator';

export const validarCamposEspacio = [
  check('numero')
    .notEmpty().withMessage('El número es obligatorio')
    .bail()
    .customSanitizer(value => value.toUpperCase()),
  check('estado').optional().notEmpty().withMessage('El estado es obligatorio'),
  check('tipo').optional().notEmpty().withMessage('El tipo es obligatorio'),
  check('id_vehiculoFK').optional().isNumeric().withMessage('El id_vehiculoFK debe ser un número'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];