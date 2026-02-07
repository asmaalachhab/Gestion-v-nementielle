import { users as seedUsers, reservations as seedReservations, User, Reservation } from './mockData';

// Simple localStorage-backed persistence for this demo.
// It makes profile edits + new reservations visible across pages and after reload.

const USERS_KEY = 'eventma_users';
const RESERVATIONS_KEY = 'eventma_reservations';

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function ensureSeededStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
  }
  if (!localStorage.getItem(RESERVATIONS_KEY)) {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(seedReservations));
  }
}

export function loadUsers(): User[] {
  if (typeof window === 'undefined') return [...seedUsers];
  ensureSeededStorage();
  return safeJsonParse<User[]>(localStorage.getItem(USERS_KEY), [...seedUsers]);
}

export function saveUsers(users: User[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function updateUser(userId: number, patch: Partial<User>): User | null {
  const all = loadUsers();
  const idx = all.findIndex(u => u.id === userId);
  if (idx === -1) return null;
  const updated: User = { ...all[idx], ...patch };
  all[idx] = updated;
  saveUsers(all);
  return updated;
}

export function changeUserPassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): { ok: boolean; error?: string } {
  const all = loadUsers();
  const idx = all.findIndex(u => u.id === userId);
  if (idx === -1) return { ok: false, error: 'Utilisateur introuvable' };
  if (all[idx].password !== currentPassword) return { ok: false, error: 'Mot de passe actuel incorrect' };
  all[idx] = { ...all[idx], password: newPassword };
  saveUsers(all);
  return { ok: true };
}

export function loadReservations(): Reservation[] {
  if (typeof window === 'undefined') return [...seedReservations];
  ensureSeededStorage();
  return safeJsonParse<Reservation[]>(localStorage.getItem(RESERVATIONS_KEY), [...seedReservations]);
}

export function saveReservations(reservations: Reservation[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
}

export function addReservation(
  input: Omit<Reservation, 'id' | 'code_reservation' | 'date_reservation' | 'statut'>
): Reservation {
  const all = loadReservations();
  const nextId = all.length ? Math.max(...all.map(r => r.id)) + 1 : 1;
  const code = `RES-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  const today = new Date().toISOString().split('T')[0];

  const created: Reservation = {
    id: nextId,
    code_reservation: code,
    date_reservation: today,
    nb_places: input.nb_places,
    montant_total: input.montant_total,
    statut: 'CONFIRMEE',
    user_id: input.user_id,
    offer_id: input.offer_id,
  };

  all.unshift(created);
  saveReservations(all);
  return created;
}

export function getReservationsByUserIdPersisted(userId: number): Reservation[] {
  return loadReservations().filter(r => r.user_id === userId);
}
