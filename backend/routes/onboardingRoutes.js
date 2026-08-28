const express = require('express');
const pool = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/:employeeId', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (req.user.role !== 'hr' && req.user.id != employeeId) {
      return res.status(403).json({ error: 'Cannot view another employee\'s onboarding data' });
    }
    const [rows] = await pool.query('SELECT * FROM Onboarding WHERE employee_id = ?', [employeeId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
