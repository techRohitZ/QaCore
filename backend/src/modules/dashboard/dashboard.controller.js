const TestRun =require('../testruns/testrun.model');

exports.getSummary =async (req,res) => {
    try {
        const userId =req.user.id;
        const totalRuns =await TestRun.countDocuments({user:userId});
        const passed =await TestRun.countDocuments({user:userId,status:'PASSED'});
        const failed =await TestRun.countDocuments({user:userId,status:'FAILED'});

        const passRate =totalRuns === 0
        ? 0
        :Math.round((passed/totalRuns)*1000);
        
        res.json({
            totalRuns,
            passed,
            failed,
            passRate
        });

    } catch (err) {
        res.status(500).json({error:err.message})
    }
};

 
exports.getRecentRuns = async (req, res) => {
  try {
    const userId = req.user.id;

   const recentRuns = await TestRun.find(
  { user: userId },
  {
    results: 0,        // ❌ exclude heavy logs
    __v: 0
  }
)
  .populate('project', 'name url')
  .sort({ createdAt: -1 })
  .limit(10)
  .lean();


    res.json({
      data: recentRuns
    });
  } catch (err) {
    console.error('[dashboard][recent]', err);
    res.status(500).json({
      error: 'Failed to fetch recent runs'
    });
  }
};