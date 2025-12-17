const University = require('../models/UniversitySchema');

/**
 * Fetch all universities for the admin company-management page.
 * This endpoint is protected by the adminAuthMiddleware (see server.js).
 *
 * Response shape expected by the frontend (CompanyManagementPage.tsx):
 * {
 *   success: true,
 *   universities: [ { ...UniversityDocument } ]
 * }
 */
const getStudentAdmin = async (req, res) => {
  try {
    // Pagination and filtering support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { discipline: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await University.countDocuments(query);

    // Get paginated results
    const universities = await University.find(query)
      .select('id title city province discipline degree ranking merit fee url status')
      .sort({ ranking: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      universities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching universities (admin):', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching universities',
      error: error.message,
    });
  }
};

module.exports = { getStudentAdmin };
