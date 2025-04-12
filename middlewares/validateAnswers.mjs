export const validateAnswers = (req, res, next) => {
    const { content } = req.body;
    if (!content || content.length > 300) {
        return res.status(400).json({ message: "Invalid request data." });
    }
    next();
};
