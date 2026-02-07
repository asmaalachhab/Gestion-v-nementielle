import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

// Public pages
import { Landing } from '../pages/public/Landing';
import { EventsList } from '../pages/public/EventsList';
import { EventDetails } from '../pages/public/EventDetails';
import { Checkout } from '../pages/public/Checkout';

// Auth
import { Login } from '../pages/auth/Login';

// Client pages
import { Profile } from '../pages/client/Profile';
import { MyReservations } from '../pages/client/MyReservations';

// Organizer pages
import { DashboardLayout } from '../pages/organizer/DashboardLayout';
import { Overview } from '../pages/organizer/Overview';
import { MyEvents } from '../pages/organizer/MyEvents';
import { MyOffers } from '../pages/organizer/MyOffers';
import { Statistics } from '../pages/organizer/Statistics';

// Admin pages
import { AdminPanel } from '../pages/admin/AdminPanel';

type Page = 'landing' | 'events' | 'event-details' | 'checkout' | 'profile' | 'reservations' | 
            'organizer-dashboard' | 'admin';

type OrganizerPage = 'overview' | 'events' | 'offers' | 'stats';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentOrganizerPage, setCurrentOrganizerPage] = useState<OrganizerPage>('overview');
  const [selectedEventId, setSelectedEventId] = useState<number>(1);
  const [selectedOfferId, setSelectedOfferId] = useState<number>(1);
  const [loginOpen, setLoginOpen] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleViewEventDetails = (eventId: number) => {
    setSelectedEventId(eventId);
    setCurrentPage('event-details');
  };

  const handleReserve = (offerId: number) => {
    setSelectedOfferId(offerId);
    setCurrentPage('checkout');
  };

  const handleLoginRequired = () => {
    setLoginOpen(true);
  };

  const handleLoginSuccess = () => {
    // User is now logged in, can proceed
  };

  const handleLogout = () => {
    setCurrentPage('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <Landing
            onViewEventDetails={handleViewEventDetails}
            onViewAllEvents={() => setCurrentPage('events')}
          />
        );

      case 'events':
        return <EventsList onViewEventDetails={handleViewEventDetails} />;

      case 'event-details':
        return (
          <EventDetails
            eventId={selectedEventId}
            onBack={() => setCurrentPage('events')}
            onReserve={handleReserve}
            onViewEventDetails={handleViewEventDetails}
          />
        );

      case 'checkout':
        return (
          <Checkout
            offerId={selectedOfferId}
            onBack={() => setCurrentPage('event-details')}
            onComplete={() => setCurrentPage('reservations')}
            onLoginRequired={handleLoginRequired}
          />
        );

      case 'profile':
        return <Profile />;

      case 'reservations':
        return <MyReservations onViewEventDetails={handleViewEventDetails} />;

      case 'organizer-dashboard':
        return (
          <DashboardLayout
            currentPage={currentOrganizerPage}
            onNavigate={setCurrentOrganizerPage}
            onLogout={handleLogout}
          >
            {currentOrganizerPage === 'overview' && <Overview />}
            {currentOrganizerPage === 'events' && <MyEvents />}
            {currentOrganizerPage === 'offers' && <MyOffers />}
            {currentOrganizerPage === 'stats' && <Statistics />}
          </DashboardLayout>
        );

      case 'admin':
        return <AdminPanel />;

      default:
        return (
          <Landing
            onViewEventDetails={handleViewEventDetails}
            onViewAllEvents={() => setCurrentPage('events')}
          />
        );
    }
  };

  const showHeader = currentPage !== 'organizer-dashboard';
  const showFooter = !['organizer-dashboard', 'checkout'].includes(currentPage);

  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background flex flex-col">
          {showHeader && (
            <Header
              onNavigate={handleNavigate}
              onLoginClick={() => setLoginOpen(true)}
            />
          )}
          
          <main className="flex-1">
            {renderPage()}
          </main>

          {showFooter && <Footer />}

          <Login
            isOpen={loginOpen}
            onClose={() => setLoginOpen(false)}
            onSuccess={handleLoginSuccess}
          />

          <Toaster />
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
}