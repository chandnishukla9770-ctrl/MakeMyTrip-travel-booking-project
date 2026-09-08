from django.shortcuts import render
from rest_framework import viewsets, status
from .models import Booking
from .serializers import BookingSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.


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
