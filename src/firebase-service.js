import { db, dbRef, dbGet, dbSet, dbUpdate, dbRemove, dbOnValue } from './firebase';

// ==================== EMPLOYEES ====================
export const loadEmployeesFromFirebase = async (defaultEmployees) => {
  try {
    const snapshot = await dbGet(dbRef(db, 'employees'));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    // If no data, initialize with defaults
    await dbSet(dbRef(db, 'employees'), defaultEmployees);
    return defaultEmployees;
  } catch (error) {
    console.error('Error loading employees:', error);
    return defaultEmployees;
  }
};

export const saveEmployeesToFirebase = async (employees) => {
  try {
    await dbSet(dbRef(db, 'employees'), employees);
    return true;
  } catch (error) {
    console.error('Error saving employees:', error);
    return false;
  }
};

export const listenToEmployeesChanges = (callback) => {
  const unsubscribe = dbOnValue(dbRef(db, 'employees'), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  }, (error) => {
    console.error('Error listening to employees:', error);
  });
  return unsubscribe;
};

// ==================== TASKS ====================
export const loadTasksFromFirebase = async (defaultTasks) => {
  try {
    const snapshot = await dbGet(dbRef(db, 'tasks'));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    await dbSet(dbRef(db, 'tasks'), defaultTasks);
    return defaultTasks;
  } catch (error) {
    console.error('Error loading tasks:', error);
    return defaultTasks;
  }
};

export const saveTasksToFirebase = async (tasks) => {
  try {
    await dbSet(dbRef(db, 'tasks'), tasks);
    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    return false;
  }
};

export const listenToTasksChanges = (callback) => {
  const unsubscribe = dbOnValue(dbRef(db, 'tasks'), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  }, (error) => {
    console.error('Error listening to tasks:', error);
  });
  return unsubscribe;
};

// ==================== ATTENDANCES ====================
export const loadAttendancesFromFirebase = async (defaultAttendances) => {
  try {
    const snapshot = await dbGet(dbRef(db, 'attendances'));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    await dbSet(dbRef(db, 'attendances'), defaultAttendances);
    return defaultAttendances;
  } catch (error) {
    console.error('Error loading attendances:', error);
    return defaultAttendances;
  }
};

export const saveAttendancesToFirebase = async (attendances) => {
  try {
    await dbSet(dbRef(db, 'attendances'), attendances);
    return true;
  } catch (error) {
    console.error('Error saving attendances:', error);
    return false;
  }
};

export const listenToAttendancesChanges = (callback) => {
  const unsubscribe = dbOnValue(dbRef(db, 'attendances'), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  }, (error) => {
    console.error('Error listening to attendances:', error);
  });
  return unsubscribe;
};

// ==================== TASK TYPES ====================
export const loadTaskTypesFromFirebase = async (defaultTaskTypes) => {
  try {
    const snapshot = await dbGet(dbRef(db, 'taskTypes'));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    await dbSet(dbRef(db, 'taskTypes'), defaultTaskTypes);
    return defaultTaskTypes;
  } catch (error) {
    console.error('Error loading taskTypes:', error);
    return defaultTaskTypes;
  }
};

export const saveTaskTypesToFirebase = async (taskTypes) => {
  try {
    await dbSet(dbRef(db, 'taskTypes'), taskTypes);
    return true;
  } catch (error) {
    console.error('Error saving taskTypes:', error);
    return false;
  }
};

// ==================== PROJECTS ====================
export const loadProjectsFromFirebase = async (defaultProjects) => {
  try {
    const snapshot = await dbGet(dbRef(db, 'projects'));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    await dbSet(dbRef(db, 'projects'), defaultProjects);
    return defaultProjects;
  } catch (error) {
    console.error('Error loading projects:', error);
    return defaultProjects;
  }
};

export const saveProjectsToFirebase = async (projects) => {
  try {
    await dbSet(dbRef(db, 'projects'), projects);
    return true;
  } catch (error) {
    console.error('Error saving projects:', error);
    return false;
  }
};

// ==================== WORK STATUS ====================
export const loadWorkStatusFromFirebase = async (defaultWorkStatus) => {
  try {
    const snapshot = await dbGet(dbRef(db, 'workStatus'));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    await dbSet(dbRef(db, 'workStatus'), defaultWorkStatus);
    return defaultWorkStatus;
  } catch (error) {
    console.error('Error loading workStatus:', error);
    return defaultWorkStatus;
  }
};

export const saveWorkStatusToFirebase = async (workStatus) => {
  try {
    await dbSet(dbRef(db, 'workStatus'), workStatus);
    return true;
  } catch (error) {
    console.error('Error saving workStatus:', error);
    return false;
  }
};

// ==================== CURRENT USER ====================
export const loadCurrentUserFromFirebase = async () => {
  try {
    const snapshot = await dbGet(dbRef(db, 'currentUser'));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Error loading currentUser:', error);
    return null;
  }
};

export const saveCurrentUserToFirebase = async (user) => {
  try {
    if (user) {
      await dbSet(dbRef(db, 'currentUser'), user);
    } else {
      await dbRemove(dbRef(db, 'currentUser'));
    }
    return true;
  } catch (error) {
    console.error('Error saving currentUser:', error);
    return false;
  }
};

