from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
from ..connection import WebSocketManager 
from ..datamodel.types import Run 

router = APIRouter()
ws_manager = WebSocketManager()

@router.websocket("/ws/{session_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    session_id: str
):
    connected = await ws_manager.connect(session_id, websocket)
    if not connected:
        await websocket.close(code=4002, reason="Failed to establish connection")
        return

    try:
        while True:
            data = await websocket.receive_json()
            
            if data.get("type") == "start":
                run = Run.model_validate(data.get("Run"))
                task = asyncio.create_task(ws_manager.start_stream(
                    session_id,
                    run.input,
                ))
                ws_manager.add_task(session_id, task)
                print("Started streaming response for prompt:", run.input.prompt)
                
            elif data.get("type") == "stop":
                await ws_manager.stop_stream(session_id)
                
    except WebSocketDisconnect:
        await ws_manager.disconnect(websocket)
    except Exception as e:
        print(f"Error: {e}")
        
        
        
