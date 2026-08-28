const express = require('express');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Employee: get own tasks (also used by HR with :employeeId)
router.get('/:employeeId', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (req.user.role !== 'hr' && req.user.id != employeeId) {
      return res.status(403).json({ error: 'Cannot view another employee\'s tasks' });
    }
    const [rows] = await pool.query(
      `SELECT * FROM Tasks WHERE employee_id = ?
       ORDER BY FIELD(priority, 'High','Medium','Low'), deadline ASC`,
      [employeeId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// HR: assign a new task
router.post('/', verifyToken, requireRole('hr'), async (req, res) => {
  try {
    const { employee_id, title, description, priority, deadline } = req.body;
    if (!employee_id || !title) return res.status(400).json({ error: 'employee_id and title required' });

    const [result] = await pool.query(
      `INSERT INTO Tasks (employee_id, title, description, priority, deadline, status)
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [employee_id, title, description || '', priority || 'Medium', deadline || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Task assigned' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Employee: update task status
router.patch('/:taskId/status', verifyToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    await pool.query('UPDATE Tasks SET status = ? WHERE id = ?', [status, taskId]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// HR: view all tasks across employees
router.get('/', verifyToken, requireRole('hr'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, u.name AS employee_name FROM Tasks t
       JOIN Users u ON t.employee_id = u.id
       ORDER BY t.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
