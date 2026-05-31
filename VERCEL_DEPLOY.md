# 🚀 Hướng dẫn Deploy lên Vercel

---

## 🎯 Mục đích
Đẩy dashboard từ GitHub → Vercel (hosting cloud) → domain.megaseo.vn

---

## 📋 BƯỚC 1: Vercel Account (bạn đã tạo)

✅ Bạn đã có Vercel account

---

## 📋 BƯỚC 2: Connect GitHub with Vercel

1. Vào https://vercel.com
2. Đăng nhập
3. Click "New Project" (hoặc "Create")
4. Click "Import Project"
5. Click "GitHub" (connect with GitHub)
6. Authorize Vercel
   - Bạn sẽ được đưa về GitHub
   - Click "Authorize vercel"
   - Chọn "Only select repositories"
   - Chọn `task-dashboard`
   - Click "Install"

✅ Xong, Vercel connected with GitHub!

---

## 📋 BƯỚC 3: Import Project

1. Vào https://vercel.com
2. Click "Add New" → "Project"
3. Bạn sẽ thấy repo `task-dashboard`
4. Click "Import" (vào bên cạnh repo)

---

## 📋 BƯỚC 4: Configure Project

**Bạn sẽ thấy form:**

```
Project Name: task-dashboard
Framework: React
Root Directory: ./
```

**Để nguyên như vậy, KHÔNG thay đổi gì!**

Click "Deploy"

⏳ Chờ 2-5 phút cho deploy xong...

---

## 📋 BƯỚC 5: Vercel URL

Khi deploy xong, bạn sẽ nhận:
```
Congratulations! Your project has been successfully deployed.
https://task-dashboard-xxx.vercel.app
```

**Test:**
1. Click vào link
2. Test login:
   - Email: `manager@gmail.com`
   - Password: `123456`
3. Nếu OK → ✅ Deploy thành công!

---

## 📋 BƯỚC 6: Map Domain megaseo.vn

### 6.1: Ở Vercel

1. Vào project → "Settings"
2. Click "Domains"
3. Nhập: `dashboard.megaseo.vn`
4. Click "Add"

**Vercel sẽ hiện:**
```
To use this domain, please add the following DNS records to your domain provider:

Type    Name         Value
CNAME   dashboard    cname.vercel-dns.com
```

Ghi lại value: `cname.vercel-dns.com`

### 6.2: Ở nhà cung cấp hosting megaseo.vn

**Đối với cPanel (phổ biến):**

1. Vào cPanel (thường https://yourdomain.com:2083)
2. Tìm "DNS Management" hoặc "Zone Editor"
3. Tìm domain "megaseo.vn"
4. Click "Manage"
5. Tìm record "dashboard" CNAME
   - Nếu có → Edit
   - Nếu không → Add new record:
     ```
     Name: dashboard
     Type: CNAME
     Value: cname.vercel-dns.com
     TTL: 3600
     ```
6. Click "Save"

**Hoặc liên hệ hosting provider:**
- Email: "Tôi muốn map subdomain dashboard.megaseo.vn vào Vercel"
- DNS records trên
- Họ sẽ update cho bạn

---

## ⏳ BƯỚC 7: Chờ DNS Propagate

DNS propagation ~ 15-30 phút

Kiểm tra:
1. Mở Terminal
2. Chạy:
   ```
   nslookup dashboard.megaseo.vn
   ```
3. Nếu thấy `cname.vercel-dns.com` → ✅ OK!

---

## 🎉 Xong!

**Bây giờ bạn có:**
- ✅ `https://dashboard.megaseo.vn/` (live!)
- ✅ Data lưu trữ (localStorage)
- ✅ Manager panel
- ✅ Employee dashboard

---

## 📱 Setup WordPress Iframe (Optional)

Nếu muốn hiển thị dashboard trong trang WordPress:

### Tại WordPress Admin:

1. Tạo/Edit một page
2. Thêm "Custom HTML" block
3. Paste:
```html
<iframe 
  src="https://dashboard.megaseo.vn" 
  width="100%" 
  height="1000px" 
  frameborder="0"
  allow="same-origin"
  style="border: none;">
</iframe>
```
4. Publish

✅ Dashboard sẽ hiển thị ngay trong WordPress page!

---

## 🔄 Update Code sau này

Khi bạn muốn update dashboard:

1. Sửa code trên máy
2. Test locally: `npm run dev`
3. Push GitHub:
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```
4. Vercel tự động deploy (5-10 phút)
5. Xem updates trên `dashboard.megaseo.vn`

---

## 🆘 Troubleshooting

**Domain không trỏ đến:**
→ DNS chưa propagate, chờ 1-2 giờ
→ Check DNS settings ở cPanel

**Vercel build fail:**
→ Check build logs ở Vercel → Settings → Deployments
→ Liên hệ tôi với error message

**Dashboard không load:**
→ Clear browser cache (Ctrl+Shift+Delete)
→ Try incognito/private window

---

## ✅ Checklist

- [ ] Vercel account tạo
- [ ] GitHub repo push xong
- [ ] Vercel project tạo
- [ ] Deploy successful
- [ ] Test login OK
- [ ] Domain map (CNAME added)
- [ ] DNS propagate OK
- [ ] `dashboard.megaseo.vn` sẽ dùng được
- [ ] Embed vào WordPress (optional)

---

## 📞 Bạn cần gì?

Nếu bị stuck ở đâu, hãy nói:
- Bạn ở bước nào
- Lỗi gì (copy screenshot)
- Tôi sẽ hỗ trợ! 👍

---

**Chúc mừng! Dashboard của bạn đã live!** 🎉
