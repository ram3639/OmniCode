from tree_sitter import Language, Parser
import tree_sitter_python as tspython
import tree_sitter_c as tsc
import tree_sitter_cpp as tscpp
import tree_sitter_java as tsjava

class TreeSitterService:
    def __init__(self):
        self.languages = {
            "python": Language(tspython.language()),
            "c": Language(tsc.language()),
            "cpp": Language(tscpp.language()),
            "java": Language(tsjava.language()),
        }
        
    def parse(self, code: str, language: str) -> tuple:
        lang = self.languages.get(language.lower())
        if not lang:
            raise ValueError(f"Unsupported language: {language}")
        
        parser = Parser(lang)
        source_bytes = code.encode('utf8')
        tree = parser.parse(source_bytes)
        return tree, source_bytes
        
    def get_ast_json(self, code: str, language: str, named_only: bool = True) -> dict:
        tree, source_bytes = self.parse(code, language)
        return self._node_to_dict(tree.root_node, source_bytes, named_only)
        
    def _node_to_dict(self, node, source_bytes: bytes, named_only: bool) -> dict:
        result = {
            "type": node.type,
            "text": source_bytes[node.start_byte:node.end_byte].decode('utf8')[:50],
            "start_point": {"row": node.start_point.row, "column": node.start_point.column},
            "end_point": {"row": node.end_point.row, "column": node.end_point.column},
            "is_error": node.type == 'ERROR' or node.type == 'MISSING' or node.has_error,
            "field_name": None,
            "children": []
        }
        
        for child in node.children:
            if named_only and not child.is_named:
                continue
            result["children"].append(self._node_to_dict(child, source_bytes, named_only))
            
        return result

    def find_errors(self, code: str, language: str) -> list[dict]:
        tree, source_bytes = self.parse(code, language)
        errors = []
        
        def traverse(node):
            if node.type == 'ERROR' or node.type == 'MISSING':
                errors.append({
                    "type": node.type,
                    "text": source_bytes[node.start_byte:node.end_byte].decode('utf8'),
                    "start_point": {"row": node.start_point.row, "column": node.start_point.column},
                    "end_point": {"row": node.end_point.row, "column": node.end_point.column},
                    "message": f"Syntax error: {node.type}"
                })
            for child in node.children:
                traverse(child)
                
        traverse(tree.root_node)
        return errors
