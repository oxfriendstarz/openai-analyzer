import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import { analyzeMessages } from "./helper/openai";

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Running");
});

app.post("/analyze-message", async (req: Request, res: Response) => {
  try {
    const messages = req.body;
    if (!Array.isArray(messages) || messages.some((msg) => !msg.user_id || !msg.message || !msg.timestamp)) {
      res.status(400).json({ error: 'Invalid input format' });
    }
    const insights = await analyzeMessages(messages);

    res.json(JSON.parse(insights))
  } catch (error: any) {
    res.status(500).json({ error: `Error processing chat batch: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});