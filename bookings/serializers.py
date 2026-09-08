from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):

    travel_package_name = serializers.CharField(
        source='travel_package.name',
        read_only=True
    )
    travel_package_description = serializers.CharField(
        source='travel_package.description',
        read_only=True
    )
    travel_package_duration = serializers.CharField(
        source='travel_package.duration',
        read_only=True
    )
    travel_package_price = serializers.DecimalField(
        source='travel_package.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    destination_name = serializers.CharField(
        source='travel_package.destination.name',
        read_only=True
    )

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['user']
