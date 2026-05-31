# 📚 Hướng dẫn GitHub Setup (Chi tiết cho người mới)

## 🎯 Mục đích
Đẩy code dashboard lên GitHub để deploy lên Vercel

---

## 📋 BƯỚC 1: Tạo GitHub Account (nếu chưa có)

1. Vào https://github.com
2. Click "Sign up"
3. Điền:
   - Email: your@email.com
   - Password: Your strong password
   - Username: your_username (dễ nhớ)
4. Click "Create account"
5. Verify email (check inbox)

✅ Xong, bạn có GitHub account!

---

## 📋 BƯỚC 2: Cài Git (công cụ để push code)

### Windows:
1. Vào https://git-scm.com
2. Click "Download for Windows"
3. Run installer
4. Click Next → Next → Finish
5. Mở Command Prompt / PowerShell
6. Kiểm tra: `git --version`

### Mac:
1. Vào https://git-scm.com
2. Click "Download for Mac"
3. Run installer
4. Mở Terminal
5. Kiểm tra: `git --version`

✅ Xong, bạn có Git!

---

## 📋 BƯỚC 3: Configure Git (setup lần đầu)

Mở Terminal/Command Prompt và chạy:

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

Thay "Your Name" bằng tên bạn, "your@email.com" bằng email GitHub

---

## 📋 BƯỚC 4: Tạo GitHub Repository

1. Đăng nhập vào https://github.com
2. Click "+" icon (top right)
3. Chọn "New repository"
4. Điền:
   - Repository name: `task-dashboard`
   - Description: `Task Management Dashboard for megaseo.vn`
   - Choose "Public" (để Vercel có thể access)
   - ✅ Tick "Add a README file"
5. Click "Create repository"

✅ Xong, bạn có repo GitHub!

URL sẽ như: `https://github.com/your_username/task-dashboard`

---

## 📋 BƯỚC 5: Clone Repository xuống máy

Mở Terminal/Command Prompt:

```bash
cd C:\task-dashboard
(hoặc cd ~/task-dashboard trên Mac)
```

Sau đó:
```bash
git clone https://github.com/your_username/task-dashboard.git .
```

**Thay `your_username` bằng username GitHub của bạn!**

(Dấu `.` ở cuối rất quan trọng - nó clone vào thư mục hiện tại)

✅ Xong, repo đã ở máy bạn!

---

## 📋 BƯỚC 6: Copy Project Files vào

1. Tôi đã cung cấp cho bạn:
   - package.json
   - vite.config.js
   - index.html
   - src/main.jsx
   - src/App.jsx
   - .gitignore

2. Copy tất cả files này vào thư mục `task-dashboard`

**Cấu trúc sẽ như này:**
```
task-dashboard/
├── README.md (có sẵn)
├── .gitignore
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx
    └── App.jsx
```

---

## 📋 BƯỚC 7: Install Dependencies

Mở Terminal/Command Prompt ở trong `task-dashboard`:

```bash
npm install
```

Chờ ~2-3 phút cho tải xong (nó sẽ tạo folder `node_modules`)

✅ Xong, dependencies installed!

---

## 📋 BƯỚC 8: Test chạy locally

```bash
npm run dev
```

Bạn sẽ thấy:
```
VITE v5.0.0  ready in 100 ms

➜  Local:   http://localhost:5173/
```

Click link → test đăng nhập OK? ✅

Nếu OK, bấm `Ctrl+C` để stop server.

---

## 📋 BƯỚC 9: Push Code lên GitHub

Vẫn ở Terminal/Command Prompt, chạy lần lượt:

### Bước 9a: Add files
```bash
git add .
```
(Dấu `.` có nghĩa "add tất cả files")

### Bước 9b: Commit
```bash
git commit -m "Initial commit - Task Dashboard"
```
(Commit = lưu một version của code)

### Bước 9c: Push
```bash
git push -u origin main
```
(Push = upload lên GitHub)

**Nếu được hỏi credential:**
- Username: `your_github_username`
- Password: `your_github_token` (xem dưới)

---

## 🔑 Tạo GitHub Token (nếu cần)

Nếu push bị lỗi "401 Unauthorized":

1. Vào https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Tích:
   - ✅ repo
   - ✅ workflow
4. Click "Generate token"
5. Copy token (dùng làm password khi git push)

---

## ✅ Kiểm tra Push thành công

1. Vào https://github.com/your_username/task-dashboard
2. Refresh page
3. Bạn sẽ thấy files hiển thị
4. Click vào files → xem code

✅ Xong! Code của bạn đã lên GitHub!

---

## 🚀 Tiếp theo: Deploy lên Vercel

Sau khi push xong, đọc file `VERCEL_DEPLOY.md` để deploy lên Vercel

---

## 🆘 Troubleshooting

**Lỗi "fatal: not a git repository"**
→ Chạy `git init` ở trong thư mục project

**Lỗi "fatal: could not read Username"**
→ Tạo GitHub Token (xem hướng dẫn trên)

**Lỗi "npm: command not found"**
→ Cài Node.js lại từ nodejs.org

**Lỗi khi clone "fatal: destination path 'task-dashboard' already exists"**
→ Xóa folder cũ rồi clone lại

---

## 💡 Git Commands Cơ bản (để sử dụng sau)

```bash
# Xem status hiện tại
git status

# Thêm files
git add .

# Commit
git commit -m "Your message"

# Push lên GitHub
git push

# Pull từ GitHub (nếu có changes từ chỗ khác)
git pull

# Xem history commits
git log
```

---

## ✨ Bạn sẽ có:
- ✅ GitHub account
- ✅ Git installed
- ✅ Repository trên GitHub
- ✅ Code đã push lên

**Tiếp theo:** Deploy lên Vercel! 🚀
