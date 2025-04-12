import { Router } from "express";
import { validateQuestions } from "../middlewares/validateQuestions.mjs";
import { validateAnswers } from "../middlewares/validateAnswers.mjs";
import connectionPool from "../utils/db.mjs";

const questionsRouter = Router();

// POST /questions
questionsRouter.post("/", [validateQuestions], async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: "Invalid request data." });
    }
    await connectionPool.query(
      "INSERT INTO questions (title, description, category) VALUES ($1, $2, $3)",
      [title, description, category]
    );
    res.status(201).json({ message: "Question created successfully." });
  } catch (error) {
    console.error("Error creating question:", error.message);
    res.status(500).json({ message: "Unable to create question." });
  }
});

// GET /questions
questionsRouter.get("/", async (_, res) => {
  try {
    const result = await connectionPool.query(
      "SELECT id, title, description, category FROM questions ORDER BY id ASC"
    );
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Unable to fetch questions." });
  }
});

// GET /questions/search
questionsRouter.get("/search", async (req, res) => {
  try {
    const { title, category } = req.query;
    if (!title && !category) {
      return res.status(400).json({ message: "Invalid search parameters." });
    }

    const result = await connectionPool.query(
      `SELECT id, title, description, category FROM questions WHERE 
       ($1::text IS NULL OR LOWER(title) LIKE '%' || LOWER($1) || '%') AND 
       ($2::text IS NULL OR LOWER(category) LIKE '%' || LOWER($2) || '%')`,
      [title || null, category || null]
    );

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error searching questions:", error);
    res.status(500).json({ message: "Unable to fetch a question." });
  }
});

// GET /questions/:questionId
questionsRouter.get("/:questionId", async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);

    if (isNaN(questionId) || questionId <= 0) {
      return res.status(400).json({ message: "Invalid question ID." });
    }

    const result = await connectionPool.query(
      "SELECT id, title, description, category FROM questions WHERE id = $1",
      [questionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Unable to fetch questions." });
  }
});

// PUT /questions/:questionId
questionsRouter.put("/:questionId", async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Invalid request data." });
    }

    const result = await connectionPool.query(
      "UPDATE questions SET title = $1, description = $2, category = $3 WHERE id = $4",
      [title, description, category, questionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.status(200).json({ message: "Question updated successfully." });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Unable to fetch questions." });
  }
});

// DELETE /questions/:questionId
questionsRouter.delete("/:questionId", async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);

    const result = await connectionPool.query(
      "DELETE FROM questions WHERE id = $1",
      [questionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    res
      .status(200)
      .json({ message: "Question post has been deleted successfully." });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Unable to delete question." });
  }
});

// POST /questions/:questionId/answers
questionsRouter.post("/:questionId/answers", [validateAnswers], async (req, res) => {
    try {
      const questionId = parseInt(req.params.questionId);
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Invalid request data." });
      }

      const questionCheck = await connectionPool.query(
        "SELECT id FROM questions WHERE id = $1",
        [questionId]
      );
      if (questionCheck.rows.length === 0) {
        return res.status(404).json({ message: "Question not found." });
      }

      await connectionPool.query(
        "INSERT INTO answers (question_id, content) VALUES ($1, $2)",
        [questionId, content]
      );

      res.status(201).json({ message: "Answer created successfully." });
    } catch (error) {
      res.status(500).json({ message: "Unable to create answers." });
    }
  }
);

// GET /questions/:questionId/answers
questionsRouter.get("/:questionId/answers", async (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);

    const questionCheck = await connectionPool.query(
      "SELECT id FROM questions WHERE id = $1",
      [questionId]
    );
    if (questionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    const result = await connectionPool.query(
      "SELECT id, content FROM answers WHERE question_id = $1 ORDER BY id ASC",
      [questionId]
    );

    res.status(200).json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch answers." });
  }
});

// DELETE /questions/:questionId/answers
questionsRouter.delete("/:questionId/answers", async (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);

    const questionCheck = await connectionPool.query(
      "SELECT id FROM questions WHERE id = $1",
      [questionId]
    );
    if (questionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    await connectionPool.query("DELETE FROM answers WHERE question_id = $1", [
      questionId,
    ]);

    res.status(200).json({
      message: "All answers for the question have been deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete answers." });
  }
});

// POST /questions/:questionId/vote
questionsRouter.post("/:questionId/vote", async (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);
    const { vote } = req.body;

    if (vote !== 1 && vote !== -1) {
      return res.status(400).json({ message: "Invalid vote value." });
    }

    const result = await connectionPool.query(
      "INSERT INTO question_votes (vote, question_id) VALUES ($1, $2)",
      [vote, questionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.status(200).json({
      message: "Vote on the question has been recorded successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to vote question." });
  }
});

export default questionsRouter;
