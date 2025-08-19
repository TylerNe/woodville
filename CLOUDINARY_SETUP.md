# Hướng dẫn setup Cloudinary Upload Preset

## Bước 1: Tạo Upload Preset

1. Đăng nhập vào [Cloudinary Dashboard](https://cloudinary.com/console)
2. Vào **Settings** → **Upload**
3. Cuộn xuống phần **Upload presets**
4. Click **Add upload preset**
5. Điền thông tin:
   - **Preset name**: `woodville_upload` (hoặc tên bạn muốn)
   - **Signing Mode**: `Unsigned`
   - **Folder**: `woodville-gallery`
6. Click **Save**

## Bước 2: Cập nhật JavaScript

Sau khi tạo preset, cập nhật file `js/upload.js`:

```javascript
const CLOUDINARY_CONFIG = {
    cloud_name: 'dqnwatzbo',
    upload_preset: 'woodville_upload', // Thay bằng tên preset bạn vừa tạo
    api_key: '563719699716119'
};
```

## Bước 3: Test Upload

1. Mở website
2. Kéo thả ảnh vào khu vực upload
3. Chọn category và tags
4. Click "Upload to Cloudinary"

## Lưu ý bảo mật:

- Upload preset `unsigned` cho phép upload mà không cần signature
- Chỉ sử dụng cho website public
- Nếu cần bảo mật hơn, sử dụng signed upload với server-side code

## Troubleshooting:

- Nếu lỗi "Upload preset not found": Kiểm tra tên preset trong Cloudinary
- Nếu lỗi CORS: Đảm bảo preset được set là "unsigned"
- Nếu ảnh không hiển thị: Kiểm tra URL trong Cloudinary Media Library
