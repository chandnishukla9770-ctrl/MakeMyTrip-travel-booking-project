from django.shortcuts import render
from rest_framework import viewsets, status
from .models import Booking
from .serializers import BookingSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Booking, Payment
import razorpay
from django.conf import settings

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print("CURRENT USER:", self.request.user)
        print("IS AUTHENTICATED:", self.request.user.is_authenticated)

        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(
        detail=False,
        methods=['get'],
        permission_classes=[IsAdminUser],
        url_path='admin'
    )
    def admin_bookings(self, request):
        bookings = Booking.objects.all()
        serializer = self.get_serializer(bookings, many=True)

        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()

        if booking.status == 'Cancelled':
            return Response(
                {'message': 'Booking is already cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'Cancelled'
        booking.save()

        return Response(
            {
                'message': 'Booking cancelled successfully.',
                'booking': BookingSerializer(booking).data
            },
            status=status.HTTP_200_OK
        )


class CreatePaymentOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
            return Response(
                {"error": "Razorpay test keys are not configured on the server."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        if settings.RAZORPAY_TEST_MODE and not settings.RAZORPAY_KEY_ID.startswith("rzp_test_"):
            return Response(
                {"error": "Only Razorpay test keys are allowed for this demo."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        booking_id = request.data.get("booking_id")

        try:
            booking = Booking.objects.get(
                id=booking_id,
                user=request.user
            )
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        amount = int(booking.total_price * 100)

        try:
            razorpay_order = client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": 1
            })
        except razorpay.errors.BadRequestError as error:
            return Response(
                {"error": "Razorpay rejected the test order. Check the test keys and amount."},
                status=status.HTTP_502_BAD_GATEWAY
            )

        payment, _ = Payment.objects.get_or_create(
            booking=booking,
            defaults={
                "razorpay_order_id": razorpay_order["id"],
                "amount": booking.total_price,
                "status": "Created"
            }
        )
        if payment.razorpay_order_id != razorpay_order["id"]:
            payment.razorpay_order_id = razorpay_order["id"]
            payment.razorpay_payment_id = None
            payment.amount = booking.total_price
            payment.status = "Created"
            payment.save()

        return Response({
            "order_id": razorpay_order["id"],
            "amount": amount,
            "currency": "INR",
            "key": settings.RAZORPAY_KEY_ID,
            "payment_id": payment.id
        })


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")

        try:
            payment = Payment.objects.get(
                razorpay_order_id=razorpay_order_id,
                booking__user=request.user
            )
        except Payment.DoesNotExist:
            return Response(
                {"error": "Payment record not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            })

            payment.razorpay_payment_id = razorpay_payment_id
            payment.status = "Paid"
            payment.save()

            booking = payment.booking
            booking.status = "Confirmed"
            booking.save()

            return Response(
                {
                    "message": "Payment verified successfully.",
                    "payment_id": razorpay_payment_id,
                    "booking_id": booking.id,
                    "booking_status": booking.status,
                },
                status=status.HTTP_200_OK
            )

        except razorpay.errors.SignatureVerificationError:
            payment.status = "Failed"
            payment.save()

            return Response(
                {"error": "Payment verification failed."},
                status=status.HTTP_400_BAD_REQUEST
            )
