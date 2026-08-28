const express = require('express');
const pool = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/ticket', verifyToken, async (req, res) => {
  try {
    const { issue } = req.body;
    const employee_id = req.user.id;
    if (!issue) return res.status(400).json({ error: 'issue required' });

    const [result] = await pool.query(
      `INSERT INTO IT_Tickets (employee_id, issue, status) VALUES (?, ?, 'Open')`,
      [employee_id, issue]
    );
    res.status(201).json({ id: result.insertId, message: 'Ticket created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
