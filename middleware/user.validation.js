import { body, validationResult } from "express-validator";

export const createUserValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("age")
        .isInt({ min: 18, max: 100 })
        .withMessage("Age must be between 18 and 100"),

    body("phone")
        .isLength({ min: 10, max: 15 })
        .isNumeric()
        .withMessage("Phone must contain 10 to 15 digits"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),

    body("role")
        .isIn(["admin", "manager", "user"])
        .withMessage("Invalid role"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Validation failed",
                errors: errors.array()
            });
        }

        next();
    }
];