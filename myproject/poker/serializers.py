from rest_framework import serializers
from .models import Session, PlayerNote


class SessionSerializer(serializers.ModelSerializer):
    date = serializers.DateField(
        input_formats=['%m/%d/%Y', '%Y-%m-%d'],
        required=False,
        allow_null=True
    )

    class Meta:
        model = Session
        fields = ['id', 'date', 'stakes', 'location', 'duration', 'total_buyins', 'total_cashout', 'notes']


class PlayerNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerNote
        fields = ['id', 'name', 'location', 'stakes', 'playstyle', 'notes', 'created_at']
        read_only_fields = ['created_at']
