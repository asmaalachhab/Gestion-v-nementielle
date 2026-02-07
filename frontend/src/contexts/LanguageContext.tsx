import React, { createContext, useContext, useState } from 'react';

type Language = 'fr' | 'ar';

interface Translations {
  [key: string]: {
    fr: string;
    ar: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.events': { fr: 'Événements', ar: 'الأحداث' },
  'nav.categories': { fr: 'Catégories', ar: 'الفئات' },
  'nav.regions': { fr: 'Régions', ar: 'المناطق' },
  'nav.login': { fr: 'Se connecter', ar: 'تسجيل الدخول' },
  'nav.logout': { fr: 'Déconnexion', ar: 'تسجيل الخروج' },
  'nav.profile': { fr: 'Mon Profil', ar: 'ملفي الشخصي' },
  'nav.myReservations': { fr: 'Mes Réservations', ar: 'حجوزاتي' },
  'nav.dashboard': { fr: 'Tableau de bord', ar: 'لوحة القيادة' },
  
  // Hero
  'hero.title': { fr: 'Découvrez des événements partout au Maroc', ar: 'اكتشف الأحداث في جميع أنحاء المغرب' },
  'hero.subtitle': { fr: 'Concerts, festivals, conférences et plus encore', ar: 'حفلات موسيقية ومهرجانات ومؤتمرات والمزيد' },
  
  // Search
  'search.placeholder': { fr: 'Rechercher un événement...', ar: 'ابحث عن حدث...' },
  'search.region': { fr: 'Région', ar: 'المنطقة' },
  'search.category': { fr: 'Catégorie', ar: 'الفئة' },
  'search.period': { fr: 'Période', ar: 'الفترة' },
  'search.price': { fr: 'Prix', ar: 'السعر' },
  'search.button': { fr: 'Rechercher', ar: 'بحث' },
  
  // Events
  'events.startingFrom': { fr: 'À partir de', ar: 'ابتداءً من' },
  'events.views': { fr: 'vues', ar: 'مشاهدة' },
  'events.details': { fr: 'Voir les détails', ar: 'عرض التفاصيل' },
  'events.reserve': { fr: 'Réserver', ar: 'احجز' },
  'events.availablePlaces': { fr: 'places disponibles', ar: 'أماكن متاحة' },
  'events.expires': { fr: 'Expire le', ar: 'ينتهي في' },
  
  // Buttons
  'btn.seeMore': { fr: 'Voir plus', ar: 'شاهد المزيد' },
  'btn.book': { fr: 'Réserver', ar: 'احجز' },
  'btn.cancel': { fr: 'Annuler', ar: 'إلغاء' },
  'btn.confirm': { fr: 'Confirmer', ar: 'تأكيد' },
  'btn.save': { fr: 'Enregistrer', ar: 'حفظ' },
  'btn.edit': { fr: 'Modifier', ar: 'تعديل' },
  'btn.delete': { fr: 'Supprimer', ar: 'حذف' },
  'btn.create': { fr: 'Créer', ar: 'إنشاء' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
