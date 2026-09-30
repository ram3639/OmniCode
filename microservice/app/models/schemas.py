from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

# Requests
class ASTParseRequest(BaseModel):
    code: str
    language: str
    named_only: bool = True

class ASTErrorRequest(BaseModel):
    code: str
    language: str
    compiler_errors: List[Dict[str, Any]]

class SimilarityScoreRequest(BaseModel):
    user_code: str
    optimal_code: str
    language: str = "python"

class EncodeRequest(BaseModel):
    code: str

# Responses
class ReactFlowNode(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]
    position: Dict[str, float]

class ReactFlowEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    type: Optional[str] = None
    animated: bool = False
    style: Dict[str, Any] = Field(default_factory=dict)

class ASTParseResponse(BaseModel):
    nodes: List[ReactFlowNode]
    edges: List[ReactFlowEdge]
    errors: List[Dict[str, Any]]

class SimilarityScoreResponse(BaseModel):
    score: float
    threshold_met: bool
    threshold: float

class EncodeResponse(BaseModel):
    vector: List[float]

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    parsers_loaded: List[str]
    uptime_seconds: float
