// Google language configuration
export interface LanguageDescriptor {
  title: string,
  code: string,
}

export interface GoogleTranslationConfig {
  languages: LanguageDescriptor[];
  defaultLanguage: string;
}

// Augment the global `window` object
declare global {
  interface Window {
    __GOOGLE_TRANSLATION_CONFIG__: GoogleTranslationConfig;
    google: unknown;  // You can narrow this type down further if needed
  }
}

export interface FormButtonProps {
  loading: boolean,
  text: string
}

interface Opponent {
  id?: string;
  name?: string;
  score?: number;
}

interface Team {
  id?: string;
  name?: string;
  score?: number;
}

interface StatusReason {
  short?: string;
  shortKey?: string;
  long?: string;
  longKey?: string;
}

interface Status {
  utcTime: string | number | Date;
  finished?: boolean;
  started?: boolean;
  cancelled?: boolean;
  awarded?: boolean;
  scoreStr?: string;
  reason?: StatusReason;
}

export interface Match {
  id?: string;
  pageUrl?: string;
  opponent?: Opponent;
  home?: Team;
  away?: Team;
  displayTournament?: boolean;
  notStarted?: boolean;
  tournament?: object;
  status?: Status;
}

export type Popular = {
  id: number;
  name: string;
  localizedName: string;
  logo: string;
};


export interface LeagueType {
  leagueID: number | undefined;
  setLeagueID: (leagueID: number | undefined) => void;

  leagues: Popular[];
  setLeagues: React.Dispatch<React.SetStateAction<Popular[]>>;

  todayMatches: { matches: Match[] };
  setTodayMatches: React.Dispatch<React.SetStateAction<{ matches: Match[] }>>;

  tomorrowMatches: { matches: Match[] };
  setTomorrowMatches: React.Dispatch<React.SetStateAction<{ matches: Match[] }>>;
  
  otherDayMatches: { matches: Match[] };
  setOtherDayMatches: React.Dispatch<React.SetStateAction<{ matches: Match[] }>>;
}


// Type for the home and away teams
interface Team {
  id: number;
  score: number;
  name: string;
  longName: string;
}

// Type for the live match status
interface LiveTime {
  short: string;
  shortKey: string;
  long: string;
  longKey: string;
  maxTime: number;
  addedTime: number;
}

interface HalfStatus {
  firstHalfStarted: string;
}

interface Status {
  utcTime: string;
  halfs: HalfStatus;
  finished: boolean;
  started: boolean;
  cancelled: boolean;
  ongoing: boolean;
  scoreStr: string;
  liveTime: LiveTime;
}

// Main interface for each live match
export interface LiveMatch {
  id: number;
  leagueId: number;
  time: string; // Match time as a string
  home: Team;
  away: Team;
  eliminatedTeamId: number | null;
  statusId: number;
  tournamentStage: string;
  status: Status;
  timeTS?: number; // Timestamp for the match
}


export type registerParams = {
  password: string,
  firstname: string,
  lastname: string,
  phone: string,
  email: string,
  dateOfBirth: string,
  country: string,
  state: string,
  city: string,
  email_verified?: boolean,
  identity_verified?: boolean,
  isAdmin?: boolean
}


export type profileParams = {
  password?: string,
  firstname?: string,
  lastname?: string,
  phone?: string,
  email?: string,
  dateOfBirth?: string,
  country?: string,
  state?: string,
  city?: string,
}


export interface UserData {
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  country: string;
  state: string;
  city: string;
  email_verified: boolean;
  identity_verified: boolean;
  balance: string;
  userId: string;
  subscription: boolean;
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  $permissions?: any[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  $databaseId?: string;
  $collectionId?: string;
}


export interface GeneratedCode {
  code: string;
  $id: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  $permissions?: any[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  $createdAt?: string;
  $updatedAt?: string;
  $databaseId?: string;
  $collectionId?: string;
}


export interface PaymentMethod {
  logo: File,
  type: string,
  minDeposit: string,
  payId?: string,
  cryptoName?: string,
  address?: string,
  network?: string,
  bankName?: string,
  accountName?: string,
  accountNumber?: string,
  currency?: string,
  rate?: string,
  platformName?: string,
  email?: string,
}


export interface PaymentMethods {
  logo?: string;
  type?: string;
  payId?: string;
  logoUrl?: string;
  minDeposit?: string;
  cryptoName?: string | null;
  address?: string | null;
  network?: string | null;
  bankName?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  currency?: string | null;
  rate?: string | null;
  platformName?: string | null;
  email?: string | null;
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  $permissions?: any[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  $databaseId?: string;
  $collectionId?: string;
}


export interface Files {
  $id: string;
  bucketId: string;
  $createdAt: string;
  $updatedAt: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  $permissions?: any[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  name: string;
  signature: string;
  mimeType: string;
  sizeOriginal: number;
  chunksTotal: number;
  chunksUploaded: number;
}


export interface Payment { 
  method: PaymentMethods[], 
  logo: Files[] 
};


export interface AmountAndReciept {
  reciept: File,
  amount: string
}


export interface TransactionDetails {
  type: string;
  payId: string | null;
  minDeposit: string;
  cryptoName: string | null;
  address: string | null;
  network: string | null;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  currency: string | null;
  rate: string | null;
  platformName: string | null;
  email: string | null;
  logoUrl: string;
  '$id': string;
  '$createdAt': string;
  '$updatedAt': string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  '$permissions'?: any[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  '$databaseId': string;
  '$collectionId': string;
}


export interface Transaction {
  transaction_type: string;
  transaction_method: string;
  transaction_status: string;
  reciept: string;
  recieptUrl?: string;
  amount: string;
  transaction_time: string;
  userId: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  $permissions?: any[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  transaction_details: TransactionDetails;
  $databaseId: string;
  $collectionId: string;
}


export interface Transactions { 
  transactions: Transaction[], 
  reciepts: Files[] 
};


export interface Games {
  home: string,
  away: string,
  odd: string,
  homeGoal: string,
  awayGoal: string,
  $id?: string,
  $createdAt?: string,
  $updatedAt?: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  $permissions?: any[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  $databaseId?: string,
  $collectionId?: string
}


export interface UserGame {
  totalOdds: string,
  stake: string,
  payout: string,
  userId: string,
  date: string,
  showBet?: boolean,
  creditUser?: boolean,
  games: Games[],
  $id?: string,
  $createdAt?: string,
  $updatedAt?: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  $permissions?: any[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  $databaseId?: string,
  $collectionId?: string
}


export interface BetNotifications {
  userId: string,
  notification: string,
  date: string,
  $id?: string,
  $createdAt?: string,
  $updatedAt?: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  $permissions?: any[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  $databaseId?: string,
  $collectionId?: string
}

export interface Notifications {
  userId: string,
  type: string,
  date: string,
  amount?: string,
  $id?: string,
  $createdAt?: string,
  $updatedAt?: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  $permissions?: any[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  $databaseId?: string,
  $collectionId?: string
}


export interface Admin {
  name: string,
  label: string[],
}



export {};