import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { HomeworkHelp } from './pages/HomeworkHelp';
import { WeaknessDetection } from './pages/WeaknessDetection';
import { Exercises } from './pages/Exercises';
import { StudyPlanner } from './pages/StudyPlanner';
import { Settings } from './pages/Settings';
import { useStudentStore } from './stores/useStudentStore';

function App() {
  const { student } = useStudentStore();

  useEffect(() => {
    if (student.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [student.darkMode]);

  return (
    <AnimatePresence>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/homework" element={<HomeworkHelp />} />
          <Route path="/weaknesses" element={<WeaknessDetection />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/planner" element={<StudyPlanner />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </AnimatePresence>
  );
}

export default App;
