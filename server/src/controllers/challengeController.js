import Challenge from '../models/Challenge.js';

/**
 * @route GET /api/challenges
 * @desc Get all challenges with optional filtering and pagination
 * @access Public
 */
export const getChallenges = async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 50 } = req.query;
    const query = {};
    
    if (category && category !== 'All') query.category = category;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (search) query.title = { $regex: search, $options: 'i' };

    const challenges = await Challenge.find(query)
      .select('-hiddenTestCases -optimalSolutions')
      .sort('problemNumber')
      .skip((page - 1) * limit)
      .limit(Number(limit));
      
    const total = await Challenge.countDocuments(query);

    res.status(200).json({
      challenges,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('GetChallenges error:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
};

/**
 * @route GET /api/challenges/:slug
 * @desc Get single challenge by slug
 * @access Public
 */
export const getChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ slug: req.params.slug });
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const challengeData = challenge.toObject();
    
    // Only admins can see hidden test cases and optimal solutions
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
      delete challengeData.hiddenTestCases;
      delete challengeData.optimalSolutions;
    }

    challengeData.acceptanceRate = challenge.totalSubmissions > 0 
      ? ((challenge.acceptedSubmissions / challenge.totalSubmissions) * 100).toFixed(1) 
      : 0;

    res.status(200).json({ challenge: challengeData });
  } catch (error) {
    console.error('GetChallenge error:', error);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
};

/**
 * @route POST /api/challenges
 * @desc Create a new challenge (admin only)
 * @access Private/Admin
 */
export const createChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json({ challenge });
  } catch (error) {
    console.error('CreateChallenge error:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * @route PUT /api/challenges/:id
 * @desc Update a challenge (admin only)
 * @access Private/Admin
 */
export const updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    res.status(200).json({ challenge });
  } catch (error) {
    console.error('UpdateChallenge error:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * @route DELETE /api/challenges/:id
 * @desc Delete a challenge (admin only)
 * @access Private/Admin
 */
export const deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    res.status(200).json({ message: 'Challenge deleted' });
  } catch (error) {
    console.error('DeleteChallenge error:', error);
    res.status(500).json({ error: error.message });
  }
};
