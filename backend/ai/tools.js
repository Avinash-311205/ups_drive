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
  getLearningAssignments,
  getOnboardingStatus,
  searchHRPolicies,
  searchITKnowledgeBase,
  createITTicket,
};
