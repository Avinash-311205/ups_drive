require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { startReminderScheduler } = require('./config/scheduler');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const learningRoutes = require('./routes/learningRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const itRoutes = require('./routes/itRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/it', itRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/employees', employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startReminderScheduler();
});
