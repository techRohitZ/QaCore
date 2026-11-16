const { generateTestCases } = require('./ai.service'); // Ensure path is correct
 const TestCase = require('../testcases/testcase.model');
const Project = require('../project/project.model');
// --- PRO-GRADE JSON CLEANER ---
function cleanAndParseJSON(text) {
    if (!text) return null;
    try {
        // Remove markdown and handle potential AI chatter
        let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const firstOpen = cleaned.indexOf('{');
        const lastClose = cleaned.lastIndexOf('}');

        if (firstOpen !== -1 && lastClose !== -1) {
            cleaned = cleaned.substring(firstOpen, lastClose + 1);
        }

        const parsed = JSON.parse(cleaned);
        // Ensure we always return an object with a testCases array
        return parsed.testCases ? parsed : { testCases: Array.isArray(parsed) ? parsed : [parsed] };
    } catch (error) {
        console.error("❌ JSON Parse Failed. Raw:", text);
        return null;
    }
}

exports.generate = async (req, res) => {
    try {
        const { projectId, url, customPrompt } = req.body;

        if (!projectId || !url) {
            return res.status(400).json({ error: "Missing required fields: projectId or url." });
        }

        if (!/^[a-f0-9]{24}$/i.test(projectId)) return res.status(400).json({ error: 'Invalid project ID.' });
        const project = await Project.findOne({ _id: projectId, owner: req.user.id });
        if (!project) return res.status(404).json({ error: 'Project not found.' });
        let target;
        try { target = new URL(url); } catch { return res.status(400).json({ error: 'Enter a valid URL.' }); }
        if (!['http:', 'https:'].includes(target.protocol)) return res.status(400).json({ error: 'Use an HTTP or HTTPS URL.' });
        if (customPrompt != null && (typeof customPrompt !== 'string' || customPrompt.length > 5000)) return res.status(400).json({ error: 'Instructions must be at most 5,000 characters.' });
        console.log(`🚀 AI Engine: Generating for ${url}`);
        console.log(`📝 Custom Instructions: ${customPrompt || "None (General Scan)"}`);

        // 1. Call AI Service (Pass arguments separately!)
        const resultText = await generateTestCases(url, customPrompt);

        // 2. Parse Result
        const parsedResult = cleanAndParseJSON(resultText);
        if (!parsedResult) throw new Error("AI output was not valid JSON");

        if (!Array.isArray(parsedResult.testCases) || !parsedResult.testCases.length || parsedResult.testCases.length > 20 || parsedResult.testCases.some(tc => !tc || typeof tc.title !== 'string' || !tc.title.trim() || !Array.isArray(tc.steps) || !tc.steps.length || tc.steps.some(step => typeof step !== 'string' || !step.trim()) || typeof tc.expectedResult !== 'string' || !tc.expectedResult.trim())) {
            return res.status(502).json({ error: 'AI returned incomplete test cases. Please retry.' });
        }
        // 3. Save to History (The "Suite")
        const newRecord = await TestCase.create({
            user: req.user.id,
            project: projectId,
            prompt: customPrompt || "General Sanity Scan",
            aiModel: 'llama-3.3-70b-versatile',
            testCases: parsedResult.testCases
        });

        // 4. Map to Project UI Format (The "Flat List")
        const uiFriendlyTests = parsedResult.testCases.map(tc => ({
            title: tc.title,
            // If steps is an array, join it. If it's a string, use it.
            code: Array.isArray(tc.steps) ? tc.steps.join('\n') : (tc.code || ""),
            status: 'generated',
            targetUrl: target.href,
            expectedResult: tc.expectedResult,
            priority: (tc.priority || 'MEDIUM').toUpperCase() // Force Uppercase for UI Badges
        }));

        // 5. Update Project (Push new tests to the list)
        await Project.findOneAndUpdate(
            { _id: projectId, owner: req.user.id },
            { $push: { tests: { $each: uiFriendlyTests } } }
        );

        console.log(`✅ Success! Generated ${uiFriendlyTests.length} tests.`);

        return res.status(200).json({
            success: true,
            testCases: parsedResult.testCases,
            recordId: newRecord._id
        });

    } catch (err) {
        console.error('🔥 CRITICAL ERROR in Generate Controller:', err.message);
        return res.status(502).json({ message: "Generation failed", error: err.message });
    }
};
