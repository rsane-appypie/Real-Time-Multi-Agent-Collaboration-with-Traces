from agents import Runner
from .triage_agent import triage_agent
import asyncio

async def main_function(user_input):
    """
    Main function that runs the triage agent with the given user input.
    
    Args:
        user_input (str): The input query from the user
        
    Returns:
        The result from the triage agent execution
    """
    result = await Runner.run(triage_agent, user_input)
    return result

if __name__ == "__main__":
    asyncio.run(main_function())