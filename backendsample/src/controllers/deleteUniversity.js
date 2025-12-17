const University = require('../models/UniversitySchema');

// Delete existing university (used by admin dashboard / company management)
const deleteUniversity = async (req, res) => {
  try {
    const { id } = req.params; // custom id field, not _id

    if (!id) {
      return res.status(400).json({ success: false, message: 'University id is required' });
    }

    const deleted = await University.findOneAndDelete({ id }).lean();

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }

    return res.status(200).json({ success: true, university: deleted });
  } catch (error) {
    console.error('Error deleting university:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting university',
      error: error.message,
    });
  }
};

module.exports = { deleteUniversity };
