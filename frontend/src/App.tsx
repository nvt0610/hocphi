import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import Classes from './pages/Classes';
import Students from './pages/Students';
import TuitionRecords from './pages/TuitionRecords';

import ClassForm from './pages/classes/ClassForm';
import StudentForm from './pages/students/StudentForm';
import TuitionForm from './pages/tuition/TuitionForm';

// Simple Auth Guard
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
   return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/dashboard" 
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } 
          />

          {/* Classes Routes */}
          <Route path="/classes" element={<AuthGuard><Classes /></AuthGuard>} />
          <Route path="/classes/create" element={<AuthGuard><ClassForm /></AuthGuard>} />
          <Route path="/classes/update/:id" element={<AuthGuard><ClassForm /></AuthGuard>} />

          {/* Students Routes */}
          <Route path="/students" element={<AuthGuard><Students /></AuthGuard>} />
          <Route path="/students/create" element={<AuthGuard><StudentForm /></AuthGuard>} />
          <Route path="/students/update/:id" element={<AuthGuard><StudentForm /></AuthGuard>} />

          {/* Tuition Routes */}
          <Route path="/tuition" element={<AuthGuard><TuitionRecords /></AuthGuard>} />
          <Route path="/tuition/create" element={<AuthGuard><TuitionForm /></AuthGuard>} />
          <Route path="/tuition/update/:id" element={<AuthGuard><TuitionForm /></AuthGuard>} />

          {/* Luôn chuyển về /login nếu truy cập trang chủ hoặc các route khác */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
