from agents import Runner, Agent, InputGuardrail, ItemHelpers
import asyncio
import mlflow
import openai
import os
import json
mlflow.openai.autolog()
# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:8080")
mlflow.set_experiment("OpenAI")


def get_all_agents(user_input):
    """
    Generates a list of specialized agents based on the user's input using OpenAI.
    
    Args:
        user_input (str): The user's query or problem statement
        
    Returns:
        dict: A dictionary containing the list of agents with their names, responsibilities, and instructions
        
    Raises:
        ValueError: If OpenAI API key is not found in environment variables
        Exception: If there's an error calling the OpenAI API
    """
    # Get the API key from environment variable
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("OpenAI API key not found in environment variables")

    # Initialize OpenAI client
    client = openai.OpenAI(api_key=api_key)

    PROMPT = f"""
You are tasked with designing a Multi-Agent System (MAS) to solve the following problem:
"{user_input}"
Break this problem down and create a list of specialized agents that would collaboratively solve this task. For each agent, specify:

- AgentName: A single-word name for the agent
- Responsibility: A detailed description of the agent's role
- Instructions: A detailed instruction to the agent about its role and how it should solve the problem

Return the response in the following JSON format:

{{
    "agents": [
        {{
            "AgentName": "string",
            "Responsibility": "string",
            "Instructions": "string"
        }},
        ...
    ]
}}

The list should contain a maximum of 4 agents.
"""

    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system",
                    "content": "You are an expert in designing Multi-Agent Systems."},
                {"role": "user", "content": PROMPT}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        # Return the response content
        return json.loads(response.choices[0].message.content)

    except Exception as e:
        raise Exception(f"Error calling OpenAI API: {str(e)}")


async def main_function(user_input):
    """
    Main function that orchestrates the multi-agent system to solve the user's query.
    
    Args:
        user_input (str): The user's query or problem statement
        
    Returns:
        The final result from the manager agent after processing all specialized agents' outputs
    """
    agents_data = get_all_agents(user_input)

    agents_list = []

    for agent in agents_data.get("agents"):
        agents_list.append(Agent(
            name=agent.get("AgentName"),
            # handoffs=agent.get("InterAgentCommunication"),
            handoff_description=agent.get("Responsibility"),
            instructions=agent.get("Instructions")
        ))

    # Run all agents in parallel
    agent_tasks = [Runner.run(agent, user_input) for agent in agents_list]
    results = await asyncio.gather(*agent_tasks)

    # Process results
    agents_results = [ItemHelpers.text_message_outputs(result.new_items) for result in results]
    compiled_result = "\n\n".join(agents_results)
    manager_agent = Agent(
        name="Manager Agent",
        instructions=f"""You are the central controller. Your role is to submit the final result to the user. 
        User Input:{user_input},
        Agents Results: {compiled_result}
        """,
    )
    result = await Runner.run(manager_agent, user_input)
    return result


if __name__ == "__main__":
    asyncio.run(main_function(
        "Generate a personalized travel itinerary for a 3 day trip from delhi to rishikesh in budget of 10000 INR in may month covering all the places of interest in rishikesh and haridwar."))
