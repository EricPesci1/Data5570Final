from django.db import models


class Session(models.Model):
    date = models.DateField(blank=True, null=True)
    stakes = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=255, blank=True)
    duration = models.CharField(max_length=50, blank=True)
    total_buyins = models.DecimalField(max_digits=10, decimal_places=2)
    total_cashout = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Session on {self.date} at {self.location}"


class PlayerNote(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255, blank=True)
    stakes = models.CharField(max_length=50, blank=True)
    playstyle = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
