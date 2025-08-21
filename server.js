const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static assets from /static (optional; if you have CSS/JS files)
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html');
  console.log('Serving /:', filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading page');
    }
  });
});


// OpenAI client setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// API route to generate message
app.post('/generate', async (req, res) => {
  const userInput = req.body.input;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a "get well soon" card writer. Based on the user's description, generate a short, warm, and friendly get-well message. Do not exceed 250 characters.`
        },
        {
          role: "user",
          content: userInput
        }
      ],
      max_tokens: 60,
      temperature: 0.8
    });

    const aiMessage = response.choices[0].message.content.trim();
    res.json({ message: aiMessage });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ message: "Failed to generate message." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
