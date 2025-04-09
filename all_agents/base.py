from agents import Runner
from .triage_agent import triage_agent
import asyncio

async def main_function(user_input):
    result = await Runner.run(triage_agent, user_input)
    print(result.final_output)
    return result

if __name__ == "__main__":
    asyncio.run(main_function())