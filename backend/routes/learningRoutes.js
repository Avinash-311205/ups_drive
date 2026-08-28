const express = require('express');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/:employeeId', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (req.user.role !== 'hr' && req.user.id != employeeId) {
      return res.status(403).json({ error: 'Cannot view another employee\'s learning data' });
    }
    const [rows] = await pool.query('SELECT * FROM Learning WHERE employee_id = ? ORDER BY deadline ASC', [employeeId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// HR: assign learning
router.post('/', verifyToken, requireRole('hr'), async (req, res) => {
  try {
    const { employee_id, title, description, deadline } = req.body;
    const [result] = await pool.query(
      `INSERT INTO Learning (employee_id, title, description, deadline, status, progress)
       VALUES (?, ?, ?, ?, 'Pending', 0)`,
      [employee_id, title, description || '', deadline || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Learning assigned' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
