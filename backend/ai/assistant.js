const { GoogleGenerativeAI } = require('@google/generative-ai');
const tools = require('./tools');
const { queryRag } = require('./ragService');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fallbackResponse(message, data, userRole = 'employee') {
  const lowerMessage = message.toLowerCase();
  if (typeof data === 'string') return data;
  if (userRole === 'hr' && Array.isArray(data) && data.length && data[0].employee_name) {
    if (data[0].start_date) {
      return data.map(request => `${request.employee_name}: ${request.status} (${request.start_date} to ${request.end_date})`).join('; ');
    }
    if (data[0].title) {
      return `Pending tasks: ${data.map(task => `${task.employee_name} - ${task.title}`).join('; ')}.`;
    }
  }
  if ((lowerMessage.includes('approved') || lowerMessage.includes('rejected') || lowerMessage.includes('pending')) && Array.isArray(data)) {
    if (data.length && data[0].start_date) {
      if (!data.length) return 'No matching leave requests found.';
      return data.map(request => `${request.employee_name}: ${request.status} (${request.start_date} to ${request.end_date})`).join('; ');
    }
  }
  if (lowerMessage.includes('pending') && Array.isArray(data)) {
    if (!data.length) return 'There are no pending employee tasks.';
    return `Pending tasks: ${data.map(task => `${task.employee_name} - ${task.title}`).join('; ')}.`;
  }
  if ((lowerMessage.includes('approved') || lowerMessage.includes('rejected')) && Array.isArray(data)) {
    if (!data.length) return 'No matching leave requests found.';
    return data.map(request => `${request.employee_name}: ${request.status} (${request.start_date} to ${request.end_date})`).join('; ');
  }
  if (lowerMessage.includes('approv') || lowerMessage.includes('request status')) {
    const request = Array.isArray(data) ? data[0] : data;
    if (!request) return 'You have no leave requests yet.';
    return `Your latest leave request (${request.start_date} to ${request.end_date}) is ${request.status}.`;
  }
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

async function askAssistant(employeeId, userMessage, userRole = 'employee') {
  let data = null;
  try {
    const message = userMessage.toLowerCase();
    const asksForPriority =
      message.includes('priority') ||
      message.includes('first') ||
      message.includes('important');
    const asksAboutPolicy =
      message.includes('policy') ||
      message.includes('wfh') ||
      message.includes('work from home');
    const asksAboutApproval =
      message.includes('approv') ||
      message.includes('request status');
    const asksHRLeaveOverview = userRole === 'hr' &&
      (message.includes('leave') || message.includes('vacation')) &&
      (message.includes('who') || message.includes('whose') || asksAboutApproval || message.includes('recent'));
    const asksHRTaskOverview = userRole === 'hr' &&
      (message.includes('task') || message.includes('todo') || message.includes('work')) &&
      (message.includes('pending') || message.includes('in progress') || message.includes('whose') || message.includes('who'));

    let context = '';
    let useDeterministicResponse = false;

    if (asksHRLeaveOverview) {
      const status = message.includes('approved') ? 'Approved' : message.includes('rejected') ? 'Rejected' : message.includes('pending') ? 'Pending' : null;
      data = await tools.getAllLeaveRequests(status);
      useDeterministicResponse = true;
      context = `
Company leave requests:
${JSON.stringify(data, null, 2)}
`;
    }

    // -----------------------------------
    // LEAVE
    // -----------------------------------
    if (asksHRTaskOverview) {
      data = await tools.getAllPendingTasks();
      useDeterministicResponse = true;
      context = `
Company pending tasks:
${JSON.stringify(data, null, 2)}
`;
    } else if (asksHRLeaveOverview) {
      // HR overview data was loaded above.
    } else if (
      message.includes('leave') ||
      message.includes('vacation') ||
      message.includes('pto')
    ) {
      if (asksAboutPolicy) {
        data = await tools.searchHRPolicies(userMessage);

        context = `
HR policy information:
${JSON.stringify(data, null, 2)}
`;
      } else if (asksAboutApproval) {
        data = await tools.getLeaveRequests(employeeId);
        useDeterministicResponse = true;

        context = `
    Employee leave requests:
    ${JSON.stringify(data, null, 2)}
    `;
      } else {
        data = await tools.getLeaveBalance(employeeId);
        useDeterministicResponse = true;

        context = `
Employee leave information:
Total leave: ${data?.total_leave ?? 0}
Used leave: ${data?.used_leave ?? 0}
Remaining leave: ${data?.remaining_leave ?? 0}
`;
      }
    }

    // -----------------------------------
    // HIGHEST PRIORITY TASK
    // -----------------------------------
    else if (asksForPriority) {
      data = await tools.getHighestPriorityTask(employeeId);
      useDeterministicResponse = true;

      context = `
Highest priority task:
${JSON.stringify(data, null, 2)}
`;
    }

    // -----------------------------------
    // HR POLICY
    // -----------------------------------
    else if (asksAboutPolicy) {
      data = await queryRag(userMessage) || await tools.searchHRPolicies(userMessage);

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
      data = await queryRag(userMessage) || await tools.searchITKnowledgeBase(userMessage);

      context = `
IT knowledge base result:
${JSON.stringify(data, null, 2)}
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
      useDeterministicResponse = true;

      context = `
Employee tasks:
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
      useDeterministicResponse = true;

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
      useDeterministicResponse = true;

      context = `
Onboarding status:
${JSON.stringify(data, null, 2)}
`;
    }

    // -----------------------------------
    // GENERAL QUESTION
    // -----------------------------------
    else {
      data = await queryRag(userMessage);
      context = data ? `
    Retrieved knowledge-base information:
    ${data}
    ` : `
No specific employee database information was requested.
Answer the employee's question normally.
`;
    }

    if (useDeterministicResponse) {
      return fallbackResponse(userMessage, data, userRole);
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

    return fallbackResponse(userMessage, data, userRole);
  }
}

module.exports = {
  askAssistant
};
