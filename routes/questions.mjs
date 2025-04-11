import { Router } from "express";
import { validateQuestions } from "../middlewares/validateQuestions.mjs";
import { validateAnswers } from "../middlewares/validateAnswers.mjs";

const questionsRouter = Router();

// POST /questions
questionsRouter.post("/", [validateQuestions], (req, res) => {
const { title, description, category } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: "Invalid request data." });
    }
    const newQuestion = { id: questionIdCounter++, title, description, category, vote: 0 };
    questions.push(newQuestion);
    res.status(201).json({ message: "Question created successfully." });
  });
  
  // GET /questions
  questionsRouter.get("/", (req, res) => {
    try {
      res.status(200).json({ data: questions });
    } catch {
      res.status(500).json({ message: "Unable to fetch questions." });
    }
  });
  
  // GET /questions/:questionId
  questionsRouter.get("/:questionId", (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.questionId));
    if (!question) return res.status(404).json({ message: "Question not found." });
    res.status(200).json({ data: question });
  });
  
  // PUT /questions/:questionId
  questionsRouter.put("/:questionId", (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.questionId));
    if (!question) return res.status(404).json({ message: "Question not found." });
  
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: "Invalid request data." });
    }
  
    question.title = title;
    question.description = description;
    question.category = category;
    res.status(200).json({ message: "Question updated successfully." });
  });
  
  // DELETE /questions/:questionId
  questionsRouter.delete("/:questionId", (req, res) => {
    const index = questions.findIndex(q => q.id === parseInt(req.params.questionId));
    if (index === -1) return res.status(404).json({ message: "Question not found." });
  
    questions.splice(index, 1);
    answers = answers.filter(a => a.questionId !== parseInt(req.params.questionId));
  
    res.status(200).json({ message: "Question and its answers have been deleted successfully." });
  });
  
  // GET /questions/search
  questionsRouter.get("/search", (req, res) => {
    const { title, category } = req.query;
    if (!title && !category) {
      return res.status(400).json({ message: "Invalid search parameters." });
    }
    try {
      const filtered = questions.filter(q =>
        (title && q.title.includes(title)) ||
        (category && q.category.includes(category))
      );
      res.status(200).json({ data: filtered });
    } catch {
      res.status(500).json({ message: "Unable to fetch a question." });
    }
  });
  
  // POST /questions/:questionId/answers
  questionsRouter.post("/:questionId/answers", [validateAnswers], (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Invalid request data." });
  
    const question = questions.find(q => q.id === parseInt(req.params.questionId));
    if (!question) return res.status(404).json({ message: "Question not found." });
  
    answers.push({ id: answerIdCounter++, questionId: question.id, content, vote: 0 });
    res.status(201).json({ message: "Answer created successfully." });
  });
  
  // GET /questions/:questionId/answers
  questionsRouter.get("/:questionId/answers", (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.questionId));
    if (!question) return res.status(404).json({ message: "Question not found." });
  
    const filteredAnswers = answers.filter(a => a.questionId === question.id);
    res.status(200).json({ data: filteredAnswers });
  });
  
  // DELETE /questions/:questionId/answers
  questionsRouter.delete("/:questionId/answers", (req, res) => {
    const question = questions.find(q => q.id === parseInt(req.params.questionId));
    if (!question) return res.status(404).json({ message: "Question not found." });
  
    answers = answers.filter(a => a.questionId !== question.id);
    res.status(200).json({ message: "All answers for the question have been deleted successfully." });
  });
  
  // POST /questions/:questionId/vote
  questionsRouter.post("/:questionId/vote", (req, res) => {
    const { vote } = req.body;
    if (![1, -1].includes(vote)) return res.status(400).json({ message: "Invalid vote value." });
  
    const question = questions.find(q => q.id === parseInt(req.params.questionId));
    if (!question) return res.status(404).json({ message: "Question not found." });
  
    question.vote += vote;
    res.status(200).json({ message: "Vote on the question has been recorded successfully." });
  });

  export default questionsRouter;