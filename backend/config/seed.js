// Run with: node config/seed.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./db');

async function seed() {
  const password = await bcrypt.hash('password123', 10);

  const employees = [
    ['Arjun Kumar', 'arjun@company.com'], ['Priya Sharma', 'priya@company.com'],
    ['Rahul Verma', 'rahul@company.com'], ['Sara Joseph', 'sara@company.com'],
    ['Nisha Patel', 'nisha@company.com'], ['Vikram Singh', 'vikram@company.com'],
    ['Ananya Rao', 'ananya@company.com'], ['Karan Shah', 'karan@company.com'],
    ['Divya Menon', 'divya@company.com'], ['Rohan Das', 'rohan@company.com'],
    ['Isha Kapoor', 'isha@company.com'], ['Aditya Nair', 'aditya@company.com'],
    ['Neha Gupta', 'neha@company.com'], ['Manish Joshi', 'manish@company.com'],
    ['Pooja Iyer', 'pooja@company.com']
  ];
  const employeeValues = employees.flatMap(([name, email]) => [name, email, password]);
  const employeePlaceholders = employees.map(() => "(?, ?, ?, 'employee')").join(', ');
  await pool.query(
    `INSERT IGNORE INTO Users (name, email, password, role) VALUES ${employeePlaceholders}`,
    employeeValues
  );
  await pool.query(
    `INSERT IGNORE INTO Users (name, email, password, role) VALUES ('Meena HR', 'meena.hr@company.com', ?, 'hr')`,
    [password]
  );
  await pool.query(
    `INSERT IGNORE INTO Leave_Balance (employee_id, total_leave, used_leave, remaining_leave)
     SELECT id, 24, 0, 24 FROM Users WHERE role = 'employee'`
  );
  const [[arjun], [priya]] = await Promise.all([
    pool.query(`SELECT id FROM Users WHERE email = 'arjun@company.com'`),
    pool.query(`SELECT id FROM Users WHERE email = 'priya@company.com'`)
  ]);
  const emp1 = arjun.id;
  const emp2 = priya.id;

  await pool.query(
    `INSERT INTO Tasks (employee_id, title, description, priority, deadline, status) VALUES
     (?, 'Submit Weekly Report', 'Compile and submit the weekly status report', 'High', DATE_ADD(NOW(), INTERVAL 2 HOUR), 'Pending'),
     (?, 'Cybersecurity Training', 'Complete mandatory cybersecurity module', 'High', DATE_ADD(NOW(), INTERVAL 1 DAY), 'Pending'),
     (?, 'Update Project Docs', 'Update the README and API docs', 'Medium', DATE_ADD(NOW(), INTERVAL 3 DAY), 'In Progress'),
     (?, 'Team Standup Notes', 'Share standup notes with the team', 'Low', DATE_ADD(NOW(), INTERVAL 5 DAY), 'Pending')`,
    [emp1, emp1, emp1, emp2]
  );

  await pool.query(
    `UPDATE Leave_Balance SET used_leave = CASE WHEN employee_id = ? THEN 12 ELSE used_leave END,
       remaining_leave = CASE WHEN employee_id = ? THEN 12 ELSE remaining_leave END
     WHERE employee_id IN (?, ?)`,
    [emp1, emp1, emp1, emp2]
  );

  await pool.query(
    `INSERT INTO Learning (employee_id, title, description, deadline, status, progress) VALUES
     (?, 'Cybersecurity Fundamentals', 'Mandatory security awareness course', DATE_ADD(NOW(), INTERVAL 2 DAY), 'In Progress', 40),
     (?, 'React Advanced Patterns', 'Optional skill upgrade course', DATE_ADD(NOW(), INTERVAL 10 DAY), 'Pending', 0)`,
    [emp1, emp2]
  );

  await pool.query(
    `INSERT INTO Onboarding (employee_id, task, status) VALUES
     (?, 'Submit required documents', 'Completed'),
     (?, 'Complete security training', 'Pending'),
     (?, 'Review company policies', 'Pending'),
     (?, 'Complete orientation', 'Completed')`,
    [emp2, emp2, emp2, emp2]
  );

  console.log('Seed complete. Login with arjun@company.com / password123 (employee)');
  console.log('or meena.hr@company.com / password123 (hr)');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
