import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const answersRouter = Router();

// POST /answers/:answerId/vote
answersRouter.post("/:answerId/vote", async (req, res) => {
  try {
    const answerId = parseInt(req.params.answerId);    
    const vote = Number(req.body.vote);


    if (isNaN(answerId)) {
      return res.status(400).json({ message: "Invalid answerId. It must be a number." });
    }

    if (vote !== 1 && vote !== -1) {
      return res.status(400).json({ message: "Invalid vote value. Must be 1 or -1." });
    }

    const checkAnswerResult = await connectionPool.query(
      "SELECT * FROM answers WHERE id = $1",
      [answerId]
    );

    if (checkAnswerResult.rows.length === 0) {
      return res.status(404).json({ message: "Answer not found." });
    }

    await connectionPool.query(
      "UPDATE answers SET vote = COALESCE(vote, 0) + $1 WHERE id = $2",
      [vote, answerId]
    );

    res.status(200).json({ message: "Vote on the answer has been recorded successfully." });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Unable to vote answer." });
  }
});

export default answersRouter;
