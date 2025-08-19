# Woodville Gallery - GitHub Pages + Cloudinary

Website gallery ảnh tự động với Cloudinary, hoạt động hoàn toàn trên GitHub Pages.

## ✨ Tính năng

- **🖼️ Gallery ảnh đẹp** với layout responsive
- **☁️ Tự động load ảnh từ Cloudinary** 
- **📤 Upload ảnh trực tiếp** từ browser
- **🔄 Auto-refresh** mỗi 60 giây
- **🔍 Tìm kiếm và lọc theo category**
- **📱 Responsive** trên mọi thiết bị

## 🚀 Cách sử dụng

### 1. Mở website
- Truy cập: `https://yourusername.github.io/woodville`
- Website sẽ tự động load 50+ ảnh từ Cloudinary

### 2. Upload ảnh mới
1. Click vào khu vực upload hoặc nút "Upload to Cloudinary"
2. Chọn category (WoodVille, Biển, Đi ăn, Sports, City, Núi)
3. Chọn ảnh từ máy tính, camera hoặc URL
4. Ảnh sẽ hiển thị ngay trong gallery

### 3. Tìm kiếm và lọc
- **Search**: Gõ từ khóa để tìm ảnh
- **Category**: Click category để lọc
- **Reset**: Click "reset all" để xem tất cả

## 🛠️ Cấu hình Cloudinary

### Upload Preset
Website sử dụng upload preset `woodville` (unsigned) trong Cloudinary.

### Folder
Ảnh được lưu trong folder `woodville-gallery` trên Cloudinary.

## 📁 Cấu trúc file

```
woodville/
├── index.html              # Trang chính
├── css/
│   └── style.css          # CSS styles
├── js/
│   ├── script.js          # Gallery logic
│   ├── cloudinary-gallery-simple.js  # Load ảnh từ Cloudinary
│   └── cloudinary-upload-widget.js   # Upload widget
└── images/                # Ảnh local (fallback)
```

## 🔧 Cách hoạt động

### 1. Load ảnh
- Website gọi Cloudinary API để lấy danh sách ảnh
- Nếu Cloudinary lỗi, fallback về ảnh local
- Auto-refresh mỗi 60 giây

### 2. Upload ảnh
- Sử dụng Cloudinary Upload Widget
- Upload trực tiếp từ browser
- Không cần server

### 3. GitHub Pages
- Hoạt động hoàn toàn trên frontend
- Không cần Node.js hay server
- Static hosting

## 🎯 Lợi ích

- ✅ **Miễn phí**: GitHub Pages + Cloudinary free tier
- ✅ **Nhanh**: CDN toàn cầu
- ✅ **Tự động**: Không cần quản lý server
- ✅ **Collaboration**: Nhiều người upload cùng lúc
- ✅ **Responsive**: Hoạt động trên mọi thiết bị

## 🐛 Troubleshooting

### Ảnh không hiển thị
- Kiểm tra console (F12) để xem lỗi
- Đảm bảo Cloudinary preset `woodville` tồn tại
- Kiểm tra folder `woodville-gallery` có ảnh

### Upload không hoạt động
- Kiểm tra upload preset có set `unsigned`
- Đảm bảo Cloudinary script đã load
- Kiểm tra console để xem lỗi

### Performance
- Ảnh được tự động optimize bởi Cloudinary
- Lazy loading cho gallery
- CDN toàn cầu cho tốc độ nhanh

## 📞 Hỗ trợ

Nếu có vấn đề, kiểm tra:
1. Console browser (F12)
2. Cloudinary Dashboard
3. GitHub Pages settings

---

**Made with ❤️ for Woodville friends**
