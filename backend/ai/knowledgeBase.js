// Lightweight keyword-matched knowledge base — no vector DB needed for MVP.

const hrPolicies = [
  {
    keywords: ['work from home', 'wfh', 'remote'],
    answer: 'Employees can work from home up to 2 days per week with manager approval. Request WFH at least 1 day in advance via the leave/attendance system.',
  },
  {
    keywords: ['leave policy', 'leave rules', 'how many leaves'],
    answer: 'Employees get 24 paid leave days per year. Leave requests must be submitted at least 3 days in advance except for sick leave, which can be applied for on the same day.',
  },
  {
    keywords: ['leave approval', 'approve leave', 'who approves'],
    answer: 'Leave requests are automatically routed to your reporting manager. You will be notified once it is approved or rejected, usually within 24 hours.',
  },
  {
    keywords: ['probation'],
    answer: 'New employees are on probation for the first 3 months, during which onboarding tasks must be completed.',
  },
];

const itKnowledgeBase = [
  {
    keywords: ['vpn'],
    answer: 'Try disconnecting and reconnecting the VPN client. Ensure you are on a stable internet connection and your VPN credentials have not expired. If it still fails, restart the VPN client and your machine.',
  },
  {
    keywords: ['wifi', 'wi-fi', 'wireless', 'network'],
    answer: 'Forget the WiFi network on your device and reconnect using the company SSID and password. Ensure airplane mode is off and try restarting your WiFi adapter.',
  },
  {
    keywords: ['account', 'login', 'password', 'locked out'],
    answer: 'Try resetting your password via the company SSO portal. If your account is locked, wait 15 minutes or contact IT directly.',
  },
  {
    keywords: ['laptop', 'not turning on', 'battery'],
    answer: 'Try a hard reset by holding the power button for 15 seconds. Ensure the charger is connected and the charging light is on.',
  },
];

function search(list, query) {
  const q = query.toLowerCase();
  const match = list.find((item) => item.keywords.some((k) => q.includes(k)));
  return match ? match.answer : null;
}

function searchHRPolicies(query) {
  return search(hrPolicies, query) || "I couldn't find a specific HR policy for that — please check with HR directly.";
}

function searchITKnowledgeBase(query) {
  return search(itKnowledgeBase, query) || "I don't have a troubleshooting step for that specific issue. I can create an IT support ticket for you instead.";
}

module.exports = { searchHRPolicies, searchITKnowledgeBase };