export const listenToCurrentUserChanges = (callback) => {
  const unsubscribe = dbOnValue(dbRef(db, 'currentUser'), (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  }, (error) => {
    console.error('Error listening to currentUser:', error);
  });
  return unsubscribe;
};

// ==================== LISTEN TO SETUP DATA CHANGES ====================
export const listenToTaskTypesChanges = (callback) => {
  const unsubscribe = dbOnValue(dbRef(db, 'taskTypes'), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  }, (error) => {
    console.error('Error listening to taskTypes:', error);
  });
  return unsubscribe;
};

export const listenToProjectsChanges = (callback) => {
  const unsubscribe = dbOnValue(dbRef(db, 'projects'), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  }, (error) => {
    console.error('Error listening to projects:', error);
  });
  return unsubscribe;
};

export const listenToWorkStatusChanges = (callback) => {
  const unsubscribe = dbOnValue(dbRef(db, 'workStatus'), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  }, (error) => {
    console.error('Error listening to workStatus:', error);
  });
  return unsubscribe;
};

// ==================== GHI AN TOÀN (KHÔNG GHI ĐÈ CẢ DANH SÁCH) ====================
// Đọc dữ liệu MỚI NHẤT trên server rồi chỉ áp dụng phần thay đổi (thêm/sửa/xóa theo id).
// Tránh lỗi máy có dữ liệu cũ ghi đè làm mất task/điểm danh của máy khác.
import { runTransaction } from 'firebase/database';

export const toArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  return Object.values(val).filter(Boolean);
};

const applyChangesSafely = async (path, upserts, deleteIds) => {
  if (upserts.length === 0 && deleteIds.length === 0) return true;
  try {
    await runTransaction(dbRef(db, path), (current) => {
      let arr = toArray(current).filter(item => !deleteIds.includes(item.id));
      upserts.forEach(u => {
        const i = arr.findIndex(item => item.id === u.id);
        if (i >= 0) arr[i] = u; else arr.push(u);
      });
      return arr;
    });
    return true;
  } catch (error) {
    console.error(`Error saving ${path} safely:`, error);
    return false;
  }
};

export const saveTasksChangesSafely = (upserts, deleteIds) =>
  applyChangesSafely('tasks', upserts, deleteIds);

export const saveAttendancesChangesSafely = (upserts, deleteIds) =>
  applyChangesSafely('attendances', upserts, deleteIds);

// ==================== LƯƠNG ====================
// Cấu trúc: salaries/<YYYY-MM>/<employeeId>/<field> = số do manager nhập
// Chỉ lưu các ô manager đã sửa; ô trống = dùng số tự tính.
export const saveSalaryField = async (month, employeeId, field, value) => {
  try {
    await dbSet(dbRef(db, `salaries/${month}/${employeeId}/${field}`), value === null ? null : value);
    return true;
  } catch (error) {
    console.error('Error saving salary:', error);
    return false;
  }
};

export const listenToSalariesChanges = (callback) => {
  const unsubscribe = dbOnValue(dbRef(db, 'salaries'), (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : {});
  }, (error) => {
    console.error('Error listening to salaries:', error);
  });
  return unsubscribe;
};

// ==================== BẢO MẬT: TÀI KHOẢN & QUYỀN TRUY CẬP ====================
import { auth, secondaryAuth, createUserWithEmailAndPassword, signOut as fbSignOut } from './firebase';

// Email làm khóa trong database (Firebase không cho dấu '.' trong khóa)
export const emailKey = (email) => (email || '').trim().toLowerCase().replace(/\./g, ',');

// Cấp / thu hồi quyền xem dữ liệu cho 1 email (chỉ manager ghi được)
export const setAllowedEmail = async (email, allowed) => {
  if (!email) return false;
  try {
    await dbSet(dbRef(db, `allowedEmails/${emailKey(email)}`), allowed ? true : null);
    return true;
  } catch (error) {
    console.error('Error setting allowed email:', error);
    return false;
  }
};

// Tạo tài khoản đăng nhập cho nhân viên (dùng app phụ để manager không bị đăng xuất)
// Trả về: 'created' | 'exists' | mã lỗi (vd 'auth/weak-password')
export const createAuthAccount = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(secondaryAuth, email.trim().toLowerCase(), password);
    await fbSignOut(secondaryAuth);
    return 'created';
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') return 'exists';
    return error.code || 'error';
  }
};

// Đọc danh sách nhân viên 1 lần (dùng khi đăng nhập)
export const fetchEmployeesOnce = async () => {
  const snapshot = await dbGet(dbRef(db, 'employees'));
  return snapshot.exists() ? toArray(snapshot.val()) : [];
};

export { auth };

// Ảnh QR nhận lương của từng nhân viên (lưu trong nhánh salaries -> chỉ manager xem được)
export const saveSalaryQR = async (employeeId, dataUrl) => {
  try {
    await dbSet(dbRef(db, `salaries/qr/${employeeId}`), dataUrl || null);
    return true;
  } catch (error) {
    console.error('Error saving QR:', error);
    return false;
  }
};
