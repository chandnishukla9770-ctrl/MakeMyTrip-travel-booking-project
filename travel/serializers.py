from rest_framework import serializers
from .models import Destination, Hotel, TravelPackage


class DestinationSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = "__all__"

    def get_image(self, obj):
        if obj.image:
            return obj.image.url

        destination_images = {
            "Goa": "/media/destinations/Goa.jpg",
            "kasol": "/media/destinations/kasol.jpg",
            "manali": "/media/destinations/manali.jpg",
            "Ooty": "/media/destinations/Ooty.webp",
            "Munnar (Kerala)": "/media/destinations/munnar.webp",
        }

        return destination_images.get(obj.name)


class HotelSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = "__all__"

    def get_image(self, obj):
        if obj.image:
            return obj.image.url

        hotel_images = {
            "Goa Beach Resort": "/media/hotels/goa_beach_resort.jpg",
            "Kasol valley resort": "/media/hotels/kasol_valley_resort.jpg",
            "Snow valley resort, manali": "/media/hotels/manali.jpg",
            "The Abode by brown tree resort": "/media/hotels/Ooty.webp",
            "Munnar tea hills resort": "/media/hotels/munnar.webp",
        }

        return hotel_images.get(obj.name)


class TravelPackageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = TravelPackage
        fields = "__all__"

    def get_image(self, obj):
        if obj.image:
            return obj.image.url

        package_images = {
            "Goa beach holiday": "/media/packages/Goa.jpg",
            "Kasol mountain escape": "/media/packages/kasol_valley_resort.jpg",
            "Snow valley resort, manali": "/media/packages/manali.jpg",
            "The Abode by brown tree resort": "/media/packages/Ooty.webp",
            "Munnar tea hills resort": "/media/packages/munnar.webp",
        }

        return package_images.get(obj.name)
