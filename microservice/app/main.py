import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.services.tree_sitter_service import TreeSitterService
from app.services.ast_to_flowchart import ASTToFlowchartConverter
from app.services.codebert_service import CodeBERTService
from app.services.error_mapper import ErrorMapper

from app.routers import ast_router, similarity_router, health_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.start_time = time.time()
    
    print("Initializing TreeSitterService...")
    app.state.ts_service = TreeSitterService()
    
    print("Initializing CodeBERTService...")
    app.state.codebert = CodeBERTService(settings.MODEL_NAME)
    
    print("Initializing ASTToFlowchartConverter...")
    app.state.ast_converter = ASTToFlowchartConverter(app.state.ts_service)
    
    print("Initializing ErrorMapper...")
    app.state.error_mapper = ErrorMapper(app.state.ts_service)
    
    yield
    
    print("Shutting down services...")
    # cleanup if necessary

app = FastAPI(title="OmniCode AI Microservice", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router.router)
app.include_router(ast_router.router)
app.include_router(similarity_router.router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
