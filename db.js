const DB_KEY = 'healthsync_db';

// Initialize the database in localStorage if it doesn't exist
function initDB() {
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify({
      users: [],
      appointments: []
    }));
  }
}

function getDB() {
  initDB();
  return JSON.parse(localStorage.getItem(DB_KEY));
}

function saveDB(data) {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

// User functions
function registerUser(name, email, password, role) {
  const db = getDB();
  if (db.users.find(u => u.email === email)) {
    return { success: false, message: 'Email already exists' };
  }
  const newUser = { id: Date.now().toString(), name, email, password, role };
  db.users.push(newUser);
  saveDB(db);
  return { success: true, user: newUser };
}

function loginUser(email, password) {
  const db = getDB();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (user) {
    // Save current session
    localStorage.setItem('healthsync_session', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: 'Invalid email or password' };
}

function getCurrentUser() {
  const session = localStorage.getItem('healthsync_session');
  return session ? JSON.parse(session) : null;
}

function logoutUser() {
  localStorage.removeItem('healthsync_session');
  window.location.href = 'login.html';
}

// Appointment functions
function bookAppointment(patientId, patientName, doctorName, date, time, reason) {
  const db = getDB();
  const newAppointment = {
    id: Date.now().toString(),
    patientId,
    patientName,
    doctorName,
    date,
    time,
    reason,
    status: 'Pending'
  };
  db.appointments.push(newAppointment);
  saveDB(db);
  return { success: true, appointment: newAppointment };
}

function getPatientAppointments(patientId) {
  const db = getDB();
  return db.appointments.filter(a => a.patientId === patientId);
}

function getAllAppointments() {
  const db = getDB();
  return db.appointments;
}

function updateAppointmentStatus(appointmentId, newStatus) {
  const db = getDB();
  const index = db.appointments.findIndex(a => a.id === appointmentId);
  if (index !== -1) {
    db.appointments[index].status = newStatus;
    saveDB(db);
    return true;
  }
  return false;
}
