const { generateTestCases } = require('./ai.service');
const TestCase = require('../testcases/testcase.model');
const Project = require('../project/project.model'); // <--- 1. ADD THIS IMPORT

// --- AGGRESSIVE JSON CLEANER ---
function cleanAndParseJSON(text) {
    if (!text) return null;
    if (typeof text === 'object') return text;

    try {
        console.log("RAW AI OUTPUT:", text.substring(0, 100) + "..."); 

        // 1. Remove Markdown code blocks
        let cleaned = text.replace(/```json/g, '').replace(/```/g, '');

        // 2. Extract ONLY the JSON part
        const firstOpen = cleaned.indexOf('{');
        const lastClose = cleaned.lastIndexOf('}');

        if (firstOpen !== -1 && lastClose !== -1) {
            cleaned = cleaned.substring(firstOpen, lastClose + 1);
        } else {
            const firstArray = cleaned.indexOf('[');
            const lastArray = cleaned.lastIndexOf(']');
            if (firstArray !== -1 && lastArray !== -1) {
                cleaned = cleaned.substring(firstArray, lastArray + 1);
                return { testCases: JSON.parse(cleaned) };
            }
        }

        // 3. Sanitization
        cleaned = cleaned
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']')
            .replace(/\n/g, ' ')
            .replace(/\\"/g, '"');

        return JSON.parse(cleaned);

    } catch (error) {
        console.error("JSON PARSING FAILED. Cleaned text was:", text);
        return null;
    }
}

exports.generate = async (req, res) => {
    try {
        console.log("--- GENERATE REQUEST RECEIVED ---");

        // 1. Validate Input
        if (!req.body.projectId) {
            return res.status(400).json({ 
                error: "Missing projectId.",
                received_body: req.body 
            });
        }

        console.log(`Generating for Project: ${req.body.projectId}`);
        
        // 2. Call AI
        const resultText = await generateTestCases(req.body.prompt);
        const parsedResult = cleanAndParseJSON(resultText);

        if (parsedResult && parsedResult.testCases) {
            
            // 3. Save to History (TestCase Collection)
            await TestCase.create({
                user: req.user.id,
                project: req.body.projectId,
                prompt: req.body.prompt,
                aiModel: 'llama3.2',
                testCases: parsedResult.testCases
            });

            // 4. ✅ CRITICAL FIX: Push to Project for UI Display
            // We map 'steps' (array) to 'code' (string) so the UI code block can display it
            const uiFriendlyTests = parsedResult.testCases.map(tc => ({
                title: tc.title,
                code: Array.isArray(tc.steps) ? tc.steps.join('\n') : tc.code, 
                status: 'generated'
            }));

            await Project.findByIdAndUpdate(
                req.body.projectId,
                { $push: { tests: { $each: uiFriendlyTests } } }
            );

            console.log("✅ Tests saved to Project successfully");

            return res.status(200).json(parsedResult);
        } else {
            throw new Error("Failed to parse AI response");
        }

    } catch (err) {
        // console.error('AI ERROR:', err.message);
        console.error('AI ERROR DETAILS:', err); // Log the full object
console.error('STACK TRACE:', err.stack); // Log exactly where it crashed
if (err.response) console.error('API RESPONSE:', err.response.data); // If OpenAI sent an error back
        // Fallback Logic
        await TestCase.create({
            user: req.user.id,
            project: req.body.projectId,
            prompt: req.body.prompt || "Error Log",
            aiModel: 'llama3.2',
            testCases: [{ title: "Failure", steps: ["AI Failed"] }], 
            status: 'FAILED'
        });

        return res.status(200).json({ 
            message: "Saved fallback report.",
            error: err.message
        });
    }
};
// exports.generate = async (req, res) => {
//     try {
//         console.log(`Recieving prompt: ${req.body.prompt}`);
        
//         // 1. Get raw text from AI
//         const resultText = await generateTestCases(req.body.prompt);
        
//         // 2. Clean and Parse
//         const parsedResult = cleanAndParseJSON(resultText);

//         if (parsedResult && parsedResult.testCases) {
            
