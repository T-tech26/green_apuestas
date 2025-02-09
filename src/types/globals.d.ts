declare global {
  interface Window {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    google: any; // The google object (used for Google Translate API)
    /* eslint-enable @typescript-eslint/no-explicit-any */
    googleTranslateElementInit: () => void; // The callback function for Google Translate initialization
  }
}

export interface FormButtonProps {
  loading: boolean,
  text: string
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
  username: string,
  firstname: string,
  lastname: string,
  phone: string,
  email: string,
  dateOfBirth: string,
  country: string,
  state: string,
  city: string,
  email_verified: boolean,
  identity_verified: boolean,
  balance: string,
  userId: string,
  chargesPaid: boolean,
  premiumCard: boolean,
  profileImg: string | null,
  profileImgUrl: string,
  $id: string,
  $createdAt?: string,
  $updatedAt?: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  $permissions?: any[],
  /* eslint-enable @typescript-eslint/no-explicit-any */
  $databaseId?: string,
  $collectionId?: string,
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
  reciept?: string;
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
  matchTime: string,
  $id?: string,
  $createdAt?: string,
  $updatedAt?: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  $permissions?: any[],
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
  $id: string,
  name: string,
  label: string[],
  adminImg?: string,
}


export interface BankDetails {
  userId?: string,
  bankName: string,
  accountName: string,
  accountNumber: string,
  currency: string,
  $id?: string,
  $createdAt?: string,
  $updatedAt?: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  $permissions?: any[],
  /* eslint-enable @typescript-eslint/no-explicit-any */
  $databaseId?: string,
  $collectionId?: string,
}


export interface UploadDocument {
  type: string;
  front: File;
  back: File;
  userId: string;
}


export interface VerificationDocument {
  type: string;
  front: string;
  back: string;
  frontUrl?: string;
  backUrl?: string;
  userId: string;
  ID_verification?: boolean,
  address_verification?: boolean,
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  $permissions?: any[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  $databaseId?: string;
  $collectionId?: string;
}


export interface VerificationDocuments {
  documents: VerificationDocument[],
  files: Files[]
}


export interface UserDataWithImage {
  user: UserData,
  image: Files
}


export interface AdminDataWithImage {
  admin: Admin,
  image: Files
}


interface Target {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  userId: string;
  providerId: string | null;
  providerType: 'email' | 'sms';
  identifier: string;
  expired: boolean;
}


export interface LoggedInUser {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  registration: string;
  status: boolean;
  labels: string[];
  passwordUpdate: string;
  email: string;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  mfa: boolean;
  prefs: Record<string, unknown>;
  targets: Target[];
  accessedAt: string;
}


export interface ContactEmailType {
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    message: string
}


export interface UsersAndImages {
  users: UserData[],
  images: Files[]
}



export {};