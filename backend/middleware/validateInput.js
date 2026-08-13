const { ZodError } = require('zod');

const validateInput = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        return res.status(500).json({ error: "Internal validation error", details: error.message });
    }
};

module.exports = validateInput;
