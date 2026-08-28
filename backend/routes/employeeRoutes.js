const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, requireRole('hr'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role,
              COUNT(t.id) AS task_count,
              COALESCE(lb.remaining_leave, 0) AS remaining_leave
       FROM Users u
       LEFT JOIN Tasks t ON t.employee_id = u.id AND t.status != 'Completed'
       LEFT JOIN Leave_Balance lb ON lb.employee_id = u.id
       WHERE u.role = 'employee'
       GROUP BY u.id, u.name, u.email, u.role, lb.remaining_leave
       ORDER BY u.name`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

  router.get('/:employeeId', verifyToken, requireRole('hr'), async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT u.id, u.name, u.email, u.role,
                COUNT(DISTINCT CASE WHEN t.status != 'Completed' THEN t.id END) AS task_count,
                COALESCE(lb.remaining_leave, 0) AS remaining_leave,
                COUNT(DISTINCT l.id) AS learning_count
         FROM Users u
         LEFT JOIN Tasks t ON t.employee_id = u.id
         LEFT JOIN Leave_Balance lb ON lb.employee_id = u.id
         LEFT JOIN Learning l ON l.employee_id = u.id AND l.status != 'Completed'
         WHERE u.id = ? AND u.role = 'employee'
         GROUP BY u.id, u.name, u.email, u.role, lb.remaining_leave`,
        [req.params.employeeId]
      );
      if (!rows.length) return res.status(404).json({ error: 'Employee not found' });
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

router.post('/', verifyToken, requireRole('hr'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, 'employee')`,
      [name, email, hashedPassword]
    );

    await pool.query(
      `INSERT INTO Leave_Balance (employee_id, total_leave, used_leave, remaining_leave)
       VALUES (?, 24, 0, 24)`,
      [result.insertId]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      role: 'employee'
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'An employee with this email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;