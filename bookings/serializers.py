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
        read_only_fields = ['user', 'total_price', 'status']

    def validate_number_of_people(self, value):
        if value < 1:
            raise serializers.ValidationError(
                'Number of people must be at least 1.'
            )
        return value

    def create(self, validated_data):
        travel_package = validated_data['travel_package']
        number_of_people = validated_data['number_of_people']
        validated_data['total_price'] = (
            travel_package.price * number_of_people
        )
        return super().create(validated_data)
