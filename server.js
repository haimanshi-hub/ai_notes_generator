import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let ai;
try {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (error) {
    console.warn("Warning: GEMINI_API_KEY is not set or valid. AI generation will fail until it's set.");
}

app.post('/api/generate-notes', async (req, res) => {
    try {
        const { topic } = req.body;
        
        if (!topic) {
            return res.status(400).json({ error: 'Topic or content is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server. Please check your .env file.' });
        }

        const prompt = `You are an expert notes summarizer and creator. 
Create highly structured, clean, and comprehensive notes on the following topic or raw text:
"${topic}"

Format the output in beautiful Markdown with logical headings (#, ##), bullet points, and highlight key terms using bolding. 
Structure it clearly with an Introduction, Main Points, and a Conclusion or Summary.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ notes: response.text });
    } catch (error) {
        console.error('Error generating notes:', error);
        res.status(500).json({ error: 'Failed to generate notes. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
