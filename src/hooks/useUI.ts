import { useUIStore } from '@/store/uiStore';

export function useUI() {
  const { sidebarOpen, darkMode, notifications, toggleSidebar, setSidebarOpen, toggleDarkMode, setDarkMode, addNotification, removeNotification } = useUIStore();

  return {
    sidebarOpen,
    darkMode,
    notifications,
    toggleSidebar,
    setSidebarOpen,
    toggleDarkMode,
    setDarkMode,
    addNotification,
    removeNotification,
  };
}
