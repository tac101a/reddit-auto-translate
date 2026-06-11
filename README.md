# Reddit Auto Translate (vi) — v3.0 (Manifest V3)

![Version](https://img.shields.io/badge/version-v3.0-blue) ![Manifest](https://img.shields.io/badge/manifest-v3-orange) ![Status](https://img.shields.io/badge/status-stable-green) ![Privacy](https://img.shields.io/badge/privacy-isolated-purple)

[🇬🇧 English](#english) | [🇻🇳 Tiếng Việt](#tiếng-việt)

> **DISCLAIMER:**
> Đây là công cụ **Kích hoạt** chế độ dịch của Reddit, không phải công cụ dịch thuật.
> Extension hoạt động dựa trên tính năng `?tl=vi` của Reddit. Nếu bài đăng chưa được Reddit hỗ trợ dịch, extension sẽ hiển thị bản gốc.
>
> This is a **Native Translation Enabler**, not a translation engine.
> It relies on Reddit's `?tl=vi` feature. If a post is not supported by Reddit, it will display the original version.

---

<a name="english"></a>
## 🇬🇧 Description

A high-performance, privacy-first extension for Chromium browsers. Automatically redirects supported Reddit posts to the Vietnamese translated version (`?tl=vi`). 

This v3.0 update features a complete architectural rewrite to **Manifest V3**, moving from a persistent background page to an event-driven Service Worker, ensuring zero background resource consumption when idle.

### Key Improvements & Architecture

- **Zero Persistent RAM:** Powered by an MV3 module service worker that starts on-demand and sleeps when idle.
- **O(1) Session State:** Redirect attempts are stored as independent `chrome.storage.session` keys. This eliminates disk I/O lag and prevents read-modify-write race conditions.
- **Synchronous Redirect Locks:** In-memory locks prevent duplicate redirects when Reddit SPA navigation events fire at nearly the same time.
- **SPA-Aware Routing:** Utilizes `chrome.webNavigation.onHistoryStateUpdated` to seamlessly catch Reddit's internal Single Page Application route changes without heavy request blocking.
- **Privacy First (Incognito Split):** Configured with `"incognito": "split"`. Normal and Incognito windows run entirely separate service workers and session storages. Cache state never leaks between browsing modes.

### Installation

1. **Clone** or **Download** this repository as a ZIP and extract it.
2. Open your browser's extension manager (`chrome://extensions` or `opera://extensions`).
3. Enable **Developer mode** (top right corner).
4. Click **Load unpacked** and select the extracted folder.

### Usage

- Browse Reddit normally. Eligible pages are automatically redirected **once per session**.
- Use the Extension Popup to:
  - **Translate to Vietnamese:** Force the current page to translate.
  - **Show Original:** Add `show=original` to the current URL. Reddit and the extension treat that URL as an explicit request to skip translation.
  - **Clear Cache:** Manually wipe the session memory if you want the extension to attempt translating previously visited links again.

---

<a name="tiếng-việt"></a>
## 🇻🇳 Mô tả

Extension tự động chuyển hướng các bài viết trên Reddit sang phiên bản Tiếng Việt (`?tl=vi`).
Phiên bản v3.0 là một đợt trùng tu toàn diện về mặt kiến trúc, chuyển đổi hoàn toàn sang **Manifest V3** để tối ưu hóa hiệu năng và bảo vệ quyền riêng tư.

### Tính năng & Cải tiến cốt lõi

- **Không ngốn RAM (Zero Persistent RAM):** Chuyển từ Background Page (chạy ngầm vĩnh viễn) sang Service Worker (chỉ thức dậy khi cần thiết). Hoàn toàn không gây giật lag cho trình duyệt hay các trang web khác.
- **Tốc độ xử lý O(1):** Dữ liệu bộ nhớ tạm được lưu trên RAM (`chrome.storage.session`) với các key độc lập, loại bỏ hoàn toàn hiện tượng nghẽn cổ chai (Disk I/O) khi đọc/ghi ổ cứng.
- **Khóa chuyển hướng đồng bộ:** Các khóa in-memory ngăn chuyển hướng trùng lặp khi nhiều sự kiện điều hướng SPA của Reddit chạy gần như cùng lúc.
- **Tương thích SPA:** Hoạt động mượt mà với cơ chế tải trang động (Single Page Application) của Reddit nhờ API `onHistoryStateUpdated`.
- **Bảo mật tuyệt đối (Incognito Split):** Khi lướt Reddit ở chế độ Ẩn danh (Incognito), trình duyệt sẽ tạo một Service Worker riêng biệt. Lịch sử dịch của bạn ở tab thường sẽ **không** bị rò rỉ sang tab ẩn danh và ngược lại.

### Hướng dẫn Cài đặt

1. **Tải về** toàn bộ code này (nút Code -> Download ZIP) và giải nén.
2. Mở trang quản lý tiện ích của trình duyệt (Gõ `chrome://extensions` hoặc `opera://extensions`).
3. Bật chế độ **Developer mode** (Chế độ dành cho nhà phát triển) ở góc trên bên phải.
4. Bấm nút **Load unpacked** (Tải tiện ích đã giải nén) và chọn thư mục bạn vừa giải nén.

### Cách sử dụng

- Cứ lướt Reddit như bình thường. Các bài viết hợp lệ sẽ tự động hiện Tiếng Việt (chỉ tự động 1 lần cho mỗi bài đăng trong một phiên làm việc).
- Bấm vào icon của Extension trên thanh công cụ để:
  - **Dịch sang Tiếng Việt**: Ép trang hiện tại sang tiếng Việt.
  - **Xem bản gốc**: Thêm `show=original` vào URL hiện tại. Reddit và extension xem URL đó là yêu cầu rõ ràng để bỏ qua dịch tự động.
  - **Reset Cache**: Xóa bộ nhớ tạm của extension trong trường hợp bạn muốn extension tự động dịch lại các bài viết đã xem.
