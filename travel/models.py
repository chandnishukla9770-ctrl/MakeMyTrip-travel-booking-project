from django.db import models
# Create your models here.

class Destination(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='destinations/', blank=True, null=True)

    def __str__(self):
        return self.name


class Hotel(models.Model):
    destinations = models.ForeignKey(
        Destination, on_delete=models.CASCADE, related_name='hotels')

    name = models.CharField(max_length=150)
    description = models.TextField()
    location = models.CharField(max_length=200)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    image = models.ImageField(upload_to='hotels/', blank=True, null=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class TravelPackage(models.Model):
    destination = models.ForeignKey(
        Destination, on_delete=models.CASCADE, related_name='packages')

    name = models.CharField(max_length=150)
    description = models.TextField()
    duration = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='packages/', blank=True, null=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name
