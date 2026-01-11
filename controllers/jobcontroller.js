const { fetchJobs } = require("../services/job");

const JobsNEWS = async (req, res) => {
  try {
    const { category } = req.params;

    
    const count = await fetchJobs(category);

    res.status(200).json({
      success: true,
      message: `${count} ${category} jobs saved`,
    });
  } catch (error) {
    console.error("Job Controller Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job news",
    });
  }
};

module.exports = { JobsNEWS };
