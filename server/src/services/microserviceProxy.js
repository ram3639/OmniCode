import axios from 'axios';

/**
 * Parse AST from code
 */
export const parseAST = async (code, language) => {
  try {
    const response = await axios.post(`${process.env.MICROSERVICE_URL}/api/ast/parse`, {
      code,
      language
    });
    return response.data;
  } catch (error) {
    console.error('Microservice parseAST error:', error.message);
    throw error;
  }
};

/**
 * Get semantic similarity score between user code and optimal code
 */
export const getSimilarityScore = async (userCode, optimalCode) => {
  try {
    const response = await axios.post(`${process.env.MICROSERVICE_URL}/api/similarity/score`, {
      user_code: userCode,
      optimal_code: optimalCode
    });
    // Response parsing: use response.data.score
    return response.data.score;
  } catch (error) {
    console.error('Microservice getSimilarityScore error:', error.message);
    throw error;
  }
};
