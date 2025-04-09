from django.shortcuts import render
from django.http import JsonResponse
from all_agents.base import main_function

def home(request):
    return render(request, '../static/js/trace.js')

def plan_trip(request):
    user_input = request.GET.get('user_input', '')
    result = main_function(user_input)
    return JsonResponse({'output': result.final_output})
