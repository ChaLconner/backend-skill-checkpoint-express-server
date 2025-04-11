import { Router } from "express";

const answersRouter = Router();

// POST /answers/:answerId/vote
answersRouter.post("/:answerId/vote", (req, res) => {
    const { vote } = req.body;
    if (![1, -1].includes(vote)) return res.status(400).json({ message: "Invalid vote value." });
  
    const answer = answers.find(a => a.id === parseInt(req.params.answerId));
    if (!answer) return res.status(404).json({ message: "Answer not found." });
  
    answer.vote += vote;
    res.status(200).json({ 
      message: "Vote on the answer has been recorded successfully.", 
      currentVote: answer.vote 
    });
  });

  export default answersRouter;