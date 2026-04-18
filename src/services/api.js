const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const BASE_URL = isProd ? '' : (process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001');

export function getToken() {
  return localStorage.getItem('admin_token');
}

export function setToken(token) {
  localStorage.setItem('admin_token', token);
}

export function getMemberToken() {
  return localStorage.getItem('member_token');
}

export function setMemberToken(token) {
  localStorage.setItem('member_token', token);
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const isMemberPath = path.startsWith('/api/member') || path.startsWith('/api/member-auth');
  const token = isMemberPath ? getMemberToken() : getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let text = await res.text();
    let msg = text;
    try {
      const parsed = JSON.parse(text);
      if (parsed.message) msg = parsed.message;
      else if (parsed.error) msg = parsed.error;
    } catch (e) {}
    throw new Error(msg || 'Request failed');
  }
  return res.status === 204 ? null : res.json();
}

async function requestCsv(path) {
  const headers = { 'Content-Type': 'application/json' };
  const isMemberPath = path.startsWith('/api/member') || path.startsWith('/api/member-auth');
  const token = isMemberPath ? getMemberToken() : getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  if (!res.ok) {
    let text = await res.text();
    let msg = text;
    try {
      const parsed = JSON.parse(text);
      if (parsed.message) msg = parsed.message;
      else if (parsed.error) msg = parsed.error;
    } catch (e) {}
    throw new Error(msg || 'Request failed');
  }
  return res.blob();
}

export const api = {
  memberRegister: (data) => request('/api/member-auth/register', { method: 'POST', body: JSON.stringify(data) }),
  memberLogin: (data) => request('/api/member-auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMemberProfile: () => request('/api/member/profile'),
  updateMemberProfile: (data) => request('/api/member/profile', { method: 'PUT', body: JSON.stringify(data) }),
  listSubMembers: () => request('/api/member/sub-members'),
  createSubMember: (data) => request('/api/member/sub-members', { method: 'POST', body: JSON.stringify(data) }),
  checkoutMemberMembership: (payload) => request('/api/member/memberships/checkout', { method: 'POST', body: JSON.stringify(payload) }),
  checkoutSubMemberMembership: (subId, payload) => request(`/api/member/sub-members/${subId}/memberships/checkout`, { method: 'POST', body: JSON.stringify(payload) }),
  getMemberEnrollments: () => request('/api/member/activities/enrollments'),
  enrollMemberActivitySelf: (activityId) => request(`/api/member/activities/${activityId}/enroll`, { method: 'POST' }),
  getMemberEventRegistrations: () => request('/api/member/events/registrations'),
  registerMemberEventSelf: (eventId) => request(`/api/member/events/${eventId}/register`, { method: 'POST' }),
  getMemberBookings: () => request('/api/member/bookings'),
  createMemberBooking: (data) => request('/api/member/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getMemberPayments: () => request('/api/member/payments'),
  login: (username, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  listCustomers: () => request('/api/customers'),
  createCustomer: (data) =>
    request('/api/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) =>
    request(`/api/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id) => request(`/api/customers/${id}`, { method: 'DELETE' }),
  registerMembership: (payload) => request('/api/memberships/public-register', { method: 'POST', body: JSON.stringify(payload) }),
  listMembershipPackages: (segment) => request(segment ? `/api/membership-packages?segment=${encodeURIComponent(segment)}` : '/api/membership-packages'),
  getMembershipPackage: (code) => request(`/api/membership-packages/${encodeURIComponent(code)}`),
  createMembershipPackage: (data) => request('/api/membership-packages', { method: 'POST', body: JSON.stringify(data) }),
  updateMembershipPackage: (id, data) => request(`/api/membership-packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMembershipPackage: (id) => request(`/api/membership-packages/${id}`, { method: 'DELETE' }),
  listMembers: (opts = {}) => {
    const params = new URLSearchParams();
    if (opts.q){ params.set('q', opts.q); }
    if (opts.type){ params.set('type', opts.type); }
    if (opts.status){ params.set('status', opts.status); }
    if (opts.sort){ params.set('sort', opts.sort); }
    if (opts.order){ params.set('order', opts.order); }
    if (opts.page){ params.set('page', String(opts.page)); }
    if (opts.limit){ params.set('limit', String(opts.limit)); }
    const qs = params.toString();
    return request(qs ? `/api/members?${qs}` : '/api/members');
  },
  createMember: (data) => request('/api/members', { method: 'POST', body: JSON.stringify(data) }),
  updateMember: (id, data) => request(`/api/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMember: (id) => request(`/api/members/${id}`, { method: 'DELETE' }),
  listMemberMemberships: (id) => request(`/api/members/${id}/memberships`),
  addMembershipForMember: (id, payload) => request(`/api/members/${id}/memberships`, { method: 'POST', body: JSON.stringify(payload) }),
  addMembershipCheckoutForMember: (id, payload) => request(`/api/members/${id}/memberships/checkout`, { method: 'POST', body: JSON.stringify(payload) }),
  updateMembershipStatus: (membershipId, status) => request(`/api/memberships/${membershipId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  listMembershipPayments: (membershipId) => request(`/api/memberships/${membershipId}/payments`),
  listActivities: (opts = {}) => {
    const p = new URLSearchParams();
    if (opts.q) p.set('q', opts.q);
    if (opts.category) p.set('category', opts.category);
    if (opts.age_group) p.set('age_group', opts.age_group);
    if (opts.status) p.set('status', opts.status);
    if (opts.sort) p.set('sort', opts.sort);
    if (opts.order) p.set('order', opts.order);
    if (opts.page) p.set('page', String(opts.page));
    if (opts.limit) p.set('limit', String(opts.limit));
    const qs = p.toString();
    return request(qs ? `/api/activities?${qs}` : '/api/activities');
  },
  createActivity: (data) => request('/api/activities', { method: 'POST', body: JSON.stringify(data) }),
  updateActivity: (id, data) => request(`/api/activities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteActivity: (id) => request(`/api/activities/${id}`, { method: 'DELETE' }),
  setActivitySchedules: (id, schedules) => request(`/api/activities/${id}/schedules`, { method: 'POST', body: JSON.stringify(schedules) }),
  assignTrainerToActivity: (activityId, trainerId) => request(`/api/activities/${activityId}/trainers/${trainerId}`, { method: 'POST' }),
  enrollMemberToActivity: (activityId, memberId) => request(`/api/activities/${activityId}/enroll`, { method: 'POST', body: JSON.stringify({ member_id: memberId }) }),
  listTrainers: (opts = {}) => {
    const p = new URLSearchParams();
    if (opts.q) p.set('q', opts.q);
    if (opts.status) p.set('status', opts.status);
    if (opts.sort) p.set('sort', opts.sort);
    if (opts.order) p.set('order', opts.order);
    if (opts.page) p.set('page', String(opts.page));
    if (opts.limit) p.set('limit', String(opts.limit));
    const qs = p.toString();
    return request(qs ? `/api/trainers?${qs}` : '/api/trainers');
  },
  createTrainer: (data) => request('/api/trainers', { method: 'POST', body: JSON.stringify(data) }),
  updateTrainer: (id, data) => request(`/api/trainers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTrainer: (id) => request(`/api/trainers/${id}`, { method: 'DELETE' }),
  listEvents: (opts = {}) => {
    const p = new URLSearchParams();
    if (opts.q) p.set('q', opts.q);
    if (opts.status) p.set('status', opts.status);
    if (opts.category) p.set('category', opts.category);
    if (opts.from && opts.to){ p.set('from', opts.from); p.set('to', opts.to); }
    if (opts.sort) p.set('sort', opts.sort);
    if (opts.order) p.set('order', opts.order);
    if (opts.page) p.set('page', String(opts.page));
    if (opts.limit) p.set('limit', String(opts.limit));
    const qs = p.toString();
    return request(qs ? `/api/events?${qs}` : '/api/events');
  },
  createEvent: (data) => request('/api/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/api/events/${id}`, { method: 'DELETE' }),
  registerEvent: (eventId, memberId) => request(`/api/events/${eventId}/register`, { method: 'POST', body: JSON.stringify({ member_id: memberId }) }),
  createBooking: (data) => request('/api/bookings', { method: 'POST', body: JSON.stringify(data) }),
  listBookings: (opts = {}) => {
    const p = new URLSearchParams();
    if (opts.q) p.set('q', opts.q);
    if (opts.status) p.set('status', opts.status);
    if (opts.from && opts.to){ p.set('from', opts.from); p.set('to', opts.to); }
    if (opts.sort) p.set('sort', opts.sort);
    if (opts.order) p.set('order', opts.order);
    if (opts.page) p.set('page', String(opts.page));
    if (opts.limit) p.set('limit', String(opts.limit));
    const qs = p.toString();
    return request(qs ? `/api/bookings?${qs}` : '/api/bookings');
  },
  submitSurvey: (payload) => request('/api/surveys', { method: 'POST', body: JSON.stringify(payload) }),
  submitContactMessage: (data) => request('/api/contact', { method: 'POST', body: JSON.stringify(data) }),
  submitTrainerEvaluation: (data) => request('/api/trainer-evaluations', { method: 'POST', body: JSON.stringify(data) }),
  listContactMessages: (opts = {}) => {
    const p = new URLSearchParams();
    if (opts.q) p.set('q', opts.q);
    if (opts.status) p.set('status', opts.status);
    if (opts.page) p.set('page', String(opts.page));
    if (opts.limit) p.set('limit', String(opts.limit));
    const qs = p.toString();
    return request(qs ? `/api/contact?${qs}` : '/api/contact');
  },
  listTrainerEvaluations: (opts = {}) => {
    const p = new URLSearchParams();
    if (opts.q) p.set('q', opts.q);
    if (opts.trainer_name) p.set('trainer_name', opts.trainer_name);
    if (opts.page) p.set('page', String(opts.page));
    if (opts.limit) p.set('limit', String(opts.limit));
    const qs = p.toString();
    return request(qs ? `/api/trainer-evaluations?${qs}` : '/api/trainer-evaluations');
  },
  deleteTrainerEvaluation: (id) => request(`/api/trainer-evaluations/${id}`, { method: 'DELETE' }),
  exportTrainerEvaluationsCsv: (opts = {}) => {
    const p = new URLSearchParams();
    if (opts.q) p.set('q', opts.q);
    if (opts.trainer_name) p.set('trainer_name', opts.trainer_name);
    const qs = p.toString();
    return requestCsv(qs ? `/api/trainer-evaluations/export?${qs}` : '/api/trainer-evaluations/export');
  },
  getForm: (code) => request(`/api/forms/${encodeURIComponent(code)}`),
  submitForm: (code, payload) => request(`/api/forms/${encodeURIComponent(code)}/submit`, { method: 'POST', body: JSON.stringify(payload) }),
  listForms: () => request('/api/forms'),
  createForm: (data) => request('/api/forms', { method: 'POST', body: JSON.stringify(data) }),
  updateForm: (id, data) => request(`/api/forms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteForm: (id) => request(`/api/forms/${id}`, { method: 'DELETE' }),
  listFormSubmissions: (id, opts = {}) => {
    const p = new URLSearchParams();
    if (opts.page) p.set('page', String(opts.page));
    if (opts.limit) p.set('limit', String(opts.limit));
    const qs = p.toString();
    return request(qs ? `/api/forms/${id}/submissions?${qs}` : `/api/forms/${id}/submissions`);
  },
  getSettings: () => request('/api/settings'),
  updateSettings: (data) => request('/api/settings', { method: 'PUT', body: JSON.stringify(data) }),
  checkoutPayment: (payload) => request('/api/payments/checkout', { method: 'POST', body: JSON.stringify(payload) }),
  listPayments: (opts = {}) => {
    const params = new URLSearchParams();
    if (opts.from && opts.to){ params.set('from', opts.from); params.set('to', opts.to); }
    if (opts.q){ params.set('q', opts.q); }
    if (opts.status){ params.set('status', opts.status); }
    if (opts.method){ params.set('method', opts.method); }
    if (opts.sort){ params.set('sort', opts.sort); }
    if (opts.order){ params.set('order', opts.order); }
    if (opts.page){ params.set('page', String(opts.page)); }
    if (opts.limit){ params.set('limit', String(opts.limit)); }
    const qs = params.toString();
    return request(qs ? `/api/payments?${qs}` : '/api/payments');
  },
  listOrders: (opts = {}) => {
    const p = new URLSearchParams();
    if (opts.q) p.set('q', opts.q);
    if (opts.status) p.set('status', opts.status);
    if (opts.method) p.set('method', opts.method);
    if (opts.page) p.set('page', String(opts.page));
    if (opts.limit) p.set('limit', String(opts.limit));
    const qs = p.toString();
    return request(qs ? `/api/orders?${qs}` : '/api/orders');
  },
  updateOrderStatus: (id, status) => request(`/api/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getReports: () => request('/api/reports'),
  exportReportCsv: (type, opts = {}) => {
    const p = new URLSearchParams();
    p.set('type', type);
    for (const [k,v] of Object.entries(opts||{})){
      if (v !== undefined && v !== null && String(v) !== '') p.set(k, String(v));
    }
    const qs = p.toString();
    return requestCsv(`/api/reports/export?${qs}`);
  },
};
