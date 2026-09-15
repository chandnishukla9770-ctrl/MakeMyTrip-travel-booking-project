
from django.conf import settings
import razorpay

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import viewsets, status

from .serializers import BookingSerializer
from .models import Booking, Payment


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print("CURRENT USER:", self.request.user)
        print(
            "IS AUTHENTICATED:",
            self.request.user.is_authenticated
        )

        # Normal users can see only their own bookings.
        return Booking.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        # Booking is automatically linked
        # to the currently logged-in user.
        serializer.save(user=self.request.user)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAdminUser],
        url_path="admin",
    )
    def admin_bookings(self, request):
        print(
            "ADMIN ENDPOINT USER:",
            request.user
        )
        print(
            "ADMIN ENDPOINT STAFF:",
            request.user.is_staff
        )

        # IMPORTANT:
        # Admin sees ALL users' bookings.
        bookings = Booking.objects.all().order_by("-id")

        serializer = self.get_serializer(
            bookings,
            many=True
        )

        return Response(serializer.data)

    @action(
        detail=True,
        methods=["post"]
    )
    def cancel(self, request, pk=None):
        booking = self.get_object()

        if booking.status == "Cancelled":
            return Response(
                {
                    "message":
                        "Booking is already cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "Cancelled"
        booking.save()

        return Response(
            {
                "message":
                    "Booking cancelled successfully.",
                "booking":
                    BookingSerializer(booking).data,
            },
            status=status.HTTP_200_OK
        )


class CreatePaymentOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get("booking_id")

        if not booking_id:
            return Response(
                {
                    "error":
                        "Booking ID is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            booking = Booking.objects.get(
                id=booking_id,
                user=request.user
            )
        except Booking.DoesNotExist:
            return Response(
                {
                    "error":
                        "Booking not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        key_id = settings.RAZORPAY_KEY_ID
        key_secret = settings.RAZORPAY_KEY_SECRET

        if not key_id or not key_secret:
            return Response(
                {
                    "error":
                        "Razorpay payment configuration is missing."
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        if (
            settings.RAZORPAY_TEST_MODE
            and not key_id.startswith("rzp_test_")
        ):
            return Response(
                {
                    "error":
                        "Razorpay is configured for test mode, "
                        "but a test key is not being used."
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        razorpay_client = razorpay.Client(
            auth=(key_id, key_secret)
        )

        amount = int(
            booking.total_price * 100
        )

        if amount <= 0:
            return Response(
                {
                    "error":
                        "Invalid booking amount."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            razorpay_order = (
                razorpay_client.order.create(
                    {
                        "amount": amount,
                        "currency": "INR",
                        "receipt":
                            f"booking_{booking.id}",
                        "notes": {
                            "booking_id":
                                str(booking.id),
                            "user_id":
                                str(request.user.id),
                        },
                    }
                )
            )

        except razorpay.errors.BadRequestError as error:
            return Response(
                {
                    "error":
                        "Unable to create Razorpay order.",
                    "details":
                        str(error),
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as error:
            return Response(
                {
                    "error":
                        "Payment service is temporarily unavailable.",
                    "details":
                        str(error),
                },
                status=status.HTTP_502_BAD_GATEWAY
            )

        payment, created = Payment.objects.get_or_create(
            booking=booking,
            defaults={
                "razorpay_order_id":
                    razorpay_order["id"],
                "amount":
                    booking.total_price,
                "status":
                    "Created",
            },
        )

        if not created:
            payment.razorpay_order_id = (
                razorpay_order["id"]
            )
            payment.razorpay_payment_id = None
            payment.amount = booking.total_price
            payment.status = "Created"
            payment.save()

        return Response(
            {
                "order_id":
                    razorpay_order["id"],
                "amount":
                    amount,
                "currency":
                    "INR",
                "key":
                    key_id,
                "payment_id":
                    payment.id,
            }
        )


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get(
            "razorpay_order_id"
        )
        razorpay_payment_id = request.data.get(
            "razorpay_payment_id"
        )
        razorpay_signature = request.data.get(
            "razorpay_signature"
        )

        try:
            payment = Payment.objects.get(
                razorpay_order_id=razorpay_order_id,
                booking__user=request.user
            )
        except Payment.DoesNotExist:
            return Response(
                {
                    "error":
                        "Payment record not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            razorpay_client = razorpay.Client(
                auth=(
                    settings.RAZORPAY_KEY_ID,
                    settings.RAZORPAY_KEY_SECRET
                )
            )

            razorpay_client.utility.verify_payment_signature(
                {
                    "razorpay_order_id":
                        razorpay_order_id,
                    "razorpay_payment_id":
                        razorpay_payment_id,
                    "razorpay_signature":
                        razorpay_signature,
                }
            )

            payment.razorpay_payment_id = (
                razorpay_payment_id
            )
            payment.status = "Paid"
            payment.save()

            booking = payment.booking
            booking.status = "Confirmed"
            booking.save()

            return Response(
                {
                    "message":
                        "Payment verified successfully.",
                    "payment_id":
                        razorpay_payment_id,
                    "booking_id":
                        booking.id,
                    "booking_status":
                        booking.status,
                },
                status=status.HTTP_200_OK
            )

        except razorpay.errors.SignatureVerificationError:
            payment.status = "Failed"
            payment.save()

            return Response(
                {
                    "error":
                        "Payment verification failed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
