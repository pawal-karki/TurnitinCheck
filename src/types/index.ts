// API Key Details Response
export interface ApiKeyDetails {
  id: string;
  userId: string;
  name: string;
  totalChecks: number;
  checksUsed: number;
  checksRemaining: number;
  status: 'active' | 'inactive' | 'expired';
  expiresAt: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// Submit Check Response
export interface SubmitCheckResponse {
  checkId: string;
  deliveryTime: string;
}

// File Info
export interface FileInfo {
  _id: string;
  originalFileName: string;
  storedFileName: string;
  fileSize: number;
  fileType: string;
  fileReference?: string;
  eTag?: string;
}

// Staff Info
export interface StaffInfo {
  _id: string;
  name: string;
  email: string;
}

// Report Info
export interface ReportInfo {
  reportUrl: string;
  reportETag: string;
}

// Report Details
export interface ReportDetails {
  _id: string;
  checkId: string;
  staffId?: StaffInfo;
  reports: {
    ai?: ReportInfo;
    plagiarism?: ReportInfo;
  };
}

// Check Details
export interface CheckDetails {
  _id: string;
  checkId: string;
  userId: string;
  fileId: FileInfo;
  reportId?: ReportDetails;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: 'low' | 'normal' | 'high';
  planType: string;
  deliveryTime: string;
  checkedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Check List Item (simplified version for listing)
export interface CheckListItem {
  _id: string;
  checkId: string;
  userId: string;
  fileId: FileInfo;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: 'low' | 'normal' | 'high';
  planType: string;
  deliveryTime: string;
  createdAt: string;
}

// API Error Response
export interface ApiError {
  error?: string;
  message?: string;
}

// Delete All Response
export interface DeleteAllResponse {
  message?: string;
  successCount?: number;
  failedCount?: number;
  failedDeletions?: Array<{
    success: boolean;
    checkId: string;
    error: string;
  }>;
}

