import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Send, Bell, LogOut, X, ExternalLink } from 'lucide-react';

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
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  // Load từ localStorage
  const [employees, setEmployees] = useState(() => loadFromLocalStorage('employees', [
    { id: 0, name: 'Manager', email: 'manager@gmail.com', password: '123456', role: 'manager', position: 'Quản lý', status: 'Nhân viên chính thức' },
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyena@gmail.com', password: '123456', role: 'employee', position: 'Lập trình viên', status: 'Nhân viên chính thức' },
    { id: 2, name: 'Trần Thị B', email: 'tranb@gmail.com', password: '123456', role: 'employee', position: 'Thiết kế', status: 'Nhân viên chính thức' },
  ]));

  const employeeStatusOptions = ['Thử việc', 'Thực tập sinh', 'Nhân viên chính thức', 'Đã nghỉ việc'];

  const [taskTypes, setTaskTypes] = useState(() => loadFromLocalStorage('taskTypes', ['Lập trình', 'Thiết kế', 'Testing', 'Documentation']));
  const [projects, setProjects] = useState(() => loadFromLocalStorage('projects', ['Website Redesign', 'Mobile App', 'API Integration']));
  const [workStatus, setWorkStatus] = useState(() => loadFromLocalStorage('workStatus', ['Cần làm', 'Đang làm', 'Hoàn thành', 'Đang review']));
  const [tasks, setTasks] = useState(() => loadFromLocalStorage('tasks', []));
  const [notifications, setNotifications] = useState(() => loadFromLocalStorage('notifications', []));

  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    type: '',
    project: '',
    status: '',
    deadline: '',
    wordCount: '',
  });

  const [editTaskForm, setEditTaskForm] = useState({
    title: '',
    type: '',
    project: '',
    status: '',
    deadline: '',
    wordCount: '',
  });

  const [editEmployeeForm, setEditEmployeeForm] = useState({
    name: '',
    position: '',
    status: '',
  });

  const [newEmployeeForm, setNewEmployeeForm] = useState({
    name: '',
    position: '',
    status: 'Nhân viên chính thức',
    email: '',
    password: '',
  });

  const [newTypeForm, setNewTypeForm] = useState('');
  const [newProjectForm, setNewProjectForm] = useState('');
  const [newStatusForm, setNewStatusForm] = useState('');
  const [commentText, setCommentText] = useState({});
  const [linkInput, setLinkInput] = useState({});
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [editingTypeItem, setEditingTypeItem] = useState(null);
  const [editingProjectItem, setEditingProjectItem] = useState(null);
  const [editingStatusItem, setEditingStatusItem] = useState(null);
  const [editTypeValue, setEditTypeValue] = useState('');
  const [editProjectValue, setEditProjectValue] = useState('');
  const [editStatusValue, setEditStatusValue] = useState('');

  // ==================== SAVE TO LOCALSTORAGE ====================
  useEffect(() => {
    saveToLocalStorage('employees', employees);
  }, [employees]);

  useEffect(() => {
    saveToLocalStorage('taskTypes', taskTypes);
  }, [taskTypes]);

  useEffect(() => {
    saveToLocalStorage('projects', projects);
  }, [projects]);

  useEffect(() => {
    saveToLocalStorage('workStatus', workStatus);
  }, [workStatus]);

  useEffect(() => {
    saveToLocalStorage('tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToLocalStorage('notifications', notifications);
  }, [notifications]);

  // ==================== UTILS ====================
  const getUserName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.name : 'Unknown';
  };

  const getCurrentTaskStats = () => {
    if (!currentUser) return { total: 0, done: 0, inProgress: 0, overdue: 0 };
    const userTasks = tasks.filter(t => t.assignee === currentUser.id || t.createdBy === currentUser.id);
    return {
      total: userTasks.length,
      done: userTasks.filter(t => t.status === 'Hoàn thành').length,
      inProgress: userTasks.filter(t => t.status === 'Đang làm').length,
      overdue: userTasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'Hoàn thành').length,
    };
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    if (currentUser?.role === 'employee') {
      filtered = filtered.filter(t => t.assignee === currentUser.id || t.createdBy === currentUser.id);
    } else {
      if (filterEmployee !== 'all') filtered = filtered.filter(t => t.assignee === parseInt(filterEmployee));
    }
    if (filterProject !== 'all') filtered = filtered.filter(t => t.project === filterProject);
    if (filterStatus !== 'all') filtered = filtered.filter(t => t.status === filterStatus);
    if (filterDateFrom) filtered = filtered.filter(t => t.deadline >= filterDateFrom);
    if (filterDateTo) filtered = filtered.filter(t => t.deadline <= filterDateTo);
    return filtered;
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
    setNewEmployeeForm({ name: '', position: '', status: 'Nhân viên chính thức', email: '', password: '' });
    alert('Tạo nhân viên thành công!');
  };

  const handleOpenEditEmployee = (emp) => {
    setEditingEmployeeId(emp.id);
    setEditEmployeeForm({
      name: emp.name,
      position: emp.position,
      status: emp.status,
    });
  };

  const handleSaveEditEmployee = (empId) => {
    setEmployees(employees.map(e => e.id === empId ? { ...e, ...editEmployeeForm } : e));
    setEditingEmployeeId(null);
    alert('Cập nhật nhân viên thành công!');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskForm.title || !newTaskForm.type || !newTaskForm.project || !newTaskForm.status || !newTaskForm.deadline) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    const newId = Math.max(...tasks.map(t => t.id || 0), 0) + 1;
    setTasks([...tasks, {
      id: newId,
      ...newTaskForm,
      wordCount: newTaskForm.wordCount || '0',
      assignee: currentUser.role === 'employee' ? currentUser.id : null,
      link: '',
      comments: [],
      createdBy: currentUser.id,
      createdAt: new Date().toISOString().split('T')[0],
    }]);
    setNewTaskForm({ title: '', type: '', project: '', status: '', deadline: '', wordCount: '' });
    alert('Tạo task thành công!');
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
    });
  };

  const handleSaveEditTask = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, ...editTaskForm } : t));
    setEditingTaskId(null);
    alert('Cập nhật task thành công!');
  };

  const handleUpdateTask = (id, updates) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa task này?')) {
      setTasks(tasks.filter(t => t.id !== id));
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

  const handleSaveLink = (taskId) => {
    if (!linkInput[taskId]) return;
    handleUpdateTask(taskId, { link: linkInput[taskId] });
    setLinkInput({ ...linkInput, [taskId]: '' });
    alert('Lưu link thành công!');
  };

  // ==================== LOGIN PAGE ====================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
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

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Demo accounts:</p>
              <div className="space-y-2 text-xs text-gray-600">
                <p>👨‍💼 Manager: <span className="font-mono bg-gray-100 px-2 py-1 rounded">manager@gmail.com</span> / <span className="font-mono bg-gray-100 px-2 py-1 rounded">123456</span></p>
                <p>👤 Employee: <span className="font-mono bg-gray-100 px-2 py-1 rounded">nguyena@gmail.com</span> / <span className="font-mono bg-gray-100 px-2 py-1 rounded">123456</span></p>
              </div>
            </div>
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
              <p className="text-3xl font-bold">{tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'Hoàn thành').length}</p>
            </div>
          </div>

          {/* Create Task, Setup, Add Employee */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Task */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">➕ Tạo Task</h3>
              <form onSubmit={handleAddTask} className="space-y-4">
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
                  <option value="">Chọn loại task</option>
                  {taskTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select
                  value={newTaskForm.project}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, project: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn dự án</option>
                  {projects.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select
                  value={newTaskForm.status}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn trạng thái</option>
                  {workStatus.map(s => <option key={s} value={s}>{s}</option>)}
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
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">⚙️ Setup</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Loại Task</label>
                  <form onSubmit={handleAddType} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTypeForm}
                      onChange={(e) => setNewTypeForm(e.target.value)}
                      placeholder="Thêm loại task"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+</button>
                  </form>
                  <div className="space-y-1">
                    {taskTypes.map((t, i) => (
                      <div key={i} className="flex items-center justify-between bg-blue-50 px-3 py-1 rounded-full text-xs">
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
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Dự án</label>
                  <form onSubmit={handleAddProject} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newProjectForm}
                      onChange={(e) => setNewProjectForm(e.target.value)}
                      placeholder="Thêm dự án"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+</button>
                  </form>
                  <div className="space-y-1">
                    {projects.map((p, i) => (
                      <div key={i} className="flex items-center justify-between bg-emerald-50 px-3 py-1 rounded-full text-xs">
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
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Trạng thái</label>
                  <form onSubmit={handleAddStatus} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newStatusForm}
                      onChange={(e) => setNewStatusForm(e.target.value)}
                      placeholder="Thêm trạng thái"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">+</button>
                  </form>
                  <div className="space-y-1">
                    {workStatus.map((s, i) => (
                      <div key={i} className="flex items-center justify-between bg-amber-50 px-3 py-1 rounded-full text-xs">
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">➕ Thêm Nhân viên</h3>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <input
                  type="text"
                  placeholder="Tên nhân viên"
                  value={newEmployeeForm.name}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Vị trí"
                  value={newEmployeeForm.position}
                  onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
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
                  Tạo Nhân viên
                </button>
              </form>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">Danh sách nhân viên:</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {employees.filter(e => e.role === 'employee').map(e => (
                    <div key={e.id} className="text-xs text-gray-600 bg-gray-50 p-2 rounded flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{e.name}</p>
                        <p className="text-gray-600">{e.position}</p>
                        <p className="text-gray-500 text-xs">{e.status}</p>
                      </div>
                      <button
                        onClick={() => handleOpenEditEmployee(e)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        ✏️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tasks */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔍 Lọc Tasks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Nhân viên</label>
                <select
                  value={filterEmployee}
                  onChange={(e) => setFilterEmployee(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả</option>
                  {employees.filter(e => e.role === 'employee').map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Dự án</label>
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả</option>
                  {projects.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Trạng thái</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả</option>
                  {workStatus.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Từ ngày</label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Đến ngày</label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">📋 Danh sách Tasks ({filteredTasks.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Tiêu đề</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Loại</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Dự án</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Nhân viên</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Trạng thái</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Hạn</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-900 font-medium">{task.title}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{task.type}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{task.project}</td>
                      <td className="px-6 py-4 text-gray-600">{task.assignee ? getUserName(task.assignee) : '-'}</td>
                      <td className="px-6 py-4">
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs">{task.status}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{task.deadline}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleOpenEditTask(task)}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-700 font-semibold text-sm"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Task Modal */}
          {editingTaskId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">✏️ Sửa Task</h3>
                  <button onClick={() => setEditingTaskId(null)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={editTaskForm.title}
                    onChange={(e) => setEditTaskForm({ ...editTaskForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={editTaskForm.type}
                    onChange={(e) => setEditTaskForm({ ...editTaskForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {taskTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select
                    value={editTaskForm.project}
                    onChange={(e) => setEditTaskForm({ ...editTaskForm, project: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {projects.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select
                    value={editTaskForm.status}
                    onChange={(e) => setEditTaskForm({ ...editTaskForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {workStatus.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input
                    type="date"
                    value={editTaskForm.deadline}
                    onChange={(e) => setEditTaskForm({ ...editTaskForm, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Số từ"
                    value={editTaskForm.wordCount}
                    onChange={(e) => setEditTaskForm({ ...editTaskForm, wordCount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEditTask(editingTaskId)}
                      className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
                    >
                      💾 Lưu
                    </button>
                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Type Modal */}
          {editingTypeItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">✏️ Sửa Loại Task</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editTypeValue}
                    onChange={(e) => setEditTypeValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEditType}
                      className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
                    >
                      💾 Lưu
                    </button>
                    <button
                      onClick={() => setEditingTypeItem(null)}
                      className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Project Modal */}
          {editingProjectItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">✏️ Sửa Dự án</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editProjectValue}
                    onChange={(e) => setEditProjectValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEditProject}
                      className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
                    >
                      💾 Lưu
                    </button>
                    <button
                      onClick={() => setEditingProjectItem(null)}
                      className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Status Modal */}
          {editingStatusItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">✏️ Sửa Trạng thái</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editStatusValue}
                    onChange={(e) => setEditStatusValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEditStatus}
                      className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
                    >
                      💾 Lưu
                    </button>
                    <button
                      onClick={() => setEditingStatusItem(null)}
                      className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Employee Modal */}
          {editingEmployeeId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">✏️ Sửa Nhân viên</h3>
                  <button onClick={() => setEditingEmployeeId(null)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={editEmployeeForm.name}
                    onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, name: e.target.value })}
                    placeholder="Tên"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={editEmployeeForm.position}
                    onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, position: e.target.value })}
                    placeholder="Vị trí"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={editEmployeeForm.status}
                    onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {employeeStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEditEmployee(editingEmployeeId)}
                      className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
                    >
                      💾 Lưu
                    </button>
                    <button
                      onClick={() => setEditingEmployeeId(null)}
                      className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400"
                    >
                      Hủy
                    </button>
                  </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            📊 My Tasks
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-700">👋 {currentUser.name}</span>
            </div>
            <button onClick={() => setCurrentUser(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 text-white shadow-lg">
            <p className="text-white/80 text-xs sm:text-sm mb-1">Tổng Tasks</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl p-4 text-white shadow-lg">
            <p className="text-white/80 text-xs sm:text-sm mb-1">Hoàn thành</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.done}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-4 text-white shadow-lg">
            <p className="text-white/80 text-xs sm:text-sm mb-1">Đang làm</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.inProgress}</p>
          </div>
          <div className="bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl p-4 text-white shadow-lg">
            <p className="text-white/80 text-xs sm:text-sm mb-1">Quá hạn</p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.overdue}</p>
          </div>
        </div>

        {/* Create Task & Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Task */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">➕ Thêm Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
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
                <option value="">Chọn loại task</option>
                {taskTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={newTaskForm.project}
                onChange={(e) => setNewTaskForm({ ...newTaskForm, project: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn dự án</option>
                {projects.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select
                value={newTaskForm.status}
                onChange={(e) => setNewTaskForm({ ...newTaskForm, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn trạng thái</option>
                {workStatus.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input
                type="date"
                value={newTaskForm.deadline}
                onChange={(e) => setNewTaskForm({ ...newTaskForm, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Số từ"
                value={newTaskForm.wordCount}
                onChange={(e) => setNewTaskForm({ ...newTaskForm, wordCount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thêm Task
              </button>
            </form>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔍 Lọc</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Dự án</label>
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả</option>
                  {projects.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔔 Thông báo ({notifications.length})</h3>
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <div key={notif.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                    <p className="text-gray-800 font-semibold">{notif.text}</p>
                    <p className="text-gray-500 text-xs">{notif.time}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Không có thông báo</p>
              )}
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workStatus.map(status => (
            <div key={status} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">{status}</h3>
              <div className="space-y-3">
                {userTasks.filter(t => t.status === status).map(task => (
                  <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">{task.title}</h4>
                    <div className="space-y-1 text-xs text-gray-600 mb-3">
                      <p>📂 {task.project}</p>
                      <p>📋 {task.type}</p>
                      <p>📅 {task.deadline}</p>
                      {task.wordCount && <p>📝 {task.wordCount} từ</p>}
                    </div>

                    {status === 'Hoàn thành' && (
                      <div className="mb-3 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Link công việc"
                            value={linkInput[task.id] || task.link}
                            onChange={(e) => setLinkInput({ ...linkInput, [task.id]: e.target.value })}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => handleSaveLink(task.id)}
                            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                          >
                            💾
                          </button>
                        </div>
                        {task.link && (
                          <a
                            href={task.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs"
                          >
                            🔗 Mở link
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Comments */}
                    <div className="bg-gray-50 rounded p-2 mb-3 max-h-24 overflow-y-auto">
                      {task.comments && task.comments.length > 0 ? (
                        <div className="space-y-2">
                          {task.comments.map((c, i) => (
                            <div key={i} className="text-xs">
                              <p className="font-semibold text-gray-700">{c.user}</p>
                              <p className="text-gray-600">{c.text}</p>
                              <p className="text-gray-400 text-xs">{c.time}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">Chưa có comment</p>
                      )}
                    </div>

                    {/* Add Comment */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Comment..."
                        value={commentText[task.id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [task.id]: e.target.value })}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleAddComment(task.id)}
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-200">
                      <button
                        onClick={() => handleOpenEditTask(task)}
                        className="flex-1 text-blue-600 hover:text-blue-700 font-semibold text-xs py-1 rounded hover:bg-blue-50"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="flex-1 text-red-600 hover:text-red-700 font-semibold text-xs py-1 rounded hover:bg-red-50"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Edit Task Modal */}
        {editingTaskId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">✏️ Sửa Task</h3>
                <button onClick={() => setEditingTaskId(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={editTaskForm.title}
                  onChange={(e) => setEditTaskForm({ ...editTaskForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={editTaskForm.type}
                  onChange={(e) => setEditTaskForm({ ...editTaskForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {taskTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select
                  value={editTaskForm.project}
                  onChange={(e) => setEditTaskForm({ ...editTaskForm, project: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {projects.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select
                  value={editTaskForm.status}
                  onChange={(e) => setEditTaskForm({ ...editTaskForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {workStatus.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  type="date"
                  value={editTaskForm.deadline}
                  onChange={(e) => setEditTaskForm({ ...editTaskForm, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Số từ"
                  value={editTaskForm.wordCount}
                  onChange={(e) => setEditTaskForm({ ...editTaskForm, wordCount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEditTask(editingTaskId)}
                    className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
                  >
                    💾 Lưu
                  </button>
                  <button
                    onClick={() => setEditingTaskId(null)}
                    className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
