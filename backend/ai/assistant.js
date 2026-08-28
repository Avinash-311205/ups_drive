const { GoogleGenerativeAI } = require('@google/generative-ai');
const tools = require('./tools');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fallbackResponse(message, data) {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('leave') || lowerMessage.includes('vacation') || lowerMessage.includes('pto')) {
    if (!data) return 'No leave balance has been set up for your account yet.';
    return `You have ${data.remaining_leave} leave days remaining out of ${data.total_leave}. You have used ${data.used_leave} days.`;
  }
  if (lowerMessage.includes('priority') || lowerMessage.includes('first') || lowerMessage.includes('important')) {
    const task = Array.isArray(data) ? data[0] : data;
    if (!task) return 'You have no pending tasks right now.';
    return `Complete "${task.title}" first. It is ${task.priority} priority and is due ${task.deadline || 'soon'}.`;
  }
  if (Array.isArray(data)) {
    if (lowerMessage.includes('learning') || lowerMessage.includes('training') || lowerMessage.includes('course')) {
      return data.length ? `You have ${data.length} pending learning assignment(s). Your next assignment is "${data[0].title}".` : 'You have no pending learning assignments.';
    }
    if (lowerMessage.includes('onboarding') || lowerMessage.includes('checklist')) {
      const completed = data.filter(item => item.status === 'Completed').length;
      return `Your onboarding checklist is ${completed} of ${data.length} items complete.`;
    }
    return data.length ? `You have ${data.length} pending task(s). Your next task is "${data[0].title}".` : 'You have no pending tasks.';
  }
  if (typeof data === 'string') return data;
  return 'I can help with tasks, leave, learning, onboarding, HR policies, and IT support.';
}

const SYSTEM_PROMPT = `
You are the Employee Digital Assistant.

You help employees with:
- Tasks
- Leave
- Learning
- Onboarding
- HR policies
- IT support

Answer using the employee data provided to you.
Never invent employee data.

Keep responses short, clear and friendly.
`;

async function askAssistant(employeeId, userMessage) {
  let data = null;
  try {
    const message = userMessage.toLowerCase();

    let context = '';

    // -----------------------------------
    // LEAVE
    // -----------------------------------
    if (
      message.includes('leave') ||
      message.includes('vacation') ||
      message.includes('pto')
    ) {
      data = await tools.getLeaveBalance(employeeId);

      context = `
Employee leave information:
Total leave: ${data.total_leave}
Used leave: ${data.used_leave}
Remaining leave: ${data.remaining_leave}
`;
    }

    // -----------------------------------
    // TASKS
    // -----------------------------------
    else if (
      message.includes('task') ||
      message.includes('work') ||
      message.includes('todo')
    ) {
      data = await tools.getEmployeeTasks(employeeId);

      context = `
Employee tasks:
${JSON.stringify(data, null, 2)}
`;
    }

    // -----------------------------------
    // HIGHEST PRIORITY TASK
    // -----------------------------------
    else if (
      message.includes('priority') ||
      message.includes('first') ||
      message.includes('important')
    ) {
      data = await tools.getHighestPriorityTask(employeeId);

      context = `
Highest priority task:
${JSON.stringify(data, null, 2)}
`;
    }

    // -----------------------------------
    // LEARNING
    // -----------------------------------
    else if (
      message.includes('learning') ||
      message.includes('training') ||
      message.includes('course')
    ) {
      data = await tools.getLearningAssignments(employeeId);

      context = `
Learning assignments:
${JSON.stringify(data, null, 2)}
`;
    }

    // -----------------------------------
    // ONBOARDING
    // -----------------------------------
    else if (
      message.includes('onboarding') ||
      message.includes('checklist')
    ) {
      data = await tools.getOnboardingStatus(employeeId);

      context = `
Onboarding status:
${JSON.stringify(data, null, 2)}
`;
    }

    // -----------------------------------
    // HR POLICY
    // -----------------------------------
    else if (
      message.includes('policy') ||
      message.includes('wfh') ||
      message.includes('work from home')
    ) {
      data = await tools.searchHRPolicies(userMessage);

      context = `
HR policy information:
${JSON.stringify(data, null, 2)}
`;
    }

    // -----------------------------------
    // IT SUPPORT
    // -----------------------------------
    else if (
      message.includes('wifi') ||
      message.includes('vpn') ||
      message.includes('laptop') ||
      message.includes('login') ||
      message.includes('computer') ||
      message.includes('internet')
    ) {
      data = await tools.searchITKnowledgeBase(userMessage);

      context = `
IT knowledge base result:
${JSON.stringify(data, null, 2)}
`;
    }

    // -----------------------------------
    // GENERAL QUESTION
    // -----------------------------------
    else {
      context = `
No specific employee database information was requested.
Answer the employee's question normally.
`;
    }

    // -----------------------------------
    // ASK GEMINI TO FORMULATE ANSWER
    // -----------------------------------

    const prompt = `
${context}

Employee question:
${userMessage}

Give a short, clear and friendly answer.
`;

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: SYSTEM_PROMPT
      });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (geminiError) {
      console.error('Gemini unavailable; using local assistant response:', geminiError.message);
      return fallbackResponse(userMessage, data);
    }

  } catch (error) {
    console.error('========== GEMINI ERROR ==========');
    console.error('Message:', error.message);
    console.error('Status:', error.status);
    console.error('Status Text:', error.statusText);
    console.error('Full Error:', error);
    console.error('==================================');

    return fallbackResponse(userMessage, data);
  }
}

module.exports = {
  askAssistant
};
