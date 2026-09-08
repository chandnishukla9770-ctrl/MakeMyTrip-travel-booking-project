from django.shortcuts import render
from .models import Destination, Hotel, TravelPackage
from rest_framework import viewsets
from .serializers import (
    DestinationSerializer,
    HotelSerializer,
    TravelPackageSerializer
)

# Create your views here.


class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer


class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer


class TravelPackageViewSet(viewsets.ModelViewSet):
    queryset = TravelPackage.objects.all()
    serializer_class = TravelPackageSerializer

    def get_queryset(self):
        destination_id = self.request.query_params.get("destination")
        if destination_id:
            return TravelPackage.objects.filter(destination_id=destination_id)
        return TravelPackage.objects.all()
