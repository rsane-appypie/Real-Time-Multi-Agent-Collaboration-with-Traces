from agents import Agent, InputGuardrail
from .history_tutor_agent import history_tutor_agent
from .math_tutor_agent import math_tutor_agent
from .guardrail import homework_guardrail
import mlflow
mlflow.openai.autolog()
# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:8080")
mlflow.set_experiment("OpenAI")

triage_agent = Agent(
    name="Triage Agent",
    instructions="You determine which agent to use based on the user's homework question",
    handoffs=[history_tutor_agent, math_tutor_agent],
    # input_guardrails=[
    #     InputGuardrail(guardrail_function=homework_guardrail),
    # ],
)
