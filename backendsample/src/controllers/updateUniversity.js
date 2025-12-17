const University = require('../models/UniversitySchema');

// Update existing university (used by admin dashboard edit)
const updateUniversity = async (req, res) => {
  try {
    const { id } = req.params; // this is the custom id field, not _id
    const updates = req.body || {};

    if (!id) {
      return res.status(400).json({ success: false, message: 'University id is required' });
    }

    // Do not allow changing the primary id/key accidentally
    delete updates.id;
    delete updates.key;

    const updated = await University.findOneAndUpdate(
      { id },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }

    return res.status(200).json({ success: true, university: updated });
  } catch (error) {
    console.error('Error updating university:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating university',
      error: error.message,
    });
  }
};

module.exports = { updateUniversity };
