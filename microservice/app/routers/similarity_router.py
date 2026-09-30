import asyncio
from fastapi import APIRouter, Request, HTTPException

from app.models.schemas import (
    SimilarityScoreRequest, SimilarityScoreResponse,
    EncodeRequest, EncodeResponse
)
from app.config import settings

router = APIRouter(prefix="/api/similarity", tags=["similarity"])

@router.post("/score", response_model=SimilarityScoreResponse)
async def score_similarity(request_body: SimilarityScoreRequest, request: Request):
    try:
        codebert = request.app.state.codebert
        
        score = await asyncio.to_thread(
            codebert.compute_similarity,
            request_body.user_code,
            request_body.optimal_code
        )
        
        threshold_met = score >= settings.SIMILARITY_THRESHOLD
        
        return {
            "score": score,
            "threshold_met": threshold_met,
            "threshold": settings.SIMILARITY_THRESHOLD
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/encode", response_model=EncodeResponse)
async def encode_code(request_body: EncodeRequest, request: Request):
    try:
        codebert = request.app.state.codebert
        
        vector = await asyncio.to_thread(
            codebert.encode,
            request_body.code
        )
        
        return {"vector": vector.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
