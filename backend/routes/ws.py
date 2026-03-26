import asyncio
from ..datamodel.types import Run
from ..connection import WebSocketManager
from ..dependencies import get_websocket_manager, get_db
from fastapi import Depends, APIRouter, WebSocket, WebSocketDisconnect
from loguru import logger

router = APIRouter() 

@router.websocket("/runs/{session_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    session_id: str,
    websocket_manager:WebSocketManager = Depends(get_websocket_manager),
):
    connected = await websocket_manager.connect(session_id, websocket)
    if not connected:
        await websocket.close(code=4002, reason="Failed to establish connection")
        logger.error("Failed to establish connection")
        return

    try:
        while True:
            data = await websocket.receive_json()
            
            if data.get("type") == "start":
                run = Run.model_validate(data.get("Run")).model_dump()
                task = asyncio.create_task(websocket_manager.start_stream(
                    session_id,
                    run.get("input"),
                ))
                websocket_manager.add_task(session_id, task)
                logger.info(f"Started streaming response for prompt: {run.get("input").get("prompt")}")
                
            elif data.get("type") == "stop":
                await websocket_manager.stop_stream(session_id)
                
    except WebSocketDisconnect:
        logger.info(f"Websocket disconnected for session {session_id}")
    except Exception as e:
        logger.error(f"Websocket error: {e}")
    finally:
        await websocket_manager.disconnect(session_id)
        
        
        
