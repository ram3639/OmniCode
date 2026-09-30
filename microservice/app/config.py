import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SIMILARITY_THRESHOLD: float = 0.85
    MODEL_NAME: str = "microsoft/unixcoder-base"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()
