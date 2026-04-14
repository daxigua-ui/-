/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Layout from './components/Layout';
import ProjectCard from './components/ProjectCard';
import NewProjectModal from './components/NewProjectModal';
import AircraftManagement from './pages/AircraftManagement';
import OrderManagement from './pages/OrderManagement';
import AirspacePlanning from './pages/AirspacePlanning';
import RouteManagement from './pages/RouteManagement';
import SimulationHistory from './pages/SimulationHistory';
import FlightPlan from './pages/FlightPlan';
import FlightMonitoring from './pages/FlightMonitoring';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './contexts/AuthContext';
import { Upload, Plus } from 'lucide-react';

const INITIAL_PROJECTS = [
  {
    type: '跨城干线',
    title: '深圳龙华-东莞沙田跨城航线运输项目示例',
    description: '基于深圳龙华与东莞沙田之间的真实航线，开展全流程物流配送仿真。针对高延迟数据和多点交汇分析进行了优化。',
    createdAt: '2026-04-07 10:58:54',
  },
  {
    type: '跨城干线',
    title: '深圳龙华-东莞沙田跨城航线运输项目示例 (克隆 1)',
    description: '基于深圳龙华与东莞沙田之间的真实航线，开展全流程物流配送仿真...',
    createdAt: '2026-04-07 11:22:15',
  },
  {
    type: '跨城干线',
    title: '深圳龙华-东莞沙田跨城航线运输项目示例 (克隆 2)',
    description: '基于深圳龙华与东莞沙田之间的真实航线，开展全流程物流配送仿真...',
    createdAt: '2026-04-07 12:45:00',
  },
  {
    type: '跨城干线',
    title: '深圳龙华-东莞沙田跨城航线运输项目示例 (克隆 3)',
    description: '基于深圳龙华与东莞沙田之间的真实航线，开展全流程物流配送仿真...',
    createdAt: '2026-04-07 14:10:22',
  },
  {
    type: '跨城干线',
    title: '深圳南山-福田无人机外卖配送试点项目',
    description: '针对高密度城区环境，模拟无人机在楼宇间的自动避障与精准降落配送流程。',
    createdAt: '2026-04-08 09:15:00',
  },
  {
    type: '应急救援',
    title: '大鹏新区山地搜救物资投送模拟项目',
    description: '模拟在复杂地形下的应急物资快速投送，测试无人机在强风环境下的稳定性。',
    createdAt: '2026-04-08 10:30:45',
  },
  {
    type: '基础设施巡检',
    title: '深汕特别合作区高压输电线路自动巡检',
    description: '利用高精度测绘数据，规划自动巡检航线，识别电力线路潜在隐患。',
    createdAt: '2026-04-08 11:45:12',
  },
  {
    type: '跨城干线',
    title: '珠海-深圳跨海低空物流航线验证项目',
    description: '跨海长距离飞行测试，验证大载重无人机在海面气象条件下的续航能力。',
    createdAt: '2026-04-08 13:20:00',
  },
];

function AppContent() {
  const { user, isLoading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState('项目管理');

  if (isLoading) {
    return <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface">加载中...</div>;
  }

  if (!user) {
    if (authView === 'login') {
      return <Login onNavigateToRegister={() => setAuthView('register')} />;
    } else {
      return <Register onNavigateToLogin={() => setAuthView('login')} />;
    }
  }

  const handleSaveProject = (newProject) => {
    if (editingProjectIndex !== null) {
      // Update existing project
      const updatedProjects = [...projects];
      updatedProjects[editingProjectIndex] = {
        ...updatedProjects[editingProjectIndex],
        title: newProject.name,
        type: newProject.type,
        description: newProject.description,
      };
      setProjects(updatedProjects);
      setEditingProjectIndex(null);
    } else {
      // Add new project
      const project = {
        type: newProject.type,
        title: newProject.name,
        description: newProject.description,
        createdAt: new Date().toISOString().replace('T', ' ').split('.')[0],
      };
      setProjects([project, ...projects]);
    }
    setIsModalOpen(false);
  };

  const handleEditClick = (index) => {
    setEditingProjectIndex(index);
    setIsModalOpen(true);
  };

  const handleNewProjectClick = () => {
    setEditingProjectIndex(null);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    if (currentPage === '基础信息管理') {
      return <AircraftManagement />;
    }

    if (currentPage === '订单管理') {
      return <OrderManagement />;
    }

    if (currentPage === '空域规划') {
      return <AirspacePlanning />;
    }

    if (currentPage === '航线管理') {
      return <RouteManagement />;
    }

    if (currentPage === '仿真历史') {
      return <SimulationHistory />;
    }

    if (currentPage === '飞行计划') {
      return <FlightPlan />;
    }

    if (currentPage === '飞行监控') {
      return <FlightMonitoring />;
    }

    return (
      <div className="grid-24 animate-in fade-in duration-500">
        <div className="col-span-24 flex flex-col md:flex-row md:items-end justify-end mt-2 mb-2 gap-4">
          <div className="flex items-center gap-3">
            <button className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-6 py-2.5 rounded-xl text-[14px] font-medium transition-all flex items-center gap-2 border border-outline-variant/10">
              <Upload size={18} />
              导入项目
            </button>
            <button 
              onClick={handleNewProjectClick}
              className="bg-gradient-to-br from-primary-container to-[#004fe5] hover:opacity-90 text-white px-6 py-2.5 rounded-xl text-[14px] font-medium shadow-lg shadow-primary-container/20 transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              新建项目
            </button>
          </div>
        </div>

        <div className="col-span-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
          {projects.map((project, index) => (
            <ProjectCard 
              key={`${project.title}-${index}`} 
              type={project.type}
              title={project.title}
              description={project.description}
              createdAt={project.createdAt}
              onEdit={() => handleEditClick(index)}
            />
          ))}
        </div>

        <NewProjectModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setEditingProjectIndex(null);
          }} 
          onSave={handleSaveProject}
          title={editingProjectIndex !== null ? '编辑项目' : '新建项目'}
          initialData={editingProjectIndex !== null ? {
            name: projects[editingProjectIndex].title,
            type: projects[editingProjectIndex].type,
            description: projects[editingProjectIndex].description,
          } : undefined}
        />
      </div>
    );
  };

  return (
    <Layout activeItem={currentPage} onNavigate={setCurrentPage}>
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return <AppContent />;
}
