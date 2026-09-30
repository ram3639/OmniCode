import { parseAST } from '../services/microserviceProxy.js';

export const handleParseAST = async (req, res) => {
  const { code, language } = req.body;
  try {
    const ast = await parseAST(code, language);
    res.json(ast);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
