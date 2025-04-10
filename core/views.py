from django.shortcuts import render
from django.http import JsonResponse
from all_agents.master_triage_agent import main_function
import os

def home(request):
    return render(request, 'trace.html')

async def execute_query(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    user_input = request.POST.get('prompt', '')
    api_key = request.POST.get('OPENAI_API_KEY', '')
    
    if not user_input or not api_key:
        return JsonResponse({'error': 'Missing required parameters'}, status=400)
    
    # Set the API key in environment
    os.environ['OPENAI_API_KEY'] = api_key
    
    try:
        result = await main_function(user_input)
        return JsonResponse({'output': result.final_output})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
