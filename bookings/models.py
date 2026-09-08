from django.db import models
from django.contrib.auth.models import User
from travel.models import TravelPackage

# Create your models here.
class Booking(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='bookings')
    travel_package = models.ForeignKey(
        TravelPackage, on_delete=models.CASCADE, related_name='bookings')

    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=15)
    number_of_people = models.PositiveIntegerField(default=1)
    travel_date = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    Status_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
    ]

    status = models.CharField(
        max_length=10, choices=Status_CHOICES, default='Pending')

    def __str__(self):
        return f"{self.customer_name} - {self.travel_package.name}"
