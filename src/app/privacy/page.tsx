import PolicyPageLayout from "@/components/auth/PolicyPageLayout";

export default function PrivacyPage() {
  return (
    <PolicyPageLayout
      title="Chính sách Bảo mật"
      lastUpdated="Ngày cập nhật cuối: 21/05/2025"
    >
      {/* can be changed in the future with practical content */}
      <p>
        Chính sách Bảo mật này mô tả cách MysticalGold thu thập, sử dụng và chia
        sẻ thông tin cá nhân của bạn khi bạn sử dụng dịch vụ của chúng tôi.
        Chúng tôi cam kết bảo vệ quyền riêng tư của bạn.
      </p>

      <h2>1. Thông tin chúng tôi thu thập</h2>
      <p>Chúng tôi có thể thu thập các loại thông tin sau:</p>
      <ul>
        <li>
          <strong>Thông tin cá nhân:</strong> Tên, địa chỉ email khi bạn đăng ký
          tài khoản.
        </li>
        <li>
          <strong>Thông tin giao dịch:</strong> Địa chỉ ví công khai, lịch sử
          giao dịch. Chúng tôi không bao giờ thu thập khóa riêng tư của bạn.
        </li>
        <li>
          <strong>Thông tin sử dụng:</strong> Dữ liệu về cách bạn tương tác với
          dịch vụ của chúng tôi, chẳng hạn như địa chỉ IP, loại trình duyệt,
          thời gian truy cập.
        </li>
      </ul>

      <h2>2. Cách chúng tôi sử dụng thông tin</h2>
      <p>Thông tin của bạn được sử dụng để:</p>
      <ul>
        <li>Cung cấp và duy trì dịch vụ.</li>
        <li>Cải thiện và cá nhân hóa trải nghiệm người dùng.</li>
        <li>Giao tiếp với bạn, bao gồm việc gửi các thông báo bảo mật.</li>
        <li>Ngăn chặn gian lận và đảm bảo an ninh cho nền tảng.</li>
      </ul>

      <h2>3. Chia sẻ thông tin</h2>
      <p>
        Chúng tôi không bán, trao đổi, hoặc cho thuê thông tin cá nhân của bạn
        cho bên thứ ba. Chúng tôi chỉ có thể chia sẻ thông tin khi có yêu cầu
        pháp lý hoặc để bảo vệ quyền lợi của chúng tôi và cộng đồng.
      </p>

      <h2>4. Bảo mật dữ liệu</h2>
      <p>
        Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn ngành, bao gồm mã hóa
        và kiểm soát truy cập, để bảo vệ dữ liệu của bạn khỏi bị truy cập, thay
        đổi hoặc phá hủy trái phép.
      </p>
    </PolicyPageLayout>
  );
}
