const Project = require('./project.model');

exports.create =async (req,res) => {
    try {
        // FIX 1: Grab the owner ID from the TOKEN (req.user.id), not the body
        const project = await Project.create({
            name: req.body.name,
            url: req.body.url,
            owner: req.user.id || req.user.userId  // <--- This fixes the "owner required" error
        });
        
        res.status(201).json(project);

    } catch (err) {
        // FIX 2: Added error handling so the server doesn't crash if validation fails
        console.error("Create Error:", err);
        res.status(400).json({ error: err.message });
    }
};

// exports.list =async (req,res) => {
//     const projects =await Project.findOne({owner:req.userId}).sort('-createdAt');
//     res.json(projects);
//     console.log('BODY:', req.body);
// console.log('USER:', req.userId);

// };
 exports.list = async (req, res) => {
    try {
        // USE .find() to get an array of ALL projects
        // Also ensure you use 'req.user.id' if that's where your middleware stores it
        const projects = await Project.find({ owner: req.user.id }).sort('-createdAt');
        
        res.status(200).json(projects); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.remove =async (req,res) => {
    await Project.deleteOne({_id:req.params.id, owner:req.user.id});
    res.json({message:'Project Deleted'})
};
exports.getOne = async (req, res) => {
    try {
        // 1. Find project by ID
        // Security: We also check 'owner' so users can't see each other's projects
        const project = await Project.findOne({ 
            _id: req.params.id, 
            owner: req.user.id 
        });

        // 2. Handle "Not Found"
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // 3. Return the project
        res.status(200).json(project);

    } catch (err) {
        console.error("GetOne Error:", err);
        res.status(500).json({ error: err.message });
    }
};