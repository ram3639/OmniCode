# OmniCode AI Microservice

This microservice provides AST parsing for visualizing code into flowcharts, and CodeBERT-based semantic similarity scoring for the OmniCode platform.

## Features
- **AST Parsing**: Converts Python, C, C++, and Java code into React Flow compatible node and edge structures using Tree-sitter.
- **Semantic Code Similarity**: Computes cosine similarity between two code snippets using `microsoft/unixcoder-base` via CodeBERT.
- **Error Mapping**: Maps compiler/syntax errors back to the respective AST node components.

## Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the server**:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## Environment Variables
- `SIMILARITY_THRESHOLD`: Default `0.85`.
- `MODEL_NAME`: Default `"microsoft/unixcoder-base"`.
- `HOST`: Default `"0.0.0.0"`.
- `PORT`: Default `8000`.

## API Endpoints

- `GET /health` : Health check.
- `POST /api/ast/parse` : Parse code and return React Flow nodes/edges.
- `POST /api/ast/errors` : Map compiler errors onto the AST.
- `POST /api/similarity/score` : Get similarity score between user and optimal code.
- `POST /api/similarity/encode` : Get vector encoding for a given code snippet.
