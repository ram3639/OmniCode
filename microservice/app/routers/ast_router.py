import asyncio
from fastapi import APIRouter, Request, HTTPException
from typing import Dict, Any

from app.models.schemas import ASTParseRequest, ASTParseResponse, ASTErrorRequest

router = APIRouter(prefix="/api/ast", tags=["ast"])

@router.post("/parse", response_model=ASTParseResponse)
async def parse_ast(request_body: ASTParseRequest, request: Request):
    try:
        converter = request.app.state.ast_converter
        
        result = await asyncio.to_thread(
            converter.convert,
            request_body.code,
            request_body.language,
            request_body.named_only
        )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/errors")
async def map_errors(request_body: ASTErrorRequest, request: Request):
    try:
        mapper = request.app.state.error_mapper
        
        result = await asyncio.to_thread(
            mapper.map_errors,
            request_body.code,
            request_body.language,
            request_body.compiler_errors
        )
        
        return {"mapped_errors": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
