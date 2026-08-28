const pool = require('./db');

// Checks every minute for tasks due within 10 minutes that haven't been notified yet.
function startReminderScheduler() {
  setInterval(async () => {
    try {
      const [tasks] = await pool.query(
        `SELECT t.id, t.employee_id, t.title FROM Tasks t
         WHERE t.status != 'Completed'
         AND t.deadline IS NOT NULL
         AND t.deadline <= DATE_ADD(NOW(), INTERVAL 10 MINUTE)
         AND t.deadline >= NOW()
         AND NOT EXISTS (
           SELECT 1 FROM Notifications n
           WHERE n.employee_id = t.employee_id
           AND n.message LIKE CONCAT('%', t.title, '%')
         )`
      );

      for (const task of tasks) {
        await pool.query(
          `INSERT INTO Notifications (employee_id, message, type) VALUES (?, ?, 'reminder')`,
          [task.employee_id, `Reminder: Your task '${task.title}' is due in less than 10 minutes.`]
        );
      }
    } catch (err) {
      console.error('Scheduler error:', err.message);
    }
  }, 60 * 1000); // every 1 minute
}

module.exports = { startReminderScheduler };
