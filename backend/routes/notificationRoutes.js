const express = require('express');
const pool = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Notifications WHERE employee_id = ? ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    await pool.query('UPDATE Notifications SET is_read = TRUE WHERE id = ? AND employee_id = ?', [
      req.params.id,
      req.user.id,
    ]);
    res.json({ message: 'Marked read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
