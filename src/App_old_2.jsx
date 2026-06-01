import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Send, Bell, LogOut, X, ExternalLink, AlertTriangle, CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import {
  loadEmployeesFromFirebase,
  loadTasksFromFirebase,
  loadAttendancesFromFirebase,
  loadTaskTypesFromFirebase,
  loadProjectsFromFirebase,
  loadWorkStatusFromFirebase,
  loadCurrentUserFromFirebase,
  saveEmployeesToFirebase,
  saveTasksToFirebase,
  saveAttendancesToFirebase,
  saveTaskTypesToFirebase,
  saveProjectsToFirebase,
  saveWorkStatusToFirebase,
  saveCurrentUserToFirebase,
  listenToEmployeesChanges,
  listenToTasksChanges,
  listenToAttendancesChanges,
  listenToCurrentUserChanges,
  listenToTaskTypesChanges,
  listenToProjectsChanges,
  listenToWorkStatusChanges,
} from './firebase-service';

export default function TaskDashboard() {
  // ==================== LOCALSTORAGE HELPERS ====================
  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return defaultValue;
    }
  };

  const saveToLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  // ==================== STATE ====================
  const [currentUser, setCurrentUserState] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const setCurrentUser = (user) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  };
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [managerTab, setManagerTab] = useState('tasks');
  const [attendanceDateFrom, setAttendanceDateFrom] = useState('');
  const [attendanceDateTo, setAttendanceDateTo] = useState('');
  const [selectedAttendanceEmployee, setSelectedAttendanceEmployee] = useState('all');
  const [editingAttendanceId, setEditingAttendanceId] = useState(null);
  const [editAttendanceType, setEditAttendanceType] = useState('');
  const [toast, setToast] = useState(null);
  const [showAllEmployees, setShowAllEmployees] = useState(false);

  const [employees, setEmployeesState] = useState(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : [
      { id: 0, name: 'Manager', email: 'hoangducthien.3112@gmail.com', password: 'Thiencuc5715', role: 'manager', position: 'Quản lý', status: 'Nhân viên chính thức' },
      { id: 1, name: 'Nguyễn Văn A', email: 'nguyena@gmail.com', password: '123456', role: 'employee', position: 'SEO Leader', status: 'Nhân viên chính thức' },
      { id: 2, name: 'Trần Thị B', email: 'tranb@gmail.com', password: '123456', role: 'employee', position: 'Content', status: 'Nhân viên chính thức' },
    ];
  });

  const setEmployees = (data) => {
    setEmployeesState(data);
    localStorage.setItem('employees', JSON.stringify(data));
    saveEmployeesToFirebase(data);
  };

  const employeeStatusOptions = ['Thử việc', 'Thực tập sinh', 'Nhân viên chính thức', 'CTV', 'Đã nghỉ việc'];
  const positionOptions = ['Marketing', 'Content', 'Sale', 'SEO Leader'];

  const statusColorMap = {
    'Hoàn thành': 'bg-emerald-100 text-emerald-700',
    'Đang làm': 'bg-blue-100 text-blue-700',
    'Cần làm': 'bg-gray-100 text-gray-700',
    'Đang review': 'bg-amber-100 text-amber-700',
  };

  const [taskTypes, setTaskTypesState] = useState(() => {
    const saved = localStorage.getItem('taskTypes');
    return saved ? JSON.parse(saved) : ['Lập trình', 'Thiết kế', 'Testing', 'Documentation'];
  });

  const setTaskTypes = (data) => {
    setTaskTypesState(data);
    localStorage.setItem('taskTypes', JSON.stringify(data));
    saveTaskTypesToFirebase(data);
  };
  const [projects, setProjectsState] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : ['Website Redesign', 'Mobile App', 'API Integration'];
  });

  const setProjects = (data) => {
    setProjectsState(data);
    localStorage.setItem('projects', JSON.stringify(data));
    saveProjectsToFirebase(data);
  };
  const [workStatus, setWorkStatusState] = useState(() => {
    const saved = localStorage.getItem('workStatus');
    return saved ? JSON.parse(saved) : ['Cần làm', 'Đang làm', 'Hoàn thành', 'Đang review'];
  });

  const setWorkStatus = (data) => {
    setWorkStatusState(data);
    localStorage.setItem('workStatus', JSON.stringify(data));
    saveWorkStatusToFirebase(data);
  };
  const [tasks, setTasksState] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const setTasks = (data) => {
    setTasksState(data);
    localStorage.setItem('tasks', JSON.stringify(data));
    saveTasksToFirebase(data);
  };
  const [attendances, setAttendancesState] = useState(() => {
    const saved = localStorage.getItem('attendances');
    return saved ? JSON.parse(saved) : [];
  });

  const setAttendances = (data) => {
    setAttendancesState(data);
    localStorage.setItem('attendances', JSON.stringify(data));
    saveAttendancesToFirebase(data);
  };

  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    type: '',
    project: '',
    status: '',
    deadline: '',
    wordCount: '',
    assignee: '',
  });

  const [editTaskForm, setEditTaskForm] = useState({
    title: '',
    type: '',
    project: '',
    status: '',
    deadline: '',
    wordCount: '',
    assignee: '',
  });

  const [editEmployeeForm, setEditEmployeeForm] = useState({
    name: '',
    email: '',
    password: '',
    position: '',
    status: '',
  });

  const [newEmployeeForm, setNewEmployeeForm] = useState({
    name: '',
    position: 'Marketing',
    status: 'Nhân viên chính thức',
    email: '',
    password: '',
  });

  const [newTypeForm, setNewTypeForm] = useState('');
  const [newProjectForm, setNewProjectForm] = useState('');
  const [newStatusForm, setNewStatusForm] = useState('');
  const [commentText, setCommentText] = useState({});
  const [newLinkInput, setNewLinkInput] = useState({});
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPosition, setFilterPosition] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [editingTypeItem, setEditingTypeItem] = useState(null);
  const [editingProjectItem, setEditingProjectItem] = useState(null);
  const [editingStatusItem, setEditingStatusItem] = useState(null);
  const [editTypeValue, setEditTypeValue] = useState('');
  const [editProjectValue, setEditProjectValue] = useState('');
  const [editStatusValue, setEditStatusValue] = useState('');
  const [editingLinkTaskId, setEditingLinkTaskId] = useState(null);
  const [editWordCountTaskId, setEditWordCountTaskId] = useState(null);
  const [editWordCountValue, setEditWordCountValue] = useState('');
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceAction, setAttendanceAction] = useState(null);


  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'employees') {
        const updatedEmployees = JSON.parse(e.newValue);
        setEmployees(updatedEmployees);
      }
      if (e.key === 'currentUser') {
        const updatedUser = e.newValue ? JSON.parse(e.newValue) : null;
        setCurrentUser(updatedUser);
      }
      if (e.key === 'tasks') {
        const updatedTasks = JSON.parse(e.newValue);
        setTasks(updatedTasks);
      }
      if (e.key === 'attendances') {
        const updatedAttendances = JSON.parse(e.newValue);
        setAttendances(updatedAttendances);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  // ==================== FIREBASE REAL-TIME LISTENERS ====================
  useEffect(() => {
    const unsubscribeEmployees = listenToEmployeesChanges((remoteEmployees) => {
      setEmployeesState(remoteEmployees);
      localStorage.setItem('employees', JSON.stringify(remoteEmployees));
    });
    return () => unsubscribeEmployees();
  }, []);
// ==================== LOAD INITIAL DATA FROM FIREBASE ====================
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load taskTypes
        const savedTaskTypes = localStorage.getItem('taskTypes');
        if (savedTaskTypes) {
          setTaskTypesState(JSON.parse(savedTaskTypes));
        }
        
        // Load projects
        const savedProjects = localStorage.getItem('projects');
        if (savedProjects) {
          setProjectsState(JSON.parse(savedProjects));
        }
        
        // Load workStatus
        const savedWorkStatus = localStorage.getItem('workStatus');
        if (savedWorkStatus) {
          setWorkStatusState(JSON.parse(savedWorkStatus));
        }
        
        // Load employees
        const savedEmployees = localStorage.getItem('employees');
        if (savedEmployees) {
          setEmployeesState(JSON.parse(savedEmployees));
        }
        
        // Load tasks
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
          setTasksState(JSON.parse(savedTasks));
        }
        
        // Load attendances
        const savedAttendances = localStorage.getItem('attendances');
        if (savedAttendances) {
          setAttendancesState(JSON.parse(savedAttendances));
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    initializeData();
  }, []); // Only run once on mount

  useEffect(() => {
    const unsubscribeTasks = listenToTasksChanges((remoteTasks) => {
      setTasksState(remoteTasks);
      localStorage.setItem('tasks', JSON.stringify(remoteTasks));
    });
    return () => unsubscribeTasks();
  }, []);

  useEffect(() => {
    const unsubscribeAttendances = listenToAttendancesChanges((remoteAttendances) => {
      setAttendancesState(remoteAttendances);
      localStorage.setItem('attendances', JSON.stringify(remoteAttendances));
    });
    return () => unsubscribeAttendances();
  }, []);

  useEffect(() => {
    const unsubscribeCurrentUser = listenToCurrentUserChanges((remoteUser) => {
      if (remoteUser) {
        setCurrentUserState(remoteUser);
        localStorage.setItem('currentUser', JSON.stringify(remoteUser));
      }
    });
    return () => unsubscribeCurrentUser();
  }, []);

  // ==================== LISTENERS FOR SETUP DATA ====================
  useEffect(() => {
    const unsubscribeTaskTypes = listenToTaskTypesChanges((remoteTaskTypes) => {
      setTaskTypesState(remoteTaskTypes);
      localStorage.setItem('taskTypes', JSON.stringify(remoteTaskTypes));
    });
    return () => unsubscribeTaskTypes();
  }, []);

  useEffect(() => {
    const unsubscribeProjects = listenToProjectsChanges((remoteProjects) => {
      setProjectsState(remoteProjects);
      localStorage.setItem('projects', JSON.stringify(remoteProjects));
    });
    return () => unsubscribeProjects();
  }, []);

  useEffect(() => {
    const unsubscribeWorkStatus = listenToWorkStatusChanges((remoteWorkStatus) => {
      setWorkStatusState(remoteWorkStatus);
      localStorage.setItem('workStatus', JSON.stringify(remoteWorkStatus));
    });
    return () => unsubscribeWorkStatus();
  }, []);
  // ==================== UTILS ====================
  const today = new Date().toISOString().split('T')[0];
  
  const getDateInfo = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = date.getDay(); // 0=CN, 1=T2, ..., 6=T7
    return { date, dayOfWeek };
  };

  const isWeekday = (dateStr) => {
    const { dayOfWeek } = getDateInfo(dateStr);
    return dayOfWeek >= 1 && dayOfWeek <= 5; // T2-T6
  };

  const getUserName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.name : 'Unknown';
  };

  const isOverdue = (deadline, status) => {
    return new Date(deadline) < new Date() && status !== 'Hoàn thành';
  };

  const getTasksForDate = (dateStr, userId) => {
    return tasks.filter(t => 
      t.assignee === userId && 
      t.createdAt === dateStr
    );
  };

  const getTodayTasks = () => {
    if (!currentUser) return [];
    return getTasksForDate(today, currentUser.id);
  };

  const getTodayAttendance = () => {
    return attendances.find(a => a.date === today && a.userId === currentUser.id);
  };

  const getCurrentTaskStats = () => {
    if (!currentUser) return { total: 0, done: 0, inProgress: 0, overdue: 0 };
    const userTasks = tasks.filter(t => t.assignee === currentUser.id || t.createdBy === currentUser.id);
    return {
      total: userTasks.length,
      done: userTasks.filter(t => t.status === 'Hoàn thành').length,
      inProgress: userTasks.filter(t => t.status === 'Đang làm').length,
      overdue: userTasks.filter(t => isOverdue(t.deadline, t.status)).length,
    };
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    if (currentUser?.role === 'employee') {
      filtered = filtered.filter(t => t.assignee === currentUser.id || t.createdBy === currentUser.id);
    } else {
      if (filterEmployee !== 'all') filtered = filtered.filter(t => t.assignee === parseInt(filterEmployee));
      if (filterPosition !== 'all') {
        const empsByPosition = employees.filter(e => e.position === filterPosition).map(e => e.id);
        filtered = filtered.filter(t => empsByPosition.includes(t.assignee));
      }
    }
    if (filterProject !== 'all') filtered = filtered.filter(t => t.project === filterProject);
    if (filterStatus !== 'all') filtered = filtered.filter(t => t.status === filterStatus);
    if (filterDateFrom) filtered = filtered.filter(t => t.deadline >= filterDateFrom);
    if (filterDateTo) filtered = filtered.filter(t => t.deadline <= filterDateTo);
    return filtered;
  };

  // ==================== ATTENDANCE CALCULATIONS ====================
  const calculateWorkDays = (userId, dateFromStr, dateToStr) => {
    let userAttendances = attendances.filter(a => a.userId === userId);
    
    if (dateFromStr) userAttendances = userAttendances.filter(a => a.date >= dateFromStr);
    if (dateToStr) userAttendances = userAttendances.filter(a => a.date <= dateToStr);

    let fullDays = 0;
    let halfDays = 0;
    let otDays = 0;

    userAttendances.forEach(att => {
      if (att.type === 'full_day') fullDays += 1;
      else if (att.type === 'half_morning' || att.type === 'half_afternoon') halfDays += 1;
      else if (att.type === 'ot_half') otDays += 0.5;
    });

    return {
      fullDays,
      halfDays,
      totalWorkDays: fullDays + (halfDays / 2) + otDays,
      otDays
    };
  };

  const calculateParkingDays = (userId, dateFromStr, dateToStr) => {
    let userAttendances = attendances.filter(a => 
      a.userId === userId && isWeekday(a.date)
    );
    
    if (dateFromStr) userAttendances = userAttendances.filter(a => a.date >= dateFromStr);
    if (dateToStr) userAttendances = userAttendances.filter(a => a.date <= dateToStr);

    let parkingDays = 0;

    userAttendances.forEach(att => {
      if (att.type === 'full_day') parkingDays += 1;
      else if (att.type === 'half_morning' || att.type === 'half_afternoon') parkingDays += 1;
    });

    return parkingDays;
  };

  const getTaskCoverage = (userId, dateFromStr, dateToStr) => {
    let monthTasks = tasks.filter(t => t.assignee === userId);
    
    if (dateFromStr) monthTasks = monthTasks.filter(t => t.createdAt >= dateFromStr);
    if (dateToStr) monthTasks = monthTasks.filter(t => t.createdAt <= dateToStr);
    
    let monthAttendances = attendances.filter(a => a.userId === userId);
    
    if (dateFromStr) monthAttendances = monthAttendances.filter(a => a.date >= dateFromStr);
    if (dateToStr) monthAttendances = monthAttendances.filter(a => a.date <= dateToStr);
    
    const attendanceDates = monthAttendances.map(a => a.date);
    const taskDates = [...new Set(monthTasks.map(t => t.createdAt))];
    
    const missingDates = attendanceDates.filter(date => !taskDates.includes(date));
    
    return {
      total: attendanceDates.length,
      withTasks: attendanceDates.filter(date => taskDates.includes(date)).length,
      missing: missingDates
    };
  };

  // ==================== HANDLERS ====================
  const handleLogin = (e) => {
    e.preventDefault();
    const emp = employees.find(e => e.email === loginEmail && e.password === loginPassword);
    if (emp) {
      setCurrentUser(emp);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      alert('Email hoặc password không đúng!');
    }
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployeeForm.name || !newEmployeeForm.email || !newEmployeeForm.password || !newEmployeeForm.position || !newEmployeeForm.status) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    const newId = Math.max(...employees.map(e => e.id), 0) + 1;
    setEmployees([...employees, { ...newEmployeeForm, id: newId, role: 'employee' }]);
    setNewEmployeeForm({ name: '', position: 'Lập trình viên', status: 'Nhân viên chính thức', email: '', password: '' });
    alert('Tạo nhân viên thành công!');
  };

  const handleOpenEditEmployee = (emp) => {
    setEditingEmployeeId(emp.id);
    setEditEmployeeForm({
      name: emp.name,
      email: emp.email,
      password: emp.password,
      position: emp.position,
      status: emp.status,
    });
  };

  const handleSaveEditEmployee = (empId) => {
    const updatedEmployees = employees.map(e => e.id === empId ? { ...e, ...editEmployeeForm } : e);
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    setEditingEmployeeId(null);
    alert('Cập nhật nhân viên thành công!');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskForm.title || !newTaskForm.type || !newTaskForm.project || !newTaskForm.status || !newTaskForm.deadline) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    const assignee = currentUser.role === 'manager' && newTaskForm.assignee ? parseInt(newTaskForm.assignee) : (currentUser.role === 'employee' ? currentUser.id : null);
    const newId = Math.max(...tasks.map(t => t.id || 0), 0) + 1;
    setTasks([...tasks, {
      id: newId,
      ...newTaskForm,
      assignee: assignee,
      wordCount: newTaskForm.wordCount || '0',
      links: [],
      comments: [],
      createdBy: currentUser.id,
      createdAt: new Date().toISOString().split('T')[0],
    }]);
    setNewTaskForm({ title: '', type: '', project: '', status: '', deadline: '', wordCount: '', assignee: '' });
    alert('Tạo task thành công!');
  };

  const handleQuickAttendance = (type) => {
    const todayTasks = getTodayTasks();
    
    if (todayTasks.length === 0) {
      setAttendanceAction(type);
      setShowAttendanceModal(true);
    } else {
      handleSaveAttendance(type);
    }
  };

  const handleSaveAttendance = (type) => {
    const newId = Math.max(...attendances.map(a => a.id || 0), 0) + 1;
    const newAttendance = {
      id: newId,
      userId: currentUser.id,
      date: today,
      type: type,
      createdAt: new Date().toISOString()
    };
    setAttendances([...attendances, newAttendance]);
    setShowAttendanceModal(false);
    setAttendanceAction(null);
    
    // Show toast notification with 7 motivational messages
    const messages = [
      { text: "Điểm danh thành công! Nạp năng lượng, bật chế độ 'chiến thần' thôi nào! 🔥", icon: '😄' },
      { text: "Check-in thành công! Chúc bạn một ngày làm việc 'hết nước chấm' 💪", icon: '😆' },
      { text: "Điểm danh xong rồi, giờ thì cùng nhau tạo ra kỳ tích thôi nào! 🚀", icon: '🥳' },
      { text: "Điểm danh thành công! Bạn đã bắt đầu ngày mới với 100% năng lượng. Tiến lên! 💥", icon: '😍' },
      { text: "Điểm danh thành công. Sẵn sàng bùng nổ! 🎊", icon: '🤩' },
      { text: "Đã điểm danh! Cứ bình tĩnh, việc gì rồi cũng sẽ xong... vào cuối ngày! 😎", icon: '😎' },
      { text: "Điểm danh thành công! Thế giới cần bạn, và công ty cần sự bùng nổ của bạn hôm nay! 🌈", icon: '😊' }
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setToast(randomMessage);
  };

  const handleEditAttendance = (attendanceId, currentType) => {
    setEditingAttendanceId(attendanceId);
    setEditAttendanceType(currentType);
  };

  const handleSaveEditAttendance = (attendanceId) => {
    setAttendances(attendances.map(a => 
      a.id === attendanceId ? { ...a, type: editAttendanceType } : a
    ));
    setEditingAttendanceId(null);
    setEditAttendanceType('');
    
    // Show toast notification with 7 motivational messages
    const messages = [
      { text: "Điểm danh thành công! Nạp năng lượng, bật chế độ 'chiến thần' thôi nào! 🔥", icon: '😄' },
      { text: "Check-in thành công! Chúc bạn một ngày làm việc 'hết nước chấm' 💪", icon: '😆' },
      { text: "Điểm danh xong rồi, giờ thì cùng nhau tạo ra kỳ tích thôi nào! 🚀", icon: '🥳' },
      { text: "Điểm danh thành công! Bạn đã bắt đầu ngày mới với 100% năng lượng. Tiến lên! 💥", icon: '😍' },
      { text: "Điểm danh thành công. Sẵn sàng bùng nổ! 🎊", icon: '🤩' },
      { text: "Đã điểm danh! Cứ bình tĩnh, việc gì rồi cũng sẽ xong... vào cuối ngày! 😎", icon: '😎' },
      { text: "Điểm danh thành công! Thế giới cần bạn, và công ty cần sự bùng nổ của bạn hôm nay! 🌈", icon: '😊' }
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setToast(randomMessage);
  };

  const handleCreateTaskQuick = (type) => {
    setNewTaskForm({
      title: `📋 Task ${today}`,
      type: 'Report',
      project: 'Daily Work',
      status: 'Cần làm',
      deadline: today,
      wordCount: '0',
      assignee: currentUser.id
    });
    // Focus vào modal tạo task
    setShowAttendanceModal(false);
  };

  const handleQuickComplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== 'Hoàn thành') {
      handleUpdateTask(taskId, { status: 'Hoàn thành' });
    }
  };

  const handleAddLink = (taskId) => {
    if (!newLinkInput[taskId]) return;
    const task = tasks.find(t => t.id === taskId);
    const newLinks = [...(task.links || []), { url: newLinkInput[taskId], date: new Date().toLocaleDateString('vi-VN') }];
    handleUpdateTask(taskId, { links: newLinks });
    setNewLinkInput({ ...newLinkInput, [taskId]: '' });
  };

  const handleDeleteLink = (taskId, linkIndex) => {
    const task = tasks.find(t => t.id === taskId);
    const newLinks = task.links.filter((_, i) => i !== linkIndex);
    handleUpdateTask(taskId, { links: newLinks });
  };

  const handleUpdateWordCount = (taskId, value) => {
    handleUpdateTask(taskId, { wordCount: value });
    setEditWordCountTaskId(null);
  };

  const handleOpenEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditTaskForm({
      title: task.title,
      type: task.type,
      project: task.project,
      status: task.status,
      deadline: task.deadline,
      wordCount: task.wordCount || '0',
      assignee: task.assignee || '',
    });
  };

  const handleDeleteTask = (taskId) => {
  console.log("🗑️ Deleting task:", taskId);
  if (window.confirm('Bạn chắc chắn muốn xóa task này?')) {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    console.log("✅ Task deleted successfully");
  }
};

  const handleUpdateTask = (id, updates) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleExportCSV = () => {
    const headers = ['Tiêu đề', 'Loại', 'Dự án', 'Nhân viên', 'Trạng thái', 'Hạn', 'Số từ', 'Links'];
    const rows = filteredTasks.map(task => [
      task.title,
      task.type,
      task.project,
      task.assignee ? getUserName(task.assignee) : '-',
      task.status,
      task.deadline,
      task.wordCount || '0',
      task.links && task.links.length > 0 ? task.links.map(l => l.url).join('; ') : '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const handleCopyCSV = () => {
    const headers = ['Tiêu đề', 'Loại', 'Dự án', 'Nhân viên', 'Trạng thái', 'Hạn', 'Số từ', 'Links'];
    const rows = filteredTasks.map(task => [
      task.title,
      task.type,
      task.project,
      task.assignee ? getUserName(task.assignee) : '-',
      task.status,
      task.deadline,
      task.wordCount || '0',
      task.links && task.links.length > 0 ? task.links.map(l => l.url).join('; ') : '-'
    ]);

    const csvContent = [
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n');

    navigator.clipboard.writeText(csvContent).then(() => {
      setToast({
        text: '✅ Đã copy! Paste vào Google Sheet hoặc Excel',
        icon: '📋'
      });
      setTimeout(() => setToast(null), 3000);
    });
  };

  const handleExportExcel = async () => {
    try {
      // Dynamic import XLSX from CDN
      const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js');
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js';
      script.onload = () => {
        const XLSX = window.XLSX;
        
        const headers = ['Tiêu đề', 'Loại', 'Dự án', 'Nhân viên', 'Trạng thái', 'Hạn', 'Số từ', 'Links'];
        const rows = filteredTasks.map(task => [
          task.title,
          task.type,
          task.project,
          task.assignee ? getUserName(task.assignee) : '-',
          task.status,
          task.deadline,
          task.wordCount || '0',
          task.links && task.links.length > 0 ? task.links.map(l => l.url).join('; ') : '-'
        ]);

        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
        XLSX.writeFile(wb, `tasks_${new Date().toISOString().split('T')[0]}.xlsx`);
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      handleExportCSV(); // Fallback to CSV
    }
  };

  const handleDeleteType = (type) => {
    if (window.confirm(`Xóa loại task "${type}"?`)) {
      setTaskTypes(taskTypes.filter(t => t !== type));
    }
  };

  const handleDeleteProject = (project) => {
    if (window.confirm(`Xóa dự án "${project}"?`)) {
      setProjects(projects.filter(p => p !== project));
    }
  };

  const handleDeleteStatus = (status) => {
    if (window.confirm(`Xóa trạng thái "${status}"?`)) {
      setWorkStatus(workStatus.filter(s => s !== status));
    }
  };

  const handleEditType = (oldType) => {
    setEditingTypeItem(oldType);
    setEditTypeValue(oldType);
  };

  const handleSaveEditType = () => {
    if (!editTypeValue.trim()) return;
    setTaskTypes(taskTypes.map(t => t === editingTypeItem ? editTypeValue : t));
    setEditingTypeItem(null);
    setEditTypeValue('');
  };

  const handleEditProject = (oldProject) => {
    setEditingProjectItem(oldProject);
    setEditProjectValue(oldProject);
  };

  const handleSaveEditProject = () => {
    if (!editProjectValue.trim()) return;
    setProjects(projects.map(p => p === editingProjectItem ? editProjectValue : p));
    setTasks(tasks.map(t => t.project === editingProjectItem ? { ...t, project: editProjectValue } : t));
    setEditingProjectItem(null);
    setEditProjectValue('');
  };

  const handleEditStatus = (oldStatus) => {
    setEditingStatusItem(oldStatus);
    setEditStatusValue(oldStatus);
  };

  const handleSaveEditStatus = () => {
    if (!editStatusValue.trim()) return;
    setWorkStatus(workStatus.map(s => s === editingStatusItem ? editStatusValue : s));
    setTasks(tasks.map(t => t.status === editingStatusItem ? { ...t, status: editStatusValue } : t));
    setEditingStatusItem(null);
    setEditStatusValue('');
  };

  const handleAddComment = (taskId) => {
    if (!commentText[taskId]) return;
    const task = tasks.find(t => t.id === taskId);
    const newComments = [...(task.comments || []), {
      user: currentUser.name,
      text: commentText[taskId],
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    }];
    handleUpdateTask(taskId, { comments: newComments });
    setCommentText({ ...commentText, [taskId]: '' });
  };

  const handleAddType = (e) => {
    e.preventDefault();
    if (newTypeForm && !taskTypes.includes(newTypeForm)) {
      setTaskTypes([...taskTypes, newTypeForm]);
      setNewTypeForm('');
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (newProjectForm && !projects.includes(newProjectForm)) {
      setProjects([...projects, newProjectForm]);
      setNewProjectForm('');
    }
  };

  const handleAddStatus = (e) => {
    e.preventDefault();
    if (newStatusForm && !workStatus.includes(newStatusForm)) {
      setWorkStatus([...workStatus, newStatusForm]);
      setNewStatusForm('');
    }
  };

  // ==================== LOGIN PAGE ====================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                🚀 MEGA SEO
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                📊 Quản Lý Công Việc
              </h1>
              <p className="text-gray-500">Đăng nhập vào hệ thống</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all"
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ==================== MANAGER DASHBOARD ====================
  if (currentUser.role === 'manager') {
    const filteredTasks = getFilteredTasks();

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              📊 Manager Panel
            </h1>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-700">👋 {currentUser.name}</span>
              </div>
              <button
                onClick={() => setCurrentUser(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex gap-4">
              <button
                onClick={() => setManagerTab('tasks')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  managerTab === 'tasks'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📋 Tasks
              </button>
              <button
                onClick={() => setManagerTab('attendance')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  managerTab === 'attendance'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📊 Attendance Report
              </button>
            </div>
          </div>

          {/* TASKS TAB */}
          {managerTab === 'tasks' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                  <p className="text-white/80 text-sm mb-2">Tổng Tasks</p>
                  <p className="text-3xl font-bold">{tasks.length}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                  <p className="text-white/80 text-sm mb-2">Hoàn thành</p>
                  <p className="text-3xl font-bold">{tasks.filter(t => t.status === 'Hoàn thành').length}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-6 text-white shadow-lg">
                  <p className="text-white/80 text-sm mb-2">Đang làm</p>
                  <p className="text-3xl font-bold">{tasks.filter(t => t.status === 'Đang làm').length}</p>
                </div>
                <div className="bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl p-6 text-white shadow-lg">
                  <p className="text-white/80 text-sm mb-2">Quá hạn</p>
                  <p className="text-3xl font-bold">{tasks.filter(t => isOverdue(t.deadline, t.status)).length}</p>
                </div>
              </div>

              {/* Create Task, Setup, Add Employee */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create Task */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">➕ Tạo Task</h3>
                  <form onSubmit={handleAddTask} className="space-y-3 text-sm">
                    <input
                      type="text"
                      placeholder="Tiêu đề task"
                      value={newTaskForm.title}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newTaskForm.type}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Loại task</option>
                      {taskTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select
                      value={newTaskForm.project}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, project: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Dự án</option>
                      {projects.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select
                      value={newTaskForm.status}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Trạng thái</option>
                      {workStatus.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                      value={newTaskForm.assignee}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, assignee: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Giao cho</option>
                      <option value={currentUser.id}>👤 Tôi ({currentUser.name})</option>
                      {employees.filter(e => e.role === 'employee').map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={newTaskForm.deadline}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, deadline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Tạo Task
                    </button>
                  </form>
                </div>

                {/* Setup */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 overflow-y-auto max-h-96">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">⚙️ Setup</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Loại Task</label>
                      <form onSubmit={handleAddType} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newTypeForm}
                          onChange={(e) => setNewTypeForm(e.target.value)}
                          placeholder="Thêm"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+</button>
                      </form>
                      <div className="space-y-1">
                        {taskTypes.map((t, i) => (
                          <div key={i} className="flex items-center justify-between bg-blue-50 px-2 py-1 rounded text-xs">
                            <span className="text-blue-700">{t}</span>
                            <div className="flex gap-1">
                              <button onClick={() => handleEditType(t)} className="text-blue-600 hover:text-blue-700">✏️</button>
                              <button onClick={() => handleDeleteType(t)} className="text-red-600 hover:text-red-700">✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Dự án</label>
                      <form onSubmit={handleAddProject} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newProjectForm}
                          onChange={(e) => setNewProjectForm(e.target.value)}
                          placeholder="Thêm"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+</button>
                      </form>
                      <div className="space-y-1">
                        {projects.map((p, i) => (
                          <div key={i} className="flex items-center justify-between bg-emerald-50 px-2 py-1 rounded text-xs">
                            <span className="text-emerald-700">{p}</span>
                            <div className="flex gap-1">
                              <button onClick={() => handleEditProject(p)} className="text-blue-600 hover:text-blue-700">✏️</button>
                              <button onClick={() => handleDeleteProject(p)} className="text-red-600 hover:text-red-700">✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Trạng thái</label>
                      <form onSubmit={handleAddStatus} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newStatusForm}
                          onChange={(e) => setNewStatusForm(e.target.value)}
                          placeholder="Thêm"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+</button>
                      </form>
                      <div className="space-y-1">
                        {workStatus.map((s, i) => (
                          <div key={i} className="flex items-center justify-between bg-amber-50 px-2 py-1 rounded text-xs">
                            <span className="text-amber-700">{s}</span>
                            <div className="flex gap-1">
                              <button onClick={() => handleEditStatus(s)} className="text-blue-600 hover:text-blue-700">✏️</button>
                              <button onClick={() => handleDeleteStatus(s)} className="text-red-600 hover:text-red-700">✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add Employee */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">➕ Nhân viên</h3>
                  <form onSubmit={handleAddEmployee} className="space-y-3 text-sm">
                    <input
                      type="text"
                      placeholder="Tên"
                      value={newEmployeeForm.name}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newEmployeeForm.position}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {positionOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select
                      value={newEmployeeForm.status}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {employeeStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input
                      type="email"
                      placeholder="Email"
                      value={newEmployeeForm.email}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="Mật khẩu"
                      value={newEmployeeForm.password}
                      onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Tạo
                    </button>
                  </form>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-700">Danh sách:</p>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showAllEmployees}
                          onChange={(e) => setShowAllEmployees(e.target.checked)}
                          className="w-3 h-3 rounded"
                        />
                        <span className="text-gray-600">Tất cả</span>
                      </label>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                      {employees.filter(e => e.role === 'employee' && (showAllEmployees || e.status !== 'Đã nghỉ việc')).map(e => (
                        <div key={e.id} className={`p-3 rounded border flex justify-between items-start ${e.status === 'Đã nghỉ việc' ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{e.name}</p>
                            <div className="space-y-1 mt-1">
                              <p className="text-gray-600">📍 {e.position}</p>
                              <p className={`text-xs font-semibold ${e.status === 'Đã nghỉ việc' ? 'text-red-700' : 'text-emerald-700'}`}>{e.status}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <button onClick={() => handleOpenEditEmployee(e)} className="text-blue-600 hover:text-blue-700">✏️</button>
                            <button onClick={() => {
                              if (window.confirm(`Bạn chắc chắn muốn xóa ${e.name}?`)) {
                                const updatedEmployees = employees.filter(emp => emp.id !== e.id);
                                setEmployees(updatedEmployees);
                                localStorage.setItem('employees', JSON.stringify(updatedEmployees));
                              }
                            }} className="text-red-600 hover:text-red-700">🗑️</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Tasks */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🔍 Lọc Tasks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                  <select
                    value={filterEmployee}
                    onChange={(e) => setFilterEmployee(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Nhân viên: Tất cả</option>
                    {employees.filter(e => e.role === 'employee').map(e => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                  <select
                    value={filterPosition}
                    onChange={(e) => setFilterPosition(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Vị trí: Tất cả</option>
                    {positionOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Dự án: Tất cả</option>
                    {projects.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Trạng thái: Tất cả</option>
                    {workStatus.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Tasks Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">📋 Tasks ({filteredTasks.length})</h3>
                    <p className="text-sm text-gray-600">📝 Tổng từ: {filteredTasks.reduce((sum, task) => sum + parseInt(task.wordCount || 0), 0).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportExcel}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm flex items-center gap-2 transition-colors"
                      title="Xuất file Excel (.xlsx)"
                    >
                      📥 Xuất Excel
                    </button>
                    <button
                      onClick={handleCopyCSV}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm flex items-center gap-2 transition-colors"
                      title="Copy CSV để paste vào Google Sheet"
                    >
                      📋 Copy CSV
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Tiêu đề</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Loại</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Dự án</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Nhân viên</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Trạng thái</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Hạn</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Số từ</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Links</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredTasks.map(task => (
                        <tr key={task.id} className={isOverdue(task.deadline, task.status) ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}>
                          <td className="px-4 py-2 text-gray-900 font-medium">{task.title} {isOverdue(task.deadline, task.status) && <AlertTriangle className="inline w-4 h-4 text-red-600 ml-1" />}</td>
                          <td className="px-4 py-2 text-xs"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{task.type}</span></td>
                          <td className="px-4 py-2 text-gray-600">{task.project}</td>
                          <td className="px-4 py-2 text-gray-600">{task.assignee ? getUserName(task.assignee) : '-'}</td>
                          <td className="px-4 py-2"><span className={`px-2 py-1 rounded text-xs font-semibold ${statusColorMap[task.status] || 'bg-gray-100'}`}>{task.status}</span></td>
                          <td className="px-4 py-2 text-gray-600">{task.deadline}</td>
                          <td className="px-4 py-2 font-semibold text-blue-700">{task.wordCount || '0'} từ</td>
                          <td className="px-4 py-2 text-xs">
                            {task.links && task.links.length > 0 ? (
                              <div className="space-y-1">
                                {task.links.map((link, idx) => (
                                  <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 break-all"
                                  >
                                    🔗 Link {idx + 1}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-2 space-x-1">
                            <button onClick={() => handleOpenEditTask(task)} className="text-blue-600 hover:text-blue-700">✏️</button>
                            <button onClick={() => handleDeleteTask(task.id)} className="text-red-600 hover:text-red-700">🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ATTENDANCE TAB */}
          {managerTab === 'attendance' && (
            <>
              {/* Filter */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Từ ngày</label>
                    <input
                      type="date"
                      value={attendanceDateFrom}
                      onChange={(e) => setAttendanceDateFrom(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Đến ngày</label>
                    <input
                      type="date"
                      value={attendanceDateTo}
                      onChange={(e) => setAttendanceDateTo(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Nhân viên</label>
                    <select
                      value={selectedAttendanceEmployee}
                      onChange={(e) => setSelectedAttendanceEmployee(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tất cả</option>
                      {employees.filter(e => e.role === 'employee').map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Attendance Report */}
              <div className="space-y-6">
                {(selectedAttendanceEmployee === 'all' 
                  ? employees.filter(e => e.role === 'employee')
                  : employees.filter(e => e.id === parseInt(selectedAttendanceEmployee))
                ).map(emp => {
                  const workDays = calculateWorkDays(emp.id, attendanceDateFrom, attendanceDateTo);
                  const parkingDays = calculateParkingDays(emp.id, attendanceDateFrom, attendanceDateTo);
                  const taskCoverage = getTaskCoverage(emp.id, attendanceDateFrom, attendanceDateTo);
                  const parkingCost = parkingDays * 4000;

                  return (
                    <div key={emp.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-4 text-white">
                        <h3 className="text-lg font-bold">{emp.name} - {emp.position}</h3>
                        <p className="text-sm opacity-90">
                          {attendanceDateFrom ? attendanceDateFrom : 'Từ đầu'} - {attendanceDateTo ? attendanceDateTo : 'Đến nay'}
                        </p>
                      </div>

                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Work Days Stats */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Thống kê ngày công
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between p-2 bg-blue-50 rounded">
                              <span className="text-gray-700">Cả ngày:</span>
                              <span className="font-bold text-gray-900">{workDays.fullDays} ngày</span>
                            </div>
                            <div className="flex justify-between p-2 bg-amber-50 rounded">
                              <span className="text-gray-700">Nửa ngày:</span>
                              <span className="font-bold text-gray-900">{workDays.halfDays} buổi</span>
                            </div>
                            <div className="flex justify-between p-2 bg-purple-50 rounded">
                              <span className="text-gray-700">OT (0.5):</span>
                              <span className="font-bold text-gray-900">{workDays.otDays} ngày</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded border border-green-200">
                              <span className="text-gray-900 font-bold">Tổng ngày công:</span>
                              <span className="font-bold text-emerald-700 text-lg">{workDays.totalWorkDays.toFixed(1)} ngày</span>
                            </div>
                          </div>
                        </div>

                        {/* Parking Days Stats */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                            Tiền gửi xe (T2-T6)
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between p-2 bg-emerald-50 rounded">
                              <span className="text-gray-700">Buổi trực tiếp:</span>
                              <span className="font-bold text-gray-900">{parkingDays} buổi</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded border border-amber-200">
                              <span className="text-gray-900 font-bold">Tiền tính:</span>
                              <span className="font-bold text-orange-700 text-lg">{parkingDays} × 4k = {(parkingCost / 1000).toFixed(0)}k VND</span>
                            </div>
                          </div>
                        </div>

                        {/* Task Coverage */}
                        <div className="space-y-4 md:col-span-2">
                          <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            Báo cáo công việc
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between p-2 bg-blue-50 rounded">
                              <span className="text-gray-700">Ngày có điểm danh:</span>
                              <span className="font-bold text-gray-900">{taskCoverage.total} ngày</span>
                            </div>
                            <div className="flex justify-between p-2 bg-emerald-50 rounded">
                              <span className="text-gray-700">Ngày có task:</span>
                              <span className="font-bold text-emerald-700">{taskCoverage.withTasks} / {taskCoverage.total}</span>
                            </div>
                            {taskCoverage.missing.length > 0 ? (
                              <div className="p-2 bg-red-50 rounded border border-red-200">
                                <p className="text-red-700 font-semibold mb-1">⚠️ Ngày chưa báo cáo công việc:</p>
                                <p className="text-red-600 text-xs">{taskCoverage.missing.join(', ')}</p>
                              </div>
                            ) : (
                              <div className="p-2 bg-green-50 rounded border border-green-200">
                                <p className="text-green-700 font-semibold">✅ Tất cả ngày đều có task</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SUMMARY */}
              {selectedAttendanceEmployee === 'all' && (
                <div className="bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    📊 TỔNG HỢP {attendanceDateFrom ? attendanceDateFrom : 'Từ đầu'} - {attendanceDateTo ? attendanceDateTo : 'Đến nay'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                      <p className="text-white/80 text-sm mb-1">Tổng tiền gửi xe</p>
                      <p className="text-3xl font-bold">
                        {(employees.filter(e => e.role === 'employee').reduce((sum, emp) => 
                          sum + calculateParkingDays(emp.id, attendanceDateFrom, attendanceDateTo) * 4000, 0) / 1000000).toFixed(1)}M VND
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                      <p className="text-white/80 text-sm mb-1">Tổng buổi trực tiếp</p>
                      <p className="text-3xl font-bold">
                        {employees.filter(e => e.role === 'employee').reduce((sum, emp) => 
                          sum + calculateParkingDays(emp.id, attendanceDateFrom, attendanceDateTo), 0)} buổi
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                      <p className="text-white/80 text-sm mb-1">Nhân viên báo cáo đầy đủ</p>
                      <p className="text-3xl font-bold">
                        {employees.filter(e => e.role === 'employee').filter(emp => {
                          const coverage = getTaskCoverage(emp.id, attendanceDateFrom, attendanceDateTo);
                          return coverage.missing.length === 0 && coverage.total > 0;
                        }).length} / {employees.filter(e => e.role === 'employee').length}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Modals */}
          {editingTypeItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">✏️ Sửa Loại Task</h3>
                <input
                  type="text"
                  value={editTypeValue}
                  onChange={(e) => setEditTypeValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveEditType} className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">Lưu</button>
                  <button onClick={() => setEditingTypeItem(null)} className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400">Hủy</button>
                </div>
              </div>
            </div>
          )}

          {editingProjectItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">✏️ Sửa Dự án</h3>
                <input
                  type="text"
                  value={editProjectValue}
                  onChange={(e) => setEditProjectValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveEditProject} className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">Lưu</button>
                  <button onClick={() => setEditingProjectItem(null)} className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400">Hủy</button>
                </div>
              </div>
            </div>
          )}

          {editingStatusItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">✏️ Sửa Trạng thái</h3>
                <input
                  type="text"
                  value={editStatusValue}
                  onChange={(e) => setEditStatusValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveEditStatus} className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">Lưu</button>
                  <button onClick={() => setEditingStatusItem(null)} className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400">Hủy</button>
                </div>
              </div>
            </div>
          )}

          {editingEmployeeId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">✏️ Sửa Nhân viên</h3>
                <div className="space-y-3 mb-4">
                  <input type="text" placeholder="Tên" value={editEmployeeForm.name} onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  <input type="email" placeholder="Email" value={editEmployeeForm.email} onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  <input type="password" placeholder="Mật khẩu" value={editEmployeeForm.password} onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, password: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  <select value={editEmployeeForm.position} onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, position: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    {positionOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select value={editEmployeeForm.status} onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    {employeeStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveEditEmployee(editingEmployeeId)} className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">Lưu</button>
                  <button onClick={() => setEditingEmployeeId(null)} className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400">Hủy</button>
                </div>
              </div>
            </div>
          )}

          {editingTaskId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-96 overflow-y-auto">
                <h3 className="text-lg font-bold text-gray-900 mb-4">✏️ Sửa Task</h3>
                <div className="space-y-3 mb-4">
                  <input type="text" value={editTaskForm.title} onChange={(e) => setEditTaskForm({ ...editTaskForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  <select value={editTaskForm.type} onChange={(e) => setEditTaskForm({ ...editTaskForm, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    {taskTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select value={editTaskForm.project} onChange={(e) => setEditTaskForm({ ...editTaskForm, project: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    {projects.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select value={editTaskForm.status} onChange={(e) => setEditTaskForm({ ...editTaskForm, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    {workStatus.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select value={editTaskForm.assignee} onChange={(e) => setEditTaskForm({ ...editTaskForm, assignee: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="">Không giao</option>
                    <option value={currentUser.id}>👤 Tôi ({currentUser.name})</option>
                    {employees.filter(e => e.role === 'employee').map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                  <input type="date" value={editTaskForm.deadline} onChange={(e) => setEditTaskForm({ ...editTaskForm, deadline: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  <input type="number" placeholder="Số từ" value={editTaskForm.wordCount} onChange={(e) => setEditTaskForm({ ...editTaskForm, wordCount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveEditTask(editingTaskId)} className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">Lưu</button>
                  <button onClick={() => setEditingTaskId(null)} className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400">Hủy</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ==================== EMPLOYEE DASHBOARD ====================
  const userTasks = getFilteredTasks();
  const stats = getCurrentTaskStats();
  const todayTasks = getTodayTasks();
  const todayAttendance = getTodayAttendance();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            📊 My Tasks
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg text-sm">
              <span className="text-gray-700">👋 {currentUser.name}</span>
            </div>
            <button onClick={() => setCurrentUser(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999]" onClick={() => setToast(null)}>
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl border-4 border-yellow-300 relative">
              <div className="bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 rounded-2xl p-8">
                <div className="flex items-center gap-6 justify-center text-center">
                  <span className="text-8xl animate-bounce">{toast.icon}</span>
                  <div>
                    <p className="font-bold text-2xl text-white drop-shadow-lg leading-relaxed">{toast.text}</p>
                  </div>
                  <span className="text-8xl animate-bounce" style={{animationDelay: '0.2s'}}>🎊</span>
                </div>
                <div className="flex gap-4 mt-6 justify-center">
                  <button
                    onClick={() => setToast(null)}
                    className="bg-white text-purple-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all text-lg shadow-lg"
                  >
                    ✓ OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-3 text-white shadow-lg">
            <p className="text-white/80 text-xs mb-1">Tổng</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl p-3 text-white shadow-lg">
            <p className="text-white/80 text-xs mb-1">Hoàn thành</p>
            <p className="text-2xl font-bold">{stats.done}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-3 text-white shadow-lg">
            <p className="text-white/80 text-xs mb-1">Đang làm</p>
            <p className="text-2xl font-bold">{stats.inProgress}</p>
          </div>
          <div className="bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl p-3 text-white shadow-lg">
            <p className="text-white/80 text-xs mb-1">Quá hạn</p>
            <p className="text-2xl font-bold">{stats.overdue}</p>
          </div>
        </div>

        {/* Attendance Quick Checkin */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">⏰ Điểm danh - {today}</h3>
          
          {todayAttendance ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
              <p className="text-emerald-700 font-semibold">✅ Hôm nay bạn đã điểm danh</p>
              <p className="text-emerald-600 text-sm mb-3">Loại: {
                todayAttendance.type === 'full_day' ? '🕐 Cả ngày' :
                todayAttendance.type === 'half_morning' ? '🌅 Nửa ngày (Sáng)' :
                todayAttendance.type === 'half_afternoon' ? '🌆 Nửa ngày (Chiều)' :
                '⚡ OT (0.5 ngày)'
              }</p>
              <button
                onClick={() => handleEditAttendance(todayAttendance.id, todayAttendance.type)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
              >
                ↻ Điều chỉnh lại
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Chọn loại điểm danh:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleQuickAttendance('full_day')}
                  className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg transition-colors"
                >
                  🕐 Cả ngày
                </button>
                <button
                  onClick={() => handleQuickAttendance('half_morning')}
                  className="p-3 bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold rounded-lg transition-colors"
                >
                  🌅 Sáng
                </button>
                <button
                  onClick={() => handleQuickAttendance('half_afternoon')}
                  className="p-3 bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold rounded-lg transition-colors"
                >
                  🌆 Chiều
                </button>
                <button
                  onClick={() => handleQuickAttendance('ot_half')}
                  className="p-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-lg transition-colors"
                >
                  ⚡ OT
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create Task */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">➕ Thêm Task</h3>
          <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <input
              type="text"
              placeholder="Tiêu đề task"
              value={newTaskForm.title}
              onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
              className="sm:col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newTaskForm.type}
              onChange={(e) => setNewTaskForm({ ...newTaskForm, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Loại task</option>
              {taskTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={newTaskForm.project}
              onChange={(e) => setNewTaskForm({ ...newTaskForm, project: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Dự án</option>
              {projects.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={newTaskForm.status}
              onChange={(e) => setNewTaskForm({ ...newTaskForm, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Trạng thái</option>
              {workStatus.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input
              type="date"
              value={newTaskForm.deadline}
              onChange={(e) => setNewTaskForm({ ...newTaskForm, deadline: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Số từ"
              value={newTaskForm.wordCount}
              onChange={(e) => setNewTaskForm({ ...newTaskForm, wordCount: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="sm:col-span-2 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Thêm Task
            </button>
          </form>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
              <option value="all">Dự án: Tất cả</option>
              {projects.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {workStatus.map(status => (
            <div key={status} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">{status}</h3>
              <div className="space-y-2">
                {userTasks.filter(t => t.status === status).map(task => (
                  <div key={task.id} className={`bg-white rounded-lg p-3 shadow-sm border-l-4 ${isOverdue(task.deadline, task.status) ? 'border-red-500 bg-red-50' : 'border-blue-500'}`}>
                    <h4 className="font-semibold text-gray-900 text-xs mb-2">{task.title} {isOverdue(task.deadline, task.status) && <AlertTriangle className="inline w-3 h-3 text-red-600" />}</h4>
                    <div className="text-xs text-gray-600 space-y-1 mb-2">
                      <p>📂 {task.project}</p>
                      <p>📋 {task.type}</p>
                      <p>📅 {task.deadline}</p>
                      {task.wordCount && <p>📝 {task.wordCount} từ</p>}
                    </div>

                    {status !== 'Hoàn thành' && (
                      <button
                        onClick={() => handleQuickComplete(task.id)}
                        className="w-full mb-2 bg-emerald-600 text-white py-1 rounded text-xs font-semibold hover:bg-emerald-700 flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" /> Hoàn thành
                      </button>
                    )}

                    {status === 'Hoàn thành' && (
                      <div className="mb-2 space-y-1">
                        <div>
                          <label className="text-xs text-gray-600">Số từ:</label>
                          {editWordCountTaskId === task.id ? (
                            <div className="flex gap-1">
                              <input
                                type="number"
                                value={editWordCountValue}
                                onChange={(e) => setEditWordCountValue(e.target.value)}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                              />
                              <button onClick={() => handleUpdateWordCount(task.id, editWordCountValue)} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">💾</button>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-gray-900">{task.wordCount}</span>
                              <button onClick={() => { setEditWordCountTaskId(task.id); setEditWordCountValue(task.wordCount); }} className="text-blue-600 hover:text-blue-700 text-xs">✏️</button>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="text-xs text-gray-600 block mb-1">Links công việc:</label>
                          {task.links && task.links.length > 0 && (
                            <div className="space-y-1 mb-2">
                              {task.links.map((link, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-blue-600 hover:text-blue-700 text-xs truncate">
                                    🔗 {link.url.substring(0, 20)}...
                                  </a>
                                  <button onClick={() => handleDeleteLink(task.id, idx)} className="text-red-600 hover:text-red-700 text-xs">✕</button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-1">
                            <input
                              type="url"
                              placeholder="Thêm link"
                              value={newLinkInput[task.id] || ''}
                              onChange={(e) => setNewLinkInput({ ...newLinkInput, [task.id]: e.target.value })}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                            />
                            <button onClick={() => handleAddLink(task.id)} className="px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-xs">+</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Comments */}
                    <div className="bg-gray-50 rounded p-1 mb-2 max-h-16 overflow-y-auto text-xs">
                      {task.comments && task.comments.length > 0 ? (
                        task.comments.map((c, i) => (
                          <div key={i} className="mb-1">
                            <p className="font-semibold text-gray-700">{c.user}</p>
                            <p className="text-gray-600 text-xs">{c.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">Chưa comment</p>
                      )}
                    </div>

                    {/* Add Comment */}
                    <div className="flex gap-1 mb-2">
                      <input
                        type="text"
                        placeholder="Comment..."
                        value={commentText[task.id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [task.id]: e.target.value })}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                      />
                      <button onClick={() => handleAddComment(task.id)} className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                        <Send className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 pt-1 border-t border-gray-200">
                      <button onClick={() => handleOpenEditTask(task)} className="flex-1 text-blue-600 hover:text-blue-700 font-semibold text-xs py-1 rounded hover:bg-blue-50">✏️</button>
                      <button onClick={() => handleDeleteTask(task.id)} className="flex-1 text-red-600 hover:text-red-700 font-semibold text-xs py-1 rounded hover:bg-red-50">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Edit Attendance Modal */}
        {editingAttendanceId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">↻ Điều chỉnh điểm danh</h3>
              <p className="text-sm text-gray-600 mb-4">Chọn loại điểm danh mới:</p>
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => setEditAttendanceType('full_day')}
                  className={`w-full p-3 rounded-lg font-semibold transition-all ${
                    editAttendanceType === 'full_day'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  🕐 Cả ngày
                </button>
                <button
                  onClick={() => setEditAttendanceType('half_morning')}
                  className={`w-full p-3 rounded-lg font-semibold transition-all ${
                    editAttendanceType === 'half_morning'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  🌅 Nửa ngày (Sáng)
                </button>
                <button
                  onClick={() => setEditAttendanceType('half_afternoon')}
                  className={`w-full p-3 rounded-lg font-semibold transition-all ${
                    editAttendanceType === 'half_afternoon'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  🌆 Nửa ngày (Chiều)
                </button>
                <button
                  onClick={() => setEditAttendanceType('ot_half')}
                  className={`w-full p-3 rounded-lg font-semibold transition-all ${
                    editAttendanceType === 'ot_half'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  ⚡ OT (0.5 ngày)
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveEditAttendance(editingAttendanceId)}
                  className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
                >
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setEditingAttendanceId(null);
                    setEditAttendanceType('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Modal - Flow 3 Smart Hybrid */}
        {showAttendanceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">⏰ Điểm danh hôm nay</h3>
              
              {todayTasks.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <p className="font-semibold text-emerald-700 mb-2">✅ Task hôm nay:</p>
                    <ul className="space-y-1 text-sm text-emerald-600">
                      {todayTasks.map(t => (
                        <li key={t.id}>☑ {t.title}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => handleSaveAttendance(attendanceAction)}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
                  >
                    Xác nhận điểm danh
                  </button>
                  <button
                    onClick={() => setShowAttendanceModal(false)}
                    className="w-full bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="font-semibold text-red-700">❌ Bạn chưa có task hôm nay!</p>
                    <p className="text-sm text-red-600 mt-1">Vui lòng tạo task trước khi điểm danh hoặc chọn lý do ngoại lệ.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Chọn một trong:</p>
                    <button
                      onClick={() => {
                        setShowAttendanceModal(false);
                        setNewTaskForm({
                          title: `📋 Task ${today}`,
                          type: 'Report',
                          project: 'Daily Work',
                          status: 'Cần làm',
                          deadline: today,
                          wordCount: '0',
                          assignee: currentUser.id
                        });
                      }}
                      className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      📝 Tạo task ngay
                    </button>
                    
                    <button
                      onClick={() => {
                        handleSaveAttendance(attendanceAction);
                      }}
                      className="w-full bg-amber-600 text-white font-semibold py-2 rounded-lg hover:bg-amber-700 text-sm"
                    >
                      ⏭️ Bỏ qua (sẽ tạo sau)
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowAttendanceModal(false)}
                    className="w-full bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
        {editingTaskId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-96 overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">✏️ Sửa Task</h3>
              <div className="space-y-3 mb-4 text-sm">
                <input type="text" value={editTaskForm.title} onChange={(e) => setEditTaskForm({ ...editTaskForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                <select value={editTaskForm.type} onChange={(e) => setEditTaskForm({ ...editTaskForm, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                  {taskTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={editTaskForm.project} onChange={(e) => setEditTaskForm({ ...editTaskForm, project: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                  {projects.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select value={editTaskForm.status} onChange={(e) => setEditTaskForm({ ...editTaskForm, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                  {workStatus.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="date" value={editTaskForm.deadline} onChange={(e) => setEditTaskForm({ ...editTaskForm, deadline: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                <input type="number" placeholder="Số từ" value={editTaskForm.wordCount} onChange={(e) => setEditTaskForm({ ...editTaskForm, wordCount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleSaveEditTask(editingTaskId)} className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">Lưu</button>
                <button onClick={() => setEditingTaskId(null)} className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400">Hủy</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
