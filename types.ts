export interface Contact {
  id: string;
  name: string;
  phone: string;
  tags: string[];
  notes?: string;
  status: 'active' | 'inactive';
  lastActivity?: string;
  avatar?: string;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  status: 'approved' | 'pending' | 'rejected';
  category: 'marketing' | 'utility' | 'authentication';
}

export interface Message {
  id: string;
  sender: 'user' | 'contact';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  contactId: string;
  contactName: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
  updatedAt: string;
  isOnline?: boolean;
}

export interface Schedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'one-time';
  time: string; // "17:00"
  days?: string[]; // ["Mon", "Wed"]
  targetGroup: string; // Tag or "All"
  active: boolean;
  recipientCount?: number;
}

export interface Metric {
  label: string;
  value: number | string;
  change?: number; // percentage
  trend?: 'up' | 'down' | 'neutral';
}

export interface ActivityLog {
  id: string;
  user: string;
  userInitials: string;
  action: string;
  target: string;
  time: string;
  type: 'reply' | 'click' | 'opt-out' | 'system';
}

export interface BillingInfo {
  plan: string;
  amount: string;
  interval: string;
  nextBillingDate: string;
  paymentMethod: {
    brand: string;
    last4: string;
    holder: string;
    expiry: string;
  };
  company: {
    name: string;
    taxId: string;
    address: string;
  };
}

export interface AnalyticsData {
  weeklyActivity: { name: string; sent: number; delivered: number; replied: number }[];
  deliveryStats: { name: string; value: number; color: string }[];
  peakTimes: { time: string; value: number }[];
}
