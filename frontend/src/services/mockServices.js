export const mockUser = {
  name: 'Avinash',
  id: 'EMP-1024',
  department: 'Engineering',
  role: 'employee',
  email: 'avinash@company.com'
}

export const tasks = [
  {id:1,title:'Cybersecurity Training',priority:'High',deadline:'Today, 5:00 PM',status:'In Progress',assigned:'2026-08-28',description:'Complete mandatory cybersecurity module.'},
  {id:2,title:'Submit Weekly Report',priority:'Medium',deadline:'Tomorrow',status:'Pending',assigned:'2026-08-25',description:'Submit reports to manager.'},
  {id:3,title:'Complete AI Learning Module',priority:'Low',deadline:'Friday',status:'Pending',assigned:'2026-08-20',description:'Complete AI fundamentals.'}
]

export const leaveSummary = {total:20,used:8,remaining:12}

export const learning = [
  {id:1,name:'Cybersecurity Training',progress:60,status:'In Progress',deadline:'Today'},
  {id:2,name:'AI Fundamentals',progress:30,status:'In Progress',deadline:'Tomorrow'},
  {id:3,name:'Company Orientation',progress:100,status:'Completed',deadline:'-'},
]

export const documents = [
  {id:1,name:'Offer Letter'},{id:2,name:'Employee Handbook'},{id:3,name:'Leave Policy'},{id:4,name:'Work From Home Policy'},{id:5,name:'Onboarding Guide'}
]

export const assets = [
  {id:1,name:'Laptop',status:'Received'},{id:2,name:'Mouse',status:'Received'},{id:3,name:'ID Card',status:'Received'},{id:4,name:'Welcome Kit',status:'Received'},{id:5,name:'Company T-Shirt',status:'Received'},{id:6,name:'Headphones',status:'Pending'}
]

export const notifications = [
  {id:1,type:'task',title:'TASK REMINDER',message:'Cybersecurity Training due in 10 minutes',time:'10m ago',read:false},
  {id:2,type:'learning',title:'LEARNING REMINDER',message:'Complete AI Fundamentals due tomorrow',time:'1h ago',read:false},
  {id:3,type:'support',title:'IT UPDATE',message:'VPN maintenance scheduled',time:'Yesterday',read:true}
]

export const employees = [
  {name:'Avinash',id:'EMP-1024',department:'Engineering',email:'avinash@company.com',status:'Active',tasks:3,leave:12,learningProgress:60,assets:5},
  {name:'Rahul',id:'EMP-1025',department:'Engineering',email:'rahul@company.com',status:'Active',tasks:2,leave:8,learningProgress:40,assets:3},
  {name:'Sara',id:'EMP-1026',department:'Marketing',email:'sara@company.com',status:'Active',tasks:1,leave:10,learningProgress:80,assets:2}
]

export const leaveRequests = [
  {id:1,employee:'Avinash',type:'Casual Leave',start:'2026-08-29',end:'2026-08-31',days:3,reason:'Personal Work',status:'Pending'},
  {id:2,employee:'Rahul',type:'Sick Leave',start:'2026-09-02',end:'2026-09-03',days:2,reason:'Fever',status:'Approved'}
]

export const supportTickets = [
  {id:'IT-1024',employee:'Avinash',issue:'VPN not connecting',created:'2026-08-28 09:30',status:'Open'},
  {id:'IT-1025',employee:'Sara',issue:'Email not syncing',created:'2026-08-26 14:20',status:'Resolved'}
]

export const kbDocuments = [
  {id:1,name:'Leave Policy',category:'HR Policy',uploaded:'2026-01-01',status:'Active'},
  {id:2,name:'Work From Home Policy',category:'HR Policy',uploaded:'2026-02-10',status:'Active'}
]

export const companyAssets = [
  {id:1,employee:'Avinash',asset:'Laptop',category:'Work Equipment',assigned:'2026-01-10',status:'Assigned'},
  {id:2,employee:'Avinash',asset:'Mouse',category:'Work Equipment',assigned:'2026-01-10',status:'Assigned'}
]
