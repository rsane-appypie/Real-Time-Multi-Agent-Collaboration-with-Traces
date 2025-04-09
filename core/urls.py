from django.urls import path
from . import views

urlpatterns = [
    path('execute_query', views.execute_query, name='execute_query'),
]
