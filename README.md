🧠 Quora-like API (Express + PostgreSQL)

📘 Project Overview
This is a RESTful API for a Q&A platform similar to Quora, built using Express.js and PostgreSQL. Users can create and manage questions and answers, vote on them, and search questions by title or category.

✅ Key Features
📌 Questions
- Create / Edit / Delete / View all or a specific question
- Search by title or category
- Vote (upvote/downvote)

💬 Answers
- Create / Delete answers (max 300 characters)
- View all answers for a question
- Vote on answers
- Answers are deleted when the related question is deleted

🛠 Tech Stack

- Backend: Express.js
- Database: PostgreSQL
- Testing: Postman
- Routing: Express Router
- Validation: Custom middlewares (validateQuestions, validateAnswers)
- Error Handling: Global middleware for all API errors

🧪 Testing
- All endpoints tested with Postman
- Includes error handling for invalid input and missing data
