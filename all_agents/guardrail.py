from agents import GuardrailFunctionOutput, Agent, Runner
from pydantic import BaseModel

class HomeworkOutput(BaseModel):
    is_homework: bool
    reasoning: str

guardrail_agent = Agent(
    name="Guardrail check",
    instructions="Check if the user is asking about homework.",
    output_type=HomeworkOutput,
)

async def homework_guardrail(ctx, agent, input_data):
    """
    Guardrail function that checks if the user input is related to homework.
    
    Args:
        ctx: The context object containing execution context
        agent: The agent instance
        input_data: The input data to be checked
        
    Returns:
        GuardrailFunctionOutput: Contains the output info and whether the guardrail was triggered
    """
    result = await Runner.run(guardrail_agent, input_data, context=ctx.context)
    final_output = result.final_output_as(HomeworkOutput)
    return GuardrailFunctionOutput(
        output_info=final_output,
        tripwire_triggered=not final_output.is_homework,
    )