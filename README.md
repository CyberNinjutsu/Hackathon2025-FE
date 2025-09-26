# DAMS - Digital Asset Management System

## 🏆 Giới thiệu

DAMS (Digital Asset Management System) là một nền tảng tiên tiến cho việc số hóa tài sản vàng thành token trên blockchain Solana. Dự án cung cấp một giải pháp toàn diện để quản lý, giao dịch và phân tích tài sản số hóa một cách an toàn và hiệu quả.

## ✨ Tính năng chính

### 🔐 Quản lý Tài khoản & Bảo mật

- **Xác thực Wallet**: Kết nối và quản lý ví Solana
- **Bảo mật đa lớp**: Hệ thống xác thực OTP cho admin
- **Quản lý khóa công khai**: Hiển thị và quản lý thông tin ví an toàn

### 💰 Quản lý Tài sản

- **Hiển thị danh mục**: Xem tất cả token trong ví
- **Theo dõi giao dịch**: Lịch sử giao dịch chi tiết với trạng thái real-time
- **Biểu đồ tài sản**: Visualization dữ liệu tài sản với charts tương tác

### 🔄 Giao dịch Token

- **Swap Token**: Trao đổi giữa các loại token khác nhau
- **Giao dịch tức thì**: Thực hiện giao dịch nhanh chóng với phí tối ưu
- **Lịch sử giao dịch**: Theo dõi đầy đủ các giao dịch đã thực hiện

### 🤖 AI-Powered Features

- **Phân tích giao dịch thông minh**: AI phân tích pattern giao dịch và đưa ra lời khuyên
- **Tư vấn đầu tư**: Gemini AI cung cấp insights về thị trường vàng
- **Phân tích giá vàng**: Real-time analysis với dữ liệu thị trường

### 📊 Theo dõi Giá vàng

- **Giá vàng real-time**: Cập nhật giá vàng từ API chuyên nghiệp
- **Biểu đồ giá**: Visualization xu hướng giá vàng
- **Phân tích thị trường**: AI-powered market analysis

### 👨‍💼 Admin Dashboard

- **Quản lý tài sản**: Admin panel để quản lý digital assets
- **Theo dõi giao dịch**: Monitor tất cả giao dịch trong hệ thống
- **Xác thực OTP**: Bảo mật cao với email OTP verification

## 🛠️ Công nghệ sử dụng

### Frontend

- **Next.js 15.5.2**: React framework với App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Radix UI**: Accessible component library
- **Recharts**: Data visualization

### Blockchain

- **Solana Web3.js**: Solana blockchain integration
- **SPL Token**: Solana token standard
- **Token-2022**: Advanced token features

### AI & APIs

- **Google Generative AI**: Gemini AI integration
- **Custom Gold Price API**: Real-time gold price data
- **Email Services**: Nodemailer for OTP

### State Management & Utils

- **SWR**: Data fetching and caching
- **Date-fns**: Date manipulation
- **Axios**: HTTP client
- **Sonner**: Toast notifications

## 🚀 Cài đặt và Chạy dự án

### Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn
- Git

### Cài đặt

1. **Clone repository**

```bash
git clone <repository-url>
cd blockchain-hackathon
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Cấu hình environment variables**

```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong `.env`:

```env
# Gemini AI API Key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Email Configuration (for OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_OTP_SECRET=your_otp_secret

# API Endpoints
NEXT_PUBLIC_GOLD_PRICE_API=https://hackathon2025-be.phatnef.me
```

4. **Chạy development server**

```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

### Build cho production

```bash
npm run build
npm start
```

## 📱 Cấu trúc ứng dụng

### Routes chính

#### Public Routes

- `/` - Trang chủ với thông tin sản phẩm
- `/login` - Đăng nhập và kết nối ví
- `/privacy` - Chính sách bảo mật
- `/terms` - Điều khoản sử dụng

#### User Routes (Yêu cầu kết nối ví)

- `/account` - Quản lý tài khoản và phân tích giao dịch
- `/swap` - Giao dịch và swap token
- `/history` - Lịch sử giao dịch chi tiết
- `/checkout` - Thanh toán và mua token
- `/checkout-success` - Xác nhận giao dịch thành công

#### Admin Routes (Yêu cầu xác thực OTP)

- `/admin` - Dashboard quản trị
- `/admin/assets` - Quản lý tài sản số
- `/admin/transactions` - Theo dõi giao dịch hệ thống
- `/auth` - Xác thực admin với OTP

### API Endpoints

#### AI Services

- `POST /api/ai-investment-advisor` - Tư vấn đầu tư với AI
- `GET/POST /api/gold-price-analysis` - Phân tích giá vàng

#### Admin Services

- `POST /api/admin/send-otp` - Gửi OTP qua email
- `POST /api/admin/verify-otp` - Xác thực OTP

## 🎨 Tính năng nổi bật

### 1. AI Transaction Analysis

- Phân tích pattern giao dịch của người dùng
- Đưa ra lời khuyên đầu tư cá nhân hóa
- Markdown rendering cho báo cáo chi tiết
- Real-time analysis với timeout 35 giây

### 2. Gold Price Integration

- Kết nối API giá vàng real-time
- Biểu đồ xu hướng giá tương tác
- AI-powered market insights
- Historical data tracking

### 3. Solana Blockchain Integration

- Kết nối ví Phantom, Solflare
- Token management và transfer
- Transaction history tracking
- SPL Token support

### 4. Admin Security System

- Email OTP verification
- Rate limiting protection
- Secure session management
- Admin-only routes protection

## 🔧 Cấu hình nâng cao

### Wallet Configuration

Ứng dụng hỗ trợ các ví Solana phổ biến:

- Phantom Wallet
- Solflare
- Các ví tương thích với Solana Web3.js

### AI Configuration

Để sử dụng tính năng AI, cần cấu hình:

1. Google Gemini API key
2. Custom prompts cho phân tích
3. Rate limiting cho API calls

### Email Configuration

Cho tính năng OTP admin:

1. Gmail App Password
2. SMTP configuration
3. Email templates

## 📊 Monitoring & Analytics

### Performance Metrics

- Transaction success rates
- API response times
- User engagement tracking
- Error monitoring

### Security Monitoring

- Failed authentication attempts
- Suspicious transaction patterns
- Admin access logs

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 🆘 Hỗ trợ

Nếu bạn gặp vấn đề hoặc có câu hỏi:

1. Tạo issue trên GitHub
2. Liên hệ team phát triển
3. Xem documentation chi tiết

## 🚀 Roadmap

### Phase 1 (Hiện tại)

- ✅ Basic wallet integration
- ✅ Token management
- ✅ AI transaction analysis
- ✅ Admin dashboard

### Phase 2 (Sắp tới)

- 🔄 Advanced trading features
- 🔄 Mobile app development
- 🔄 Multi-chain support
- 🔄 Enhanced AI capabilities

### Phase 3 (Tương lai)

- 📋 DeFi integration
- 📋 NFT marketplace
- 📋 Staking mechanisms
- 📋 Governance features

---

**DAMS** - Digitizing Gold Assets, Empowering Your Future 🏆✨
