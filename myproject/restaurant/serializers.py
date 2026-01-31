from rest_framework import serializers
from .models import Restaurant, Customer


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['RestID', 'RestaurantName', 'Location', 'Description', 'Type']


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'created_at']
        read_only_fields = ['created_at']
