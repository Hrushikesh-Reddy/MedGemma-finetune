import asyncio
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict
from .llm import generate


class WebSocketManager:
    
    def __init__(self):
        self._connections: Dict[str, WebSocket] = {}
        self._tasks: {str, asyncio.Task} = {}
        

    async def connect(self, session_id:str, websocket: WebSocket) -> bool:
        try :
            await websocket.accept()
            self._connections[session_id] = websocket
            return True
        except Exception as e:
            print(f"Connection error for session {session_id} : {e}")
            return False

    async def disconnect(self, session_id:str) -> None:
        
        self._connections.pop(session_id, None)
        
        if session_id in self._tasks and not self._tasks[session_id].done() :
            await self.stop_stream(session_id)
            
        print(f"connection closed for session : {session_id}")
    

    async def _send_message(self, session_id:str, message: dict) -> None:
        
        if session_id not in self._connections:
            print("Attempted to send message to a closed connection for session {session_id}")
            return
        
        try:    
            ws = self._connections[session_id]
            await ws.send_json(message)
        except WebSocketDisconnect:
            print("Websocket disconnected while sending message for session {session_id}")
            await self.disconnect(session_id)
        except Exception as e:
            print(f"Error sending message for session {session_id} {e} {message}")
            await self.disconnect(session_id)
    
    async def _save_message(self, session_id:str, message:str):
        pass
        
    def add_task(self, session_id:str, task:asyncio.Task) -> None:
        self._tasks[session_id] = task
    
    async def start_stream(self, session_id:str, prompt:str) -> None:
        
        if session_id not in self._connections:
            raise ValueError("No active connection for session {session_id}") 
        
        try:
            stream = await generate(prompt)
            # Process and print each chunk as it arrives
            result=[]
            async for chunk in stream:
                message = {
                    "type":"message",
                    "done":chunk.done,
                    "content" : chunk['message']['content'],
                }
                result.append(message["content"])
                await self._send_message(session_id, message)
                
            await self._save_message(session_id, "".join(result))
        except asyncio.CancelledError:
            print(f"run interrupted by user {e}")
            await asyncio.shield(self._save_message(session_id, "".join(result)))
            raise # ?
        except Exception as e:
            await self._send_message(session_id, {"type" : "Error", "reason" : f"{e}"})
            print(f"Error streaming for session {session_id}: {e}")
        finally:
            self._tasks.pop(session_id, None)
    
    async def stop_stream(self, session_id) -> None:
        if session_id not in self._tasks:
            print(f"Unable to stop stream, No active runs in session {session_id}")
            return
        
        try:
            task = self._tasks[session_id]
            task.cancel()
            message = {
                "type":"stopped",
                "reason" : "Interrupted by user"
            }
            await self._send_message(session_id, message)
        except Exception as e:
            print(f"Error cancelling run for session : {session_id} -> {e}")
        finally:
            print(f"stopped run for session {session_id}")
            self._tasks.pop(session_id, None)
        
    
    
            



