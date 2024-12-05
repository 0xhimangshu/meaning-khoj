const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();

app.use(express.json());

// app.use(cors({
//     origin: /chrome-extension:\/\/.*/,
//     methods: ['POST']
// }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/summarize', async (req, res) => {
    try {
        const { text } = req.body;
        
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Please summarize the following text in one sentence: ${text}`;
        const result = await model.generateContent(prompt);
        const summary = result.response.text();

        res.json({
            success: true,
            summary: summary
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
