import React from "react";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import Header from "./components/Headers/Header";
import Footer from "./components/Footer/Footer";
import CompanyAuth from "./pages/CompanyAuth";
import CompanyRegister from "./pages/CompanyRegister";
import StudentAuth from "./pages/StudentAuth";
import StudentRegister from "./pages/StudentRegister";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Employer from "./pages/Employer";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import CompanyDashboardPage from "./components/Dashboard/CompanyDashboard/CompanyDashboard";
import StudentDashBoard from "./pages/StudentDashBoard";
import { AuthProvider } from "./api/AuthProvider";
import CvTemplate7 from "./components/studentDashboard/BlueModernForm";
import StudentCV from "./components/Dashboard/StudentDashboard/StudentCV";
import CV1 from "./components/Dashboard/StudentDashboard/CV1";
import CV2 from "./components/Dashboard/StudentDashboard/CV2";
import CV3 from "./components/Dashboard/StudentDashboard/CV3";
import CV4 from "./components/Dashboard/StudentDashboard/CV1";
import TestPlatform from "./components/studentDashboard/TestPlatform";
import Companies from "./pages/Companies";
import EditProfile from "./components/studentDashboard/EditProfile";
import JobPage from "./pages/JobPage";
import AdminDashboard from "./components/Dashboard/AdminDashboard/AdminDashboard"; // Import the JobPage component
import RecommendedJobs from "./components/Dashboard/StudentDashboard/RecommendedJobs";
import AdminAuth from "./pages/AdminAuth";
import AdminRegister from "./pages/AdminRegister";
import AdminProtectedRoute from "./api/AdminProtectedRoute";
import CompanyEditProfile from "./components/Dashboard/CompanyDashboard/CompanyEditProfile";
import CompanyDashboardLayout from "./components/Dashboard/CompanyDashboard/CompanyDashboardLayout";
import RecommendedCourses from "./components/Dashboard/StudentDashboard/RecommendedCourses";
import ViewCV from "./components/Dashboard/StudentDashboard/ViewCV";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* This renders the child route's component */}
      </main>
      <Footer />
    </>
  );
};
const router = createBrowserRouter([


  {
    element: <Layout />, // Applies Header/Footer to all child routes
    children: [
      { path: '/', element: <Home /> },
      { path: '/company-auth', element: <CompanyAuth /> },
      { path: '/admin-auth', element: <AdminAuth /> },
      { path: '/company-register', element: <CompanyRegister /> },
      { path: '/admin-register', element: <AdminRegister /> },
      { path: '/company-dashboard', element: <CompanyDashboardPage /> },
      { path: '/student-auth', element: <StudentAuth /> },
      { path: '/student-register', element: <StudentRegister /> },
      { path: '/home', element: <Home /> },
      { path: '/jobs', element: <Jobs /> },
      { path: '/employer', element: <Employer /> },
      { path: '/courses', element: <Courses /> },
      { path: '/contact', element: <Contact /> },
      { path: '/employees', element: <Companies /> },
      { path: '/jobs/:jobId', element: <JobPage /> }, // Add this route for JobPage
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />
      },
      {
        path: "/verify-otp",
        element: <VerifyOtpPage />
      },

    ],
  },
  {
    path: '/student',
    element: <StudentDashBoard /> // No Header/Footer for this route
  },
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    ), // No Header/Footer for this route
  },
  {
    path: '/cv/template1',
    element: <CV1 />
  },
  {
    path: '/company-dashboard/settings',
    element: <CompanyEditProfile />
  },
  {
    path: '/cv/template2',
    element: <CV2 />
  },
  {
    path: '/cv/template3',
    element: <CV3 />
  },
  {
    path: '/cv/template4',
    element: <CV4 />
  },
  {
    path: '/bluetemplate',
    element: <CvTemplate7 />
  }, {
    path: '/testplatform',
    element: <TestPlatform />
  },
  {
    path: '/student-dashboard/jobs',
    element: <RecommendedJobs />
  },
  {

    path: "/student-dashboard/courses",
    element: <RecommendedCourses />,
  },

  { path: "/editprofile", element: <EditProfile /> },
  { path: "student-dashboard/cv", element: <StudentCV /> },
  { path: "/student-dashboard/viewcv/:studentId", element: <ViewCV /> },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
