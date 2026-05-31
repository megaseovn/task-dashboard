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
