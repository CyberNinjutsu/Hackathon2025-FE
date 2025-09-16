import PolicyPageLayout from "@/components/auth/PolicyPageLayout"

export default function TermsPage() {
  return (
    <PolicyPageLayout
      title="Điều khoản Dịch vụ"
      lastUpdated="Ngày cập nhật cuối: 21/05/2024"
    >
      {/* can be changed in the future with practical content */}
      <p>
        Chào mừng bạn đến với MysticalGold! Vui lòng đọc kỹ các Điều khoản Dịch vụ
        (&ldquo;Điều khoản&rdquo;) này trước khi sử dụng dịch vụ của chúng tôi. Bằng việc truy cập
        hoặc sử dụng Dịch vụ, bạn đồng ý bị ràng buộc bởi các Điều khoản này.
      </p>

      <h2>1. Chấp nhận Điều khoản</h2>
      <p>
        Bằng cách tạo tài khoản hoặc sử dụng các dịch vụ do MysticalGold cung
        cấp, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý tuân thủ tất cả
        các điều khoản và điều kiện được nêu trong thỏa thuận này.
      </p>

      <h2>2. Mô tả Dịch vụ</h2>
      <p>
        MysticalGold cung cấp một nền tảng quản lý tài sản số, cho phép người
        dùng theo dõi danh mục đầu tư, thực hiện giao dịch và tương tác với các
        giao thức blockchain. Chúng tôi không phải là một sàn giao dịch, nhà môi
        giới, hay cố vấn tài chính.
      </p>

      <h2>3. Trách nhiệm của Người dùng</h2>
      <p>Bạn có trách nhiệm:</p>
      <ul>
        <li>
          Bảo mật thông tin đăng nhập, khóa riêng tư (private keys) và các
          thông tin xác thực khác.
        </li>
        <li>
          Đảm bảo rằng mọi thông tin bạn cung cấp là chính xác và cập nhật.
        </li>
        <li>
          Tuân thủ tất cả các luật và quy định hiện hành tại khu vực pháp lý
          của bạn.
        </li>
      </ul>

      <h2>4. Giới hạn Trách nhiệm</h2>
      <p>
        Dịch vụ được cung cấp &quot;nguyên trạng&quot; và &quot;sẵn có&quot;. MysticalGold không
        chịu trách nhiệm cho bất kỳ tổn thất nào phát sinh từ việc sử dụng dịch
        vụ, bao gồm nhưng không giới hạn ở việc mất mát tài sản do lỗi bảo mật,
        lỗi phần mềm, hoặc biến động thị trường.
      </p>
    </PolicyPageLayout>
  );
}