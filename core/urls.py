from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('plan_trip', views.plan_trip, name='plan_trip'),
]
