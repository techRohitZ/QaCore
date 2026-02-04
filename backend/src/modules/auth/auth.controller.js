const authService = require('./auth.service');

exports.register =async (req,res) => {
    try {
        await authService.register(req.body);
        res.status(201).json({message:'User registered'})
    } catch (err) {
        res.status(400).json({error:err.message})
    }
};

exports.login =async (req,res) => {
    try {
       const {token} =await authService.login(req.body);
        res.json({token});
    } catch (err) {
        res.status(401).json({error:err.message})
    }
}