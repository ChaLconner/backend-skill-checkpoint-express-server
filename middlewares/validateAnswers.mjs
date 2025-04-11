export const validateAnswers = (req, res, next) => {
  const { answer } = req.body;
  if (answer && answer.length <= 300) {
    return res.status(400).json({ message: "Invalid request data." });
  }
  next();
};
