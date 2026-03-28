from rest_framework import viewsets
from .models import Session, PlayerNote
from .serializers import SessionSerializer, PlayerNoteSerializer


class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer


class PlayerNoteViewSet(viewsets.ModelViewSet):
    queryset = PlayerNote.objects.all()
    serializer_class = PlayerNoteSerializer
