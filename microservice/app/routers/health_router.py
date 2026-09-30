import time
from fastapi import APIRouter, Request

from app.models.schemas import HealthResponse

router = APIRouter(tags=["health"])

@router.get("/health", response_model=HealthResponse)
async def health_check(request: Request):
    uptime = time.time() - request.app.state.start_time
    
    parsers = []
    if hasattr(request.app.state, 'ts_service'):
        parsers = list(request.app.state.ts_service.languages.keys())
        
    model_loaded = hasattr(request.app.state, 'codebert')
    
    return {
        "status": "ok",
        "model_loaded": model_loaded,
        "parsers_loaded": parsers,
        "uptime_seconds": uptime
    }
