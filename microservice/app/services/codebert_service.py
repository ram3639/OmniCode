import time
import numpy as np
from sentence_transformers import SentenceTransformer, util

class CodeBERTService:
    def __init__(self, model_name: str):
        start_time = time.time()
        self.model = SentenceTransformer(model_name)
        print(f"Model {model_name} loaded in {time.time() - start_time:.2f} seconds")
        
    def preprocess_code(self, code: str) -> str:
        lines = code.split('\n')
        cleaned_lines = [line.rstrip() for line in lines if line.strip() != ""]
        return '\n'.join(cleaned_lines)
        
    def encode(self, code: str) -> np.ndarray:
        preprocessed = self.preprocess_code(code)
        return self.model.encode(preprocessed, convert_to_tensor=False)
        
    def compute_similarity(self, code1: str, code2: str) -> float:
        c1 = self.preprocess_code(code1)
        c2 = self.preprocess_code(code2)
        
        e1 = self.model.encode(c1, convert_to_tensor=True)
        e2 = self.model.encode(c2, convert_to_tensor=True)
        
        sim = util.cos_sim(e1, e2).item()
        return float(sim)
        
    def batch_encode(self, codes: list[str]) -> list[np.ndarray]:
        preprocessed = [self.preprocess_code(c) for c in codes]
        return self.model.encode(preprocessed, convert_to_tensor=False).tolist()
