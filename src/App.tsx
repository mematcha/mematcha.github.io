import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomePage from './pages/index'
import MLPage from './pages/ml'
import SWEPage from './pages/swe'
import ResearchPage from './pages/research'
import BlogIndex from './pages/blog'
import BlogPost from './pages/blog/post'
import DemosIndex from './pages/demos'
import DemoDetail from './pages/demos/demo'

import { AuthProvider } from './lib/auth'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLogin from './pages/admin/login'
import AdminDashboard from './pages/admin'
import ProfileAdmin from './pages/admin/profile'
import EducationAdmin from './pages/admin/education'
import ExperienceAdmin from './pages/admin/experience'
import SkillsAdmin from './pages/admin/skills'
import PostsList from './pages/admin/posts/list'
import PostEditor from './pages/admin/posts/edit'
import ProjectsList from './pages/admin/projects/list'
import ProjectEditor from './pages/admin/projects/edit'
import DemosList from './pages/admin/demos/list'
import DemoEditor from './pages/admin/demos/edit'
import MediaAdmin from './pages/admin/media'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/">
        <Routes>
          {/* Public site */}
          <Route path="/" element={<HomePage />} />
          <Route path="/ml" element={<MLPage />} />
          <Route path="/swe" element={<SWEPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/demos" element={<DemosIndex />} />
          <Route path="/demos/:slug" element={<DemoDetail />} />

          {/* Admin CMS */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<ProfileAdmin />} />
            <Route path="education" element={<EducationAdmin />} />
            <Route path="experience" element={<ExperienceAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="posts" element={<PostsList />} />
            <Route path="posts/new" element={<PostEditor />} />
            <Route path="posts/:id" element={<PostEditor />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectEditor />} />
            <Route path="projects/:id" element={<ProjectEditor />} />
            <Route path="demos" element={<DemosList />} />
            <Route path="demos/new" element={<DemoEditor />} />
            <Route path="demos/:id" element={<DemoEditor />} />
            <Route path="media" element={<MediaAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
