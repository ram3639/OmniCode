from .tree_sitter_service import TreeSitterService

class ASTToFlowchartConverter:
    def __init__(self, ts_service: TreeSitterService):
        self.ts_service = ts_service

        self.node_type_mapping = {
            "function_definition": "functionNode",
            "method_declaration": "functionNode",
            
            "if_statement": "conditionNode",
            "elif_clause": "conditionNode",
            "else_clause": "conditionNode",
            
            "for_statement": "loopNode",
            "while_statement": "loopNode",
            "for_in_clause": "loopNode",
            "enhanced_for_statement": "loopNode",
            
            "return_statement": "returnNode",
            
            "ERROR": "errorNode",
            "MISSING": "errorNode",
            
            "call_expression": "statementNode",
            "assignment": "statementNode",
            "expression_statement": "statementNode",
        }
        
        self.relevant_types = {
            "python": {"module", "function_definition", "class_definition", "if_statement", "for_statement", "while_statement", "return_statement", "assignment", "call", "expression_statement", "try_statement", "except_clause", "import_statement"},
            "c": {"translation_unit", "function_definition", "if_statement", "for_statement", "while_statement", "return_statement", "declaration", "call_expression", "expression_statement", "struct_specifier"},
            "cpp": {"translation_unit", "function_definition", "if_statement", "for_statement", "while_statement", "return_statement", "declaration", "call_expression", "expression_statement", "struct_specifier", "class_specifier"},
            "java": {"program", "class_declaration", "method_declaration", "if_statement", "for_statement", "while_statement", "return_statement", "local_variable_declaration", "method_invocation", "expression_statement", "try_statement", "catch_clause"}
        }

    def convert(self, code: str, language: str, named_only: bool = True) -> dict:
        tree, source_bytes = self.ts_service.parse(code, language)
        
        nodes = []
        edges = []
        errors = self.ts_service.find_errors(code, language)
        
        relevant_for_lang = self.relevant_types.get(language.lower(), set())
        
        node_counter = 0
        
        def traverse(node, parent_id=None, depth=0, sibling_index=0, total_siblings=1):
            nonlocal node_counter
            
            keep_node = node.type in relevant_for_lang or node.type in self.node_type_mapping or node.type in ["ERROR", "MISSING"]
            current_id = parent_id
            current_depth = depth
            
            if keep_node or parent_id == None:
                current_id = f"node_{node_counter}"
                node_counter += 1
                
                mapped_type = self.node_type_mapping.get(node.type, "defaultNode")
                is_err = node.type in ["ERROR", "MISSING"] or node.has_error
                
                x_spacing = 200
                x_offset = (sibling_index - total_siblings / 2) * x_spacing
                
                rf_node = {
                    "id": current_id,
                    "type": mapped_type,
                    "data": {
                        "label": mapped_type,
                        "codeSnippet": source_bytes[node.start_byte:node.end_byte].decode('utf8')[:50],
                        "nodeType": node.type,
                        "isError": is_err,
                        "errorMessage": "Syntax Error" if is_err else None,
                        "startPoint": {"row": node.start_point.row, "column": node.start_point.column},
                        "endPoint": {"row": node.end_point.row, "column": node.end_point.column}
                    },
                    "position": {
                        "x": x_offset,
                        "y": depth * 120
                    }
                }
                nodes.append(rf_node)
                
                if parent_id is not None:
                    edge = {
                        "id": f"edge_{parent_id}_{current_id}",
                        "source": parent_id,
                        "target": current_id,
                        "animated": is_err,
                        "style": {"stroke": "#EF4444"} if is_err else {}
                    }
                    edges.append(edge)
                
                current_depth += 1
                
            children = [c for c in node.children if (not named_only or c.is_named)]
            for i, child in enumerate(children):
                traverse(child, current_id, current_depth, i, len(children))
                
        traverse(tree.root_node)
        
        return {
            "nodes": nodes,
            "edges": edges,
            "errors": errors
        }
