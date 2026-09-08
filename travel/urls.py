from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DestinationViewSet, HotelViewSet, TravelPackageViewSet

router = DefaultRouter()

router.register('destinations', DestinationViewSet)
router.register('hotels', HotelViewSet)
router.register('packages', TravelPackageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
