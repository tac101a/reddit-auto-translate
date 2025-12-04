# Reddit Auto Translate (vi) — v6.2 (MV2 / Instant Redirect)

![Version](https://img.shields.io/badge/version-v6.2-blue) ![Manifest](https://img.shields.io/badge/manifest-v2-orange) ![Status](https://img.shields.io/badge/status-stable-green)

[🇬🇧 English](#english) | [🇻🇳 Tiếng Việt](#tiếng-việt)

> ⚠️ **DISCLAIMER:**
> Đây là công cụ **Kích hoạt** chế độ dịch của Reddit, không phải công cụ dịch thuật.
> Extension hoạt động dựa trên tính năng `?tl=vi` của Reddit. Nếu bài đăng chưa được Reddit hỗ trợ dịch, extension sẽ hiển thị bản gốc.
>
> This is a **Native Translation Enabler**, not a translation engine.
> It relies on Reddit's `?tl=vi` feature. If a post is not supported by Reddit, it will display the original version.
> 
---

<a name="english"></a>
## 🇬🇧 English Description

A high-performance extension for Chrome / Edge / Opera GX.
Automatically redirects Reddit posts to the Vietnamese translated version (`?tl=vi`).

> **Note:** This version uses **Manifest V2** to unlock the full power of `webRequestBlocking` (synchronous). This ensures redirects happen **instantly** before the page loads, eliminating double-loading or flashing.

### 🚀 Features

- **Zero-Delay Redirect**: Uses synchronous blocking listeners to force `?tl=vi` immediately.
- **Smart Loop Protection**: Uses an in-memory `Set` + `storage.local` to track attempts. Tries redirecting **once per post per session** to prevent infinite loops if Reddit refuses to translate.
- **Respects Original**: If you manually choose "Show Original" (or the URL has `?show=original`), the extension will back off.
- **Opera GX Compatible**: Works perfectly on browsers that have strict MV3 limitations for packed extensions.

### 🛠️ Installation

1.  **Download** or **Clone** this repository.
2.  Open your browser's extension manager:
    - Chrome/Edge: `chrome://extensions`
    - Opera: `opera://extensions`
3.  Enable **Developer mode** (top right corner).
4.  Click **Load unpacked** and select the folder containing this code.

> ⚠️ **Warning:** You may see a generic warning: *"Manifest version 2 is deprecated..."*. You can safely **ignore** this. It is just a notice from Google, the extension works perfectly in Developer Mode.

### ⚙️ Architecture

- **`manifest.json`**: MV2, Persistent Background Page.
- **`background.js`**: Central logic. Handles `onBeforeRequest` (Blocking) and manages the `triedCache`.
- **`popup.js`**: Handles manual overrides (Open as Translated / Open as Original) and cache clearing.

---

<a name="tiếng-việt"></a>
## 🇻🇳 Tiếng Việt

Extension tự động chuyển hướng các bài viết trên Reddit sang phiên bản Tiếng Việt (`?tl=vi`) ngay lập tức.
Phiên bản này sửa lỗi khó chịu của Reddit khi bạn lỡ bấm "Show Original" và không thể quay lại bản dịch.

### ✨ Tính năng nổi bật

- **Tốc độ ánh sáng**: Chuyển hướng ngay lập tức trước khi trang web tải. Không bị chớp nháy, không tải lại trang 2 lần.
- **Thông minh**: Tự động phát hiện nếu bài viết không hỗ trợ dịch để tránh bị lỗi vòng lặp (reload liên tục).
- **Tôn trọng người dùng**: Nếu bạn bấm nút "Xem bản gốc" (Show Original), extension sẽ ghi nhớ và không tự động dịch lại bài đó nữa.
- **Hỗ trợ Opera GX**: Chạy mượt mà trên Opera GX và các trình duyệt Chromium.

### 📥 Hướng dẫn Cài đặt

Vì đây là phiên bản dành cho Developer (để tối ưu tốc độ), bạn cần cài thủ công:

1.  **Tải về** toàn bộ code này (nút Code -> Download ZIP) và giải nén.
2.  Mở trang quản lý tiện ích của trình duyệt:
    - Chrome/Edge: Gõ `chrome://extensions` vào thanh địa chỉ.
    - Opera: Gõ `opera://extensions`.
3.  Bật chế độ **Developer mode** (Chế độ dành cho nhà phát triển) ở góc trên bên phải.
4.  Bấm nút **Load unpacked** (Tải tiện ích đã giải nén) và chọn thư mục bạn vừa giải nén.

> ⚠️ **Lưu ý:** Nếu trình duyệt hiện cảnh báo *"Manifest version 2 is deprecated..."* (Phiên bản kê khai 2 sắp ngừng hỗ trợ...), bạn cứ **KỆ NÓ**. Đây chỉ là thông báo của Google, extension vẫn hoạt động bình thường và an toàn 100%.

### 🎮 Cách sử dụng

- Cứ lướt Reddit như bình thường! Các bài viết sẽ tự động hiện Tiếng Việt.
- Bấm vào icon của Extension trên thanh công cụ để:
    - **Dịch sang Tiếng Việt**: Ép trang hiện tại sang tiếng Việt.
    - **Xem bản gốc**: Ép trang hiện tại về tiếng Anh gốc.
    - **Reset Cache**: Xóa bộ nhớ tạm nếu extension hoạt động không như ý muốn.