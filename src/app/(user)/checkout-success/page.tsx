import PaymentSuccess from '@/components/checkout/PaymentSuccess';

export default function PaymentSuccessPage() {
	return (
		<div>
			<PaymentSuccess
				orderId="ORD-2024-12345"
				orderTotal={2450000}
				customerEmail="khachhang@example.com"
				estimatedDelivery="2-3 ngày làm việc"
			/>
		</div>
	);
}