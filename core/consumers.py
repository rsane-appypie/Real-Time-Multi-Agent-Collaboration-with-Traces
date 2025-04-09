import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TraceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("trace_logs", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("trace_logs", self.channel_name)

    async def receive(self, text_data):
        # For receiving messages from frontend (optional)
        pass

    async def send_trace(self, event):
        await self.send(text_data=json.dumps(event["trace"]))
