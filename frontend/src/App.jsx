import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from 'react-hot-toast';
// Components
import RequireAuth from "./auth/RequireAuth";
import PageLayout from "./layout/PageLayout";
import PageTransition from "./layout/PageTransition";
import Loader from "./components/Loader"; // Suggest creating a simple spinner component

// Lazy Load Pages for Performance (Code Splitting)
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./auth/Login"));
const Signup = lazy(() => import("./auth/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectsList = lazy(() => import("./pages/ProjectsList")); // Added this
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const ProjectRuns = lazy(() => import("./pages/ProjectRuns"));
const RunDetails = lazy(() => import("./pages/RunDetails"));
const GenerateTests = lazy(() => import("./pages/GenerateTests"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

/**
 * HOC to wrap routes with standard Layout and Animation
 */
const WrappedPage = ({ children, isProtected = false }) => {
  const content = (
    <PageLayout>
      <PageTransition>{children}</PageTransition>
    </PageLayout>
  );

  return isProtected ? <RequireAuth>{content}</RequireAuth> : content;
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* Suspense handles the loading state for lazy-loaded components */}
      <Suspense fallback={<Loader />}>
        <Routes location={location} key={location.pathname}>
          
          {/* --- Public Routes --- */}
          <Route path="/" element={<WrappedPage><Home /></WrappedPage>} />
          <Route path="/login" element={<WrappedPage><Login /></WrappedPage>} />
          <Route path="/signup" element={<WrappedPage><Signup /></WrappedPage>} />
          <Route path="/about" element={<WrappedPage><About /></WrappedPage>} />
          <Route path="/contact" element={<WrappedPage><Contact /></WrappedPage>} />

          {/* --- Protected Routes --- */}
          <Route path="/dashboard" element={<WrappedPage isProtected><Dashboard /></WrappedPage>} />
          
          {/* ✅ FIXED: Added the Projects List route */}
          <Route path="/projects" element={<WrappedPage isProtected><ProjectsList /></WrappedPage>} />
          
          <Route path="/projects/:id" element={<WrappedPage isProtected><ProjectDetails /></WrappedPage>} />
          <Route path="/projects/:projectId/runs" element={<WrappedPage isProtected><ProjectRuns /></WrappedPage>} />
          <Route path="/runs/:runId" element={<WrappedPage isProtected><RunDetails /></WrappedPage>} />
          <Route path="/generate" element={<WrappedPage isProtected><GenerateTests /></WrappedPage>} />

          {/* Fallback for 404 */}
          <Route path="*" element={<WrappedPage><Home /></WrappedPage>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </BrowserRouter>
  );
}
// import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import { AnimatePresence } from "framer-motion";

// import Home from "./pages/Home";
// import Login from "./auth/Login";
// import Signup from "./auth/Signup";
// import Dashboard from "./pages/Dashboard";
// import ProjectRuns from "./pages/ProjectRuns";
// import RunDetails from "./pages/RunDetails";

// import RequireAuth from "./auth/RequireAuth";
// import PageLayout from "./layout/PageLayout";
// import PageTransition from "./layout/PageTransition";

// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import GenerateTests from "./pages/GenerateTests";
// import ProjectDetails from "./pages/ProjectDetails";

// function AnimatedRoutes() {
//   const location = useLocation();

//   return (
//     <AnimatePresence mode="wait">
//       <Routes location={location} key={location.pathname}>

//         {/* Public */}
//         <Route
//           path="/"
//           element={
//             <PageLayout>
//               <PageTransition>
//                 <Home />
//               </PageTransition>
//             </PageLayout>
//           }
//         />

//         <Route
//           path="/login"
//           element={
//             <PageLayout>
//               <PageTransition>
//                 <Login />
//               </PageTransition>
//             </PageLayout>
//           }
//         />

//         <Route
//           path="/signup"
//           element={
//             <PageLayout>
//               <PageTransition>
//                 <Signup />
//               </PageTransition>
//             </PageLayout>
//           }
//         />

//         {/* Protected */}
//         <Route
//           path="/dashboard"
//           element={
//             <RequireAuth>
//               <PageLayout>
//                 <PageTransition>
//                   <Dashboard />
//                 </PageTransition>
//               </PageLayout>
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/about"
//           element={
            
//               <PageLayout>
//                 <PageTransition>
//                   <About/>
//                 </PageTransition>
//               </PageLayout>
          
//           }
//         />
//         <Route
//           path="/contact"
//           element={
            
//               <PageLayout>
//                 <PageTransition>
//                   <Contact/>
//                 </PageTransition>
//               </PageLayout>
          
//           }
//         />

//         <Route
//           path="/projects/:projectId/runs"
//           element={
//             <RequireAuth>
//               <PageLayout>
//                 <PageTransition>
//                   <ProjectRuns />
//                 </PageTransition>
//               </PageLayout>
//             </RequireAuth>
//           }
//         />

//         <Route
//           path="/runs/:runId"
//           element={
//             <RequireAuth>
//               <PageLayout>
//                 <PageTransition>
//                   <RunDetails />
//                 </PageTransition>
//               </PageLayout>
//             </RequireAuth>
//           }
//         />

//               <Route
//           path="/generate"
//           element={
//             <RequireAuth>
//               <PageLayout>
//                 <GenerateTests />
//               </PageLayout>
//             </RequireAuth>
//           }
//         />
//               <Route
//           path="/projects/:id"
//           element={
            
//               <PageLayout>
//                 <ProjectDetails />
//               </PageLayout>
            
//           }
//         />


//       </Routes>
//     </AnimatePresence>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AnimatedRoutes />
//     </BrowserRouter>
//   );
// }
