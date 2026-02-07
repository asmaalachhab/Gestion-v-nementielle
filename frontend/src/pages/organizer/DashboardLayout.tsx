import { LayoutDashboard, Calendar, Ticket, TrendingUp, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../app/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: 'overview' | 'events' | 'offers' | 'stats';
  onNavigate: (page: 'overview' | 'events' | 'offers' | 'stats') => void;
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  currentPage,
  onNavigate,
  onLogout
}) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview' as const, label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'events' as const, label: 'Mes événements', icon: Calendar },
    { id: 'offers' as const, label: 'Mes offres', icon: Ticket },
    { id: 'stats' as const, label: 'Statistiques', icon: TrendingUp },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b">
        <h2 className="text-primary">EventMa</h2>
        <p className="text-sm text-muted-foreground mt-1">Dashboard Organisateur</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        {user && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="font-semibold text-sm">{user.prenom} {user.nom}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-r bg-card">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 border-r bg-card transform transition-transform lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-primary">EventMa</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col h-[calc(100vh-73px)]">
          <SidebarContent />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b bg-card px-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="hidden lg:block">
            <h3 className="capitalize">{menuItems.find(m => m.id === currentPage)?.label}</h3>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-muted rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {user.prenom[0]}{user.nom[0]}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-semibold">{user.prenom} {user.nom}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
