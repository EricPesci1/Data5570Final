from rest_framework import viewsets
from .models import Restaurant, Customer
from .serializers import RestaurantSerializer, CustomerSerializer


class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