//             // 3. Save to DB using your correct Auth Middleware ID
//             await TestCase.create({
//                 user: req.user.id,        // Matches your Auth Middleware
//                 project: req.body.projectId,
//                 prompt: req.body.prompt,
//                 aiModel: 'llama3.2',
//                 testCases: parsedResult.testCases
//             });

//             console.log("SUCCESS: Saved test cases to DB");
//             return res.status(200).json(parsedResult);

//         } else {
//             throw new Error("Failed to parse AI response after cleaning");
//         }

//     } catch (err) {
//         console.error('AI CRITICAL ERROR:', err.message);

//         // Fallback response so you don't get a 500 error
//         return res.status(200).json({
//             testCases: [
//                 {
//                     title: "Fallback - AI format error",
//                     steps: ["The AI generated valid text but the JSON format was slightly broken.", "Check the console logs for the 'RAW AI OUTPUT' to see what happened."],
//                     expectedResult: "Manual Review",
//                     priority: "Medium"
//                 }
//             ]
//         });
//     }
// };

// const { generateTestCases } = require('./ai.service');
// const TestCase = require('../testcases/testcase.model');

// // ... (Keep your cleanAndParseJSON function exactly as is) ...
// function cleanAndParseJSON(text) { /* ... */ } 

// exports.generate = async (req, res) => {
//     try {
//         const resultText = await generateTestCases(req.body.prompt);
//         const parsedResult = cleanAndParseJSON(resultText);

//         if (parsedResult) {
//             // ✅ CORRECTION: Use 'req.user.id' (matches your middleware)
//             await TestCase.create({
//                 user: req.user.id,        
//                 project: req.body.projectId,
//                 prompt: req.body.prompt,
//                 aiModel: 'llama3.2',
//                 testCases: parsedResult.testCases
//             });

//             return res.status(200).json(parsedResult);
//         } else {
//             throw new Error("Failed to parse AI response");
//         }
//     } catch (err) {
//         console.error('AI ERROR:', err);
//         return res.status(200).json({ 
//             testCases: [{ title: 'Fallback', steps: ['Manual Review Needed'] }] 
//         });
//     }
// };
// const { generateTestCases } = require('./ai.service');
// const TestCase = require('../testcases/testcase.model');

// // Helper to extract JSON from text (removes markdown and conversational filler)
// function cleanAndParseJSON(text) {
//     try {
//         if (typeof text === 'object') return text;

//         let cleaned = text.replace(/```json/g, '').replace(/```/g, '');

//         const firstOpen = cleaned.indexOf('{');
//         const lastClose = cleaned.lastIndexOf('}');

//         if (firstOpen !== -1 && lastClose !== -1) {
//             cleaned = cleaned.substring(firstOpen, lastClose + 1);
//         }

//         return JSON.parse(cleaned);
//     } catch (error) {
//         console.error("JSON Parsing failed on:", text);
//         return null;
//     }
// }

// exports.generate = async (req, res) => {
//     try {
//         const resultText = await generateTestCases(req.body.prompt);
//         const parsedResult = cleanAndParseJSON(resultText);

//         if (parsedResult) {

//             // ✅ STEP 16 — ONLY ADDITION (SAFE, ISOLATED)
//             await TestCase.create({
//                 user: req.user.id,                 // from auth middleware
//                 project: req.body.projectId,      // sent by frontend
//                 prompt: req.body.prompt,
//                 aiModel: 'llama3.2',
//                 testCases: parsedResult.testCases
//             });

//             // ⬅️ EXISTING BEHAVIOR UNCHANGED
//             return res.status(200).json(parsedResult);

//         } else {
//             throw new Error("Failed to parse AI response");
//         }

//     } catch (err) {
//         console.error('AI ERROR:', err);

//         // ⬅️ EXISTING FALLBACK UNCHANGED
//         return res.status(200).json({
//             testCases: [
//                 {
//                     title: 'System-generated fallback',
//                     steps: ['Manual QA required - AI output was invalid'],
//                     expectedResult: 'System should handle invalid JSON gracefully',
//                     priority: 'LOW'
//                 }
//             ]
//         });
//     }
// };
