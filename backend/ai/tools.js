const pool = require('../config/db');
const { searchHRPolicies, searchITKnowledgeBase } = require('./knowledgeBase');

async function getEmployeeTasks(employeeId) {
  const [rows] = await pool.query(
    `SELECT * FROM Tasks WHERE employee_id = ? AND status != 'Completed'
     ORDER BY FIELD(priority,'High','Medium','Low'), deadline ASC`,
    [employeeId]
  );
  return rows;
}

async function getHighestPriorityTask(employeeId) {
  const tasks = await getEmployeeTasks(employeeId);
  if (tasks.length === 0) return null;
  // Already sorted by priority then deadline — first row is the recommendation
  return tasks[0];
}

async function getLeaveBalance(employeeId) {
  const [rows] = await pool.query('SELECT * FROM Leave_Balance WHERE employee_id = ?', [employeeId]);
  return rows[0] || null;
}

async function getLeaveRequests(employeeId) {
  const [rows] = await pool.query(
    `SELECT id, start_date, end_date, reason, status
     FROM Leave_Requests WHERE employee_id = ? ORDER BY id DESC`,
    [employeeId]
  );
  return rows;
}

async function getAllLeaveRequests(status) {
  const params = [];
  let statusFilter = '';
  if (status) {
    statusFilter = 'AND lr.status = ?';
    params.push(status);
  }
  const [rows] = await pool.query(
    `SELECT lr.id, lr.start_date, lr.end_date, lr.reason, lr.status,
            u.name AS employee_name
     FROM Leave_Requests lr
     JOIN Users u ON lr.employee_id = u.id
     ${statusFilter}
     ORDER BY lr.id DESC`,
    params
  );
  return rows;
}

async function getAllPendingTasks() {
  const [rows] = await pool.query(
    `SELECT t.id, t.title, t.priority, t.deadline, t.status,
            u.name AS employee_name
     FROM Tasks t
     JOIN Users u ON t.employee_id = u.id
     WHERE t.status != 'Completed'
     ORDER BY FIELD(t.priority, 'High', 'Medium', 'Low'), t.deadline ASC`
  );
  return rows;
}

async function getLearningAssignments(employeeId) {
  const [rows] = await pool.query(
    `SELECT * FROM Learning WHERE employee_id = ? AND status != 'Completed' ORDER BY deadline ASC`,
    [employeeId]
  );
  return rows;
}

async function getOnboardingStatus(employeeId) {
  const [rows] = await pool.query('SELECT * FROM Onboarding WHERE employee_id = ?', [employeeId]);
  return rows;
}

async function createITTicket(employeeId, issue) {
  const [result] = await pool.query(
    `INSERT INTO IT_Tickets (employee_id, issue, status) VALUES (?, ?, 'Open')`,
    [employeeId, issue]
  );
  return { id: result.insertId, message: 'Ticket created' };
}

module.exports = {
  getEmployeeTasks,
  getHighestPriorityTask,
  getLeaveBalance,
  getLeaveRequests,
  getAllLeaveRequests,
  getAllPendingTasks,
  getLearningAssignments,
  getOnboardingStatus,
  searchHRPolicies,
  searchITKnowledgeBase,
  createITTicket,
};
