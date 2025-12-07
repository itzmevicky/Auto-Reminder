import { Contact, Template, Schedule, Conversation, Metric, ActivityLog, BillingInfo, AnalyticsData } from '../types';

// --- MOCK DATA SOURCE ---

const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Sarah Connor', phone: '+1 555 0101', tags: ['Lead', 'VIP'], notes: 'Interested in annual plan', status: 'active', avatar: 'SC' },
  { id: '2', name: 'John Doe', phone: '+1 555 0102', tags: ['Customer'], notes: '', status: 'active', avatar: 'JD' },
  { id: '3', name: 'Kyle Reese', phone: '+1 555 0103', tags: ['Past Client'], notes: 'Follow up in Dec', status: 'inactive', avatar: 'KR' },
  { id: '4', name: 'Ellen Ripley', phone: '+1 555 0104', tags: ['VIP', 'Urgent'], notes: '', status: 'active', avatar: 'ER' },
  { id: '5', name: 'James Holden', phone: '+1 555 0105', tags: ['Lead'], notes: '', status: 'active', avatar: 'JH' },
  { id: '6', name: 'Amos Burton', phone: '+1 555 0106', tags: ['Mechanic', 'Contractor'], notes: 'Likes strict deadlines', status: 'active', avatar: 'AB' },
];

const MOCK_TEMPLATES: Template[] = [
  { id: '1', name: 'Appointment Reminder', content: 'Hi {name}, this is a reminder for your appointment at {time}. See you soon!', status: 'approved', category: 'utility' },
  { id: '2', name: 'Sale Announcement', content: 'Hello {name}! Big sale starting tomorrow. Get {discount} off on all items.', status: 'approved', category: 'marketing' },
  { id: '3', name: 'Payment Follow-up', content: 'Dear {name}, your payment of {amount} is pending. Please clear it by {date}.', status: 'pending', category: 'utility' },
];

const MOCK_SCHEDULES: Schedule[] = [
  { id: '1', name: 'Evening Batch Reminder', frequency: 'daily', time: '17:00', targetGroup: 'Leads', active: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], recipientCount: 42 },
  { id: '2', name: 'Weekend Special', frequency: 'weekly', time: '10:00', targetGroup: 'VIP', active: false, days: ['Sat'], recipientCount: 15 },
  { id: '3', name: 'Feedback Request', frequency: 'one-time', time: '09:00', targetGroup: 'Customers', active: true, recipientCount: 128 },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    contactId: '1',
    contactName: 'Sarah Connor',
    lastMessage: 'Is the T-800 model available?',
    unreadCount: 2,
    updatedAt: '10:42 AM',
    isOnline: true,
    messages: [
      { id: '1', sender: 'user', text: 'Hi Sarah, checking in on your interest.', timestamp: '10:00 AM', status: 'read' },
      { id: '2', sender: 'contact', text: 'Yes, I am looking for a security droid.', timestamp: '10:30 AM', status: 'read' },
      { id: '3', sender: 'contact', text: 'Is the T-800 model available?', timestamp: '10:42 AM', status: 'read' },
    ]
  },
  {
    contactId: '2',
    contactName: 'John Doe',
    lastMessage: 'Thanks for the update!',
    unreadCount: 0,
    updatedAt: 'Yesterday',
    isOnline: false,
    messages: [
      { id: '1', sender: 'user', text: 'Your order #123 is shipped.', timestamp: 'Yesterday', status: 'read' },
      { id: '2', sender: 'contact', text: 'Thanks for the update!', timestamp: 'Yesterday', status: 'read' },
    ]
  },
  {
    contactId: '3',
    contactName: 'Kyle Reese',
    lastMessage: 'Come with me if you want to live',
    unreadCount: 5,
    updatedAt: 'Mon',
    isOnline: true,
    messages: [
       { id: '1', sender: 'contact', text: 'Come with me if you want to live', timestamp: 'Mon', status: 'read' }
    ]
  }
];

const MOCK_STATS: Metric[] = [
  { label: 'Reminders Sent', value: 21, change: 12, trend: 'up' },
  { label: 'Active Customers', value: 142, change: 5, trend: 'up' },
  { label: 'Replies Waiting', value: 5, change: -2, trend: 'down' },
  { label: 'Needs Attention', value: 2, trend: 'neutral' },
];

