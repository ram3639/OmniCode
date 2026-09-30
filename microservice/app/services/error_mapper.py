from typing import List, Dict, Any
from .tree_sitter_service import TreeSitterService

class ErrorMapper:
    def __init__(self, ts_service: TreeSitterService):
        self.ts_service = ts_service

    def map_errors(self, code: str, language: str, compiler_errors: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        tree, _ = self.ts_service.parse(code, language)
        
        mapped_errors = []
        for error in compiler_errors:
            # Assuming line and column in compiler_errors are 1-indexed for line and 1-indexed for column
            # Tree-sitter uses 0-indexed row and column
            line = error.get('line', 1) - 1
            col = error.get('column', 1) - 1
            
            node = self.find_node_at_position(tree.root_node, line, col)
            
            mapped_errors.append({
                "compiler_error": error,
                "mapped_node": {
                    "node_type": node.type if node else None,
                    "start_point": {"row": node.start_point.row, "column": node.start_point.column} if node else None,
                    "end_point": {"row": node.end_point.row, "column": node.end_point.column} if node else None,
                }
            })
            
        return mapped_errors
        
    def find_node_at_position(self, root_node, row: int, col: int):
        def traverse(node):
            for child in node.children:
                if (child.start_point.row < row or (child.start_point.row == row and child.start_point.column <= col)) and \
                   (child.end_point.row > row or (child.end_point.row == row and child.end_point.column >= col)):
                    found = traverse(child)
                    if found:
                        return found
                    return child
            return None
            
        return traverse(root_node) or root_node
