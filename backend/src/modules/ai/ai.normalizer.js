// function normalizeAIOutput(raw) {
//   // Case 1: single test case object
//   if (raw && raw.title && Array.isArray(raw.steps)) {
//     const steps = raw.steps
//       .map(s => {
//         if (typeof s === 'string') return s.trim();
//         if (s.description) return s.description.trim();
//         return null;
//       })
//       .filter(Boolean); // remove null / undefined

//     if (steps.length === 0) {
//       throw new Error('No valid steps found');
//     }

//     return {
//       testCases: [
//         {
//           title: raw.title,
//           steps,
//           expectedResult:
//             raw.expectedResult ||
//             'System should behave according to specification',
//           priority: raw.priority || 'MEDIUM'
//         }
//       ]
//     };
//   }

//   // Case 2: already correct
//   if (raw && Array.isArray(raw.testCases)) {
//     return raw;
//   }

//   throw new Error('Unrecognized AI output format');
// }

// module.exports = { normalizeAIOutput };