const MOCK_ACTIVITY: ActivityLog[] = [
  { id: '1', user: 'John Smith', userInitials: 'JS', action: 'Replied to', target: 'Appointment Reminder', time: '2m ago', type: 'reply' },
  { id: '2', user: 'Alice May', userInitials: 'AM', action: 'Clicked link in', target: 'Summer Sale', time: '15m ago', type: 'click' },
  { id: '3', user: 'Rahul Kumar', userInitials: 'RK', action: 'Replied to', target: 'Feedback Request', time: '1h ago', type: 'reply' },
  { id: '4', user: 'Lucy Chen', userInitials: 'LC', action: 'Opted out of', target: 'Newsletter', time: '3h ago', type: 'opt-out' }
];

const MOCK_BILLING: BillingInfo = {
  plan: 'Pro Plan',
  amount: '29',
  interval: 'month',
  nextBillingDate: 'October 24, 2024',
  paymentMethod: {
    brand: 'VISA',
    last4: '4242',
    holder: 'Alex Morgan',
    expiry: '12/25'
  },
  company: {
    name: 'Acme Corporation',
    taxId: 'US-82928391',
    address: '123 Innovation Dr, Tech City, CA 94043'
  }
};

const MOCK_ANALYTICS: AnalyticsData = {
  weeklyActivity: [
    { name: 'Mon', sent: 40, delivered: 38, replied: 12 },
    { name: 'Tue', sent: 30, delivered: 28, replied: 8 },
    { name: 'Wed', sent: 55, delivered: 50, replied: 20 },
    { name: 'Thu', sent: 45, delivered: 42, replied: 15 },
    { name: 'Fri', sent: 60, delivered: 58, replied: 25 },
    { name: 'Sat', sent: 20, delivered: 19, replied: 5 },
    { name: 'Sun', sent: 15, delivered: 15, replied: 2 },
  ],
  deliveryStats: [
    { name: 'Delivered', value: 850, color: '#10b981' },
    { name: 'Read', value: 600, color: '#6366f1' },
    { name: 'Failed', value: 25, color: '#f43f5e' },
  ],
  peakTimes: [
    { time: '8am', value: 10 },
    { time: '10am', value: 45 },
    { time: '12pm', value: 30 },
    { time: '2pm', value: 25 },
    { time: '4pm', value: 55 },
    { time: '6pm', value: 70 },
    { time: '8pm', value: 40 },
    { time: '10pm', value: 15 },
  ]
};

// --- SIMULATED API CLIENT ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Randomly throw errors to test error handling (1% chance)
const simulateInstability = () => {
    if (Math.random() > 0.99) throw new Error("Network Error: 500");
}

export const api = {
  getDashboardStats: async (): Promise<Metric[]> => {
    await delay(800);
    simulateInstability();
    return [...MOCK_STATS];
  },

  getRecentActivity: async (): Promise<ActivityLog[]> => {
    await delay(600);
    return [...MOCK_ACTIVITY];
  },

  getContacts: async (search?: string): Promise<Contact[]> => {
    await delay(500);
    simulateInstability();
    if (!search) return [...MOCK_CONTACTS];
    const lowerSearch = search.toLowerCase();
    return MOCK_CONTACTS.filter(c => 
      c.name.toLowerCase().includes(lowerSearch) || 
      c.phone.includes(lowerSearch) ||
      c.tags.some(t => t.toLowerCase().includes(lowerSearch))
    );
  },

  getTemplates: async (): Promise<Template[]> => {
    await delay(700);
    return [...MOCK_TEMPLATES];
  },

  getSchedules: async (): Promise<Schedule[]> => {
    await delay(600);
    return [...MOCK_SCHEDULES];
  },

  toggleSchedule: async (id: string): Promise<boolean> => {
    await delay(300); // Fast mutation
    // In a real app, this would update the backend
    return true; 
  },

  getConversations: async (): Promise<Conversation[]> => {
    await delay(500);
    // Simulating deep copy to avoid reference issues
    return JSON.parse(JSON.stringify(MOCK_CONVERSATIONS));
  },

  sendMessage: async (convId: string, text: string): Promise<boolean> => {
    await delay(300);
    if (!text) throw new Error("Message cannot be empty");
    return true;
  },

  getAnalytics: async (): Promise<AnalyticsData> => {
    await delay(1200); // Heavy data load simulation
    return MOCK_ANALYTICS;
  },

  getBillingInfo: async (): Promise<BillingInfo> => {
    await delay(800);
    return MOCK_BILLING;
  }
};
