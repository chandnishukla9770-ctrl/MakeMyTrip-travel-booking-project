from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet, CreatePaymentOrderView, VerifyPaymentView

router = DefaultRouter()

router.register('bookings', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),

    path('create-payment-order/', CreatePaymentOrderView.as_view(),
         name='create-payment-order'),

    path(
        'verify-payment/',
        VerifyPaymentView.as_view(),
        name='verify-payment'
    ),
]
