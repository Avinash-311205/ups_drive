const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { askAssistant } = require('../ai/assistant');

const router = express.Router();

router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });

    const reply = await askAssistant(req.user.id, message);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Assistant failed to respond' });
  }
});

module.exports = router;
