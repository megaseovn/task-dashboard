# 📊 Quản Lý Công Việc Dashboard - Setup Guide

## 🎯 Bạn sẽ có gì:
- ✅ Dashboard dùng được ngay (dashboard.megaseo.vn)
- ✅ Quản lý nhân viên & công việc
- ✅ Comments, Notifications, Kanban board
- ✅ Data lưu trữ (không mất khi refresh)

---

## 📋 QUY TRÌNH (7 BƯỚC ĐƠN GIẢN)

### **BƯỚC 1: Tải Project Files**
1. Tạo thư mục trên máy: `C:\task-dashboard` (Windows) hoặc `~/task-dashboard` (Mac)
2. Download files từ repo GitHub tôi cung cấp
3. Bỏ vào thư mục đó

**Cấu trúc folder sẽ như này:**
```
task-dashboard/
├── src/
│   ├── App.jsx (file chính - dashboard)
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

---

### **BƯỚC 2: Cài Node.js (nếu chưa có)**
1. Vào https://nodejs.org
2. Download "LTS" version
3. Cài đặt (click Next → Next → Finish)
4. Kiểm tra: Mở Terminal/Command Prompt
   ```
   node --version
   npm --version
   ```
   Nếu hiện số version → OK ✅

---

### **BƯỚC 3: Install Dependencies (tải libraries)**
1. Mở Terminal/Command Prompt
2. Vào thư mục project:
   ```
   cd C:\task-dashboard
   ```
   (hoặc `cd ~/task-dashboard` trên Mac)

3. Chạy lệnh:
   ```
   npm install
   ```
   Chờ ~2-3 phút cho tải xong

---

### **BƯỚC 4: Test Chạy Locally (trên máy tính)**
Vẫn ở Terminal, chạy:
```
npm run dev
```

Kết quả:
```
VITE v5.0.0  ready in 100 ms

➜  Local:   http://localhost:5173/
```

✅ Click vào link → xem dashboard chạy!

**Test đăng nhập:**
- Email: `manager@gmail.com` / Password: `123456`
- Email: `nguyena@gmail.com` / Password: `123456`

---

### **BƯỚC 5: Tạo GitHub Repo**
1. Vào https://github.com
2. Click "New repository"
3. Điền:
   - Name: `task-dashboard`
   - Description: "Task Management Dashboard"
   - Public (chọn Public)
4. Click "Create repository"

---

### **BƯỚC 6: Push Code lên GitHub**
Vẫn ở Terminal, chạy các lệnh này (1 cái rồi đến cái khác):

```bash
git init
git add .
git commit -m "Initial commit - Task Dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/task-dashboard.git
git push -u origin main
```

**Thay `YOUR_USERNAME` bằng username GitHub của bạn!**

✅ Xong → Dashboard code đã up lên GitHub

---

### **BƯỚC 7: Deploy lên Vercel**

#### 7.1: Connect GitHub với Vercel
1. Vào https://vercel.com
2. Click "Import Project"
3. Click "Continue with GitHub"
4. Authorize Vercel
5. Chọn repo `task-dashboard`
6. Click "Deploy"
7. Chờ ~1-2 phút

**Kết quả:** Bạn sẽ nhận link như:
```
https://task-dashboard-xxx.vercel.app/
```

---

### **BƯỚC 8: Map Domain megaseo.vn**

#### 8.1: Ở Vercel
1. Vào project dashboard
2. Chọn "Settings" → "Domains"
3. Nhập: `dashboard.megaseo.vn`
4. Click "Add"
5. Vercel sẽ hiện DNS records

#### 8.2: Ở nhà cung cấp hosting megaseo.vn
1. Vào cPanel (quản lý domain)
2. Chọn "DNS Management" hoặc "Domain Settings"
3. Update DNS records theo hướng dẫn của Vercel
4. **Hoặc** tìm "CNAME" settings → trỏ đến Vercel

⏳ Chờ ~15-30 phút để DNS propagate

✅ Xong! `dashboard.megaseo.vn` sẵn dùng!

---

## 💾 DATA PERSISTENCE (localStorage)

Dashboard **tự động lưu data** vào browser localStorage:
- Tạo nhân viên mới ✅ (lưu)
- Tạo task ✅ (lưu)
- Update status ✅ (lưu)
- Comments ✅ (lưu)

**Khi nào mất data:**
- ❌ Xóa browser cache/cookies
- ❌ Dùng browser khác
- ❌ Máy tính khác

**Nâng cấp sau (Firebase):**
Nếu muốn dùng trên nhiều máy, tôi sẽ thêm database Firebase (lưu cloud, an toàn).

---

## 🔐 SECURITY

**Hiện tại:** Password demo (không an toàn cho production)

**Sau này nâng cấp:**
- Add Firebase Authentication
- Password hashing
- User management

---

## 📱 EMBED VÀO WORDPRESS (Optional)

Nếu muốn hiển thị dashboard trên trang WordPress:

1. Vào WordPress Editor
2. Add "HTML" block
3. Paste:
```html
<iframe 
  src="https://dashboard.megaseo.vn" 
  width="100%" 
  height="800px" 
  frameborder="0">
</iframe>
```
4. Publish

✅ Dashboard hiển thị ngay trên trang WordPress!

---

## 🆘 TROUBLESHOOTING

**Lỗi "npm: command not found"**
→ Node.js chưa cài → Cài lại từ nodejs.org

**Lỗi "git: command not found"**
→ Git chưa cài → Cài từ git-scm.com

**Dashboard không load**
→ Vercel deploy chưa xong → Chờ 2-3 phút
→ Browser cache → Bấm Ctrl+Shift+Delete xóa cache

**Domain không trỏ đến**
→ DNS chưa propagate → Chờ 1 giờ
→ Check DNS records ở Vercel Settings

---

## 📞 CẦN GIÚP?

Nếu bị stuck ở đâu, hãy nói cho tôi:
- Bạn ở bước nào
- Lỗi gì (copy error message)
- Screenshot nếu có

Tôi sẽ hướng dẫn chi tiết! 👍

---

## ✅ CHECKLIST

Sau khi setup xong, kiểm tra:
- [ ] npm install xong
- [ ] npm run dev chạy ok
- [ ] Đăng nhập được với demo account
- [ ] Tạo task được
- [ ] Refresh page → data vẫn còn (localStorage)
- [ ] GitHub repo có code
- [ ] Vercel deploy xong
- [ ] Domain dashboard.megaseo.vn trỏ đến

---

## 🎉 DONE!

Bạn sẽ có dashboard đầy đủ chức năng:
- ✅ Manager panel (tạo nhân viên, setup)
- ✅ Employee dashboard (tạo task, kanban)
- ✅ Comments & Notifications
- ✅ Data lưu trữ
- ✅ Domain riêng
- ✅ Live 24/7

**Từ giờ, nhân viên có thể:**
- Đăng nhập vào dashboard.megaseo.vn
- Tạo task cho mình
- Update tiến độ
- Comment & discuss
- Xem tiến độ cá nhân

**Bạn (Manager) có thể:**
- Xem tất cả tasks
- Tạo nhân viên
- Setup task types, projects, status
- Manage tất cả công việc

---

**Bạn sẵn sàng bắt đầu? 🚀**
