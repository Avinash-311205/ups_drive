const express = require('express');
const pool = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get leave balance for an employee
router.get('/:employeeId', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (req.user.role !== 'hr' && req.user.id != employeeId) {
      return res.status(403).json({ error: 'Cannot view another employee\'s leave' });
    }
    const [rows] = await pool.query('SELECT * FROM Leave_Balance WHERE employee_id = ?', [employeeId]);
    if (rows.length === 0) return res.status(404).json({ error: 'No leave record found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Apply for leave
router.post('/apply', verifyToken, async (req, res) => {
  try {
    const { start_date, end_date, reason } = req.body;
    const employee_id = req.user.id;
    if (!start_date || !end_date) return res.status(400).json({ error: 'start_date and end_date required' });

    const start = new Date(`${start_date}T00:00:00`);
    const end = new Date(`${end_date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start < today || end < start) {
      return res.status(400).json({ error: 'Invalid date: leave must start today or later, and end on or after the start date' });
    }

    const [result] = await pool.query(
      `INSERT INTO Leave_Requests (employee_id, start_date, end_date, reason, status)
       VALUES (?, ?, ?, ?, 'Pending')`,
      [employee_id, start_date, end_date, reason || '']
    );
    res.status(201).json({ id: result.insertId, message: 'Leave request submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// HR: view all leave requests
router.get('/', verifyToken, requireRole('hr'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT lr.*, u.name AS employee_name FROM Leave_Requests lr
       JOIN Users u ON lr.employee_id = u.id
       ORDER BY lr.id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:requestId/status', verifyToken, requireRole('hr'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid leave status' });
    }
    await pool.query('UPDATE Leave_Requests SET status = ? WHERE id = ?', [status, req.params.requestId]);
    res.json({ message: 'Leave request status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
