// RASHID LEAKS - Type Definitions

// ==================== USER TYPES ====================

export type UserRole = 'USER' | 'CREATOR' | 'MODERATOR' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  dateOfBirth?: Date | null;
  country?: string | null;
  role: UserRole;
  avatar?: string | null;
  bio?: string | null;
  displayName?: string | null;
  emailVerified: boolean;
  isBanned: boolean;
  ageVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  followerCount?: number;
  videoCount?: number;
  totalViews?: number;
  isFollowing?: boolean;
  isOwnProfile?: boolean;
}

// ==================== CREATOR TYPES ====================

export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface CreatorProfile {
  id: string;
  userId: string;
  user?: User;
  bannerImage?: string | null;
  verifiedAt?: Date | null;
  verificationStatus: VerificationStatus;
  rejectionReason?: string | null;
  followerCount: number;
  videoCount: number;
  totalViews: number;
  totalLikes: number;
  consentAdultConfirmed: boolean;
  consentOwnershipConfirmed: boolean;
  consentAllParticipantsAdult: boolean;
  consentRecordingConfirmed: boolean;
  consentDistributionConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== VIDEO TYPES ====================

export type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN' | 'FLAGGED' | 'UNDER_REVIEW';
export type VideoVisibility = 'DRAFT' | 'PRIVATE' | 'UNLISTED' | 'PUBLIC' | 'SCHEDULED';

export interface Video {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  creatorId: string;
  creator?: User;
  categoryId: string;
  category?: Category;
  tags?: Tag[];
  videoUrl: string;
  thumbnailUrl?: string | null;
  thumbnailBlurHash?: string | null;
  duration?: number | null;
  width?: number | null;
  height?: number | null;
  fileSize?: bigint | null;
  format?: string | null;
  qualityOptions?: QualityOption[] | null;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  commentCount: number;
  moderationStatus: ModerationStatus;
  visibility: VideoVisibility;
  publishedAt?: Date | null;
  contentWarnings?: string | null;
  isExplicit: boolean;
  createdAt: Date;
  updatedAt: Date;
  isLiked?: boolean;
  isFavorited?: boolean;
}

export interface QualityOption {
  quality: string;
  url: string;
  size?: number;
}

export interface FeaturedVideo {
  id: string;
  videoId: string;
  video?: Video;
  title?: string | null;
  sortOrder: number;
  isActive: boolean;
  featuredAt: Date;
  expiresAt?: Date | null;
}

// ==================== CATEGORY & TAG TYPES ====================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  thumbnail?: string | null;
  isFeatured: boolean;
  sortOrder: number;
  isActive: boolean;
  _count?: {
    videos: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// ==================== ENGAGEMENT TYPES ====================

export interface Comment {
  id: string;
  content: string;
  userId: string;
  user?: User;
  videoId: string;
  parentId?: string | null;
  parent?: Comment;
  replies?: Comment[];
  isDeleted: boolean;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  isLiked?: boolean;
}

export interface Like {
  videoId: string;
  userId: string;
  createdAt: Date;
}

export interface Favorite {
  videoId: string;
  userId: string;
  createdAt: Date;
}

export interface Follow {
  followingId: string;
  followerId: string;
  createdAt: Date;
}

// ==================== MODERATION TYPES ====================

export type ReportReason = 
  | 'NON_CONSENSUAL'
  | 'COPYRIGHT'
  | 'PRIVACY_VIOLATION'
  | 'ILLEGAL_CONTENT'
  | 'AGE_CONCERN'
  | 'VIOLENCE'
  | 'SPAM'
  | 'OTHER';

export type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED' | 'ESCALATED';

export interface Report {
  id: string;
  reporterId?: string | null;
  reporter?: User;
  videoId: string;
  video?: Video;
  reason: ReportReason;
  description?: string | null;
  evidence?: string | null;
  email?: string | null;
  status: ReportStatus;
  caseId: string;
  assignedTo?: string | null;
  reviewedAt?: Date | null;
  decision?: string | null;
  actionTaken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TakedownReason =
  | 'COPYRIGHT_INFRINGEMENT'
  | 'NON_CONSENSUAL_INTIMATE_IMAGERY'
  | 'PRIVACY_VIOLATION'
  | 'ILLEGAL_CONTENT'
  | 'COURT_ORDER'
  | 'VIOLATION_OF_TERMS'
  | 'OTHER';

export type TakedownStatus = 'PENDING' | 'UNDER_REVIEW' | 'PROCESSING' | 'COMPLETED' | 'DISMISSED' | 'COUNTER_NOTICE';

export interface TakedownRequest {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole?: string | null;
  videoId?: string | null;
  video?: Video;
  url?: string | null;
  reason: TakedownReason;
  description: string;
  legalReference?: string | null;
  evidence?: string | null;
  status: TakedownStatus;
  caseId: string;
  assignedTo?: string | null;
  reviewedAt?: Date | null;
  decision?: string | null;
  actionTaken?: string | null;
  responseToRequester?: string | null;
  userId?: string | null;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== WATCH HISTORY ====================

export interface WatchHistoryEntry {
  userId: string;
  user?: User;
  videoId: string;
  video?: Video;
  watchedAt: Date;
  progress: number;
  completed: boolean;
}

// ==================== ADMIN TYPES ====================

export type ModerationTargetType = 'VIDEO' | 'COMMENT' | 'USER' | 'CREATOR' | 'REPORT' | 'TAG' | 'CATEGORY';
export type ModerationActionType =
  | 'APPROVE'
  | 'REJECT'
  | 'HIDE'
  | 'DELETE'
  | 'FLAG'
  | 'UNFLAG'
  | 'BAN_USER'
  | 'UNBAN_USER'
  | 'SUSPEND_CREATOR'
  | 'VERIFY_CREATOR'
  | 'REVOKE_VERIFICATION'
  | 'REQUEST_CHANGES'
  | 'ADD_WARNING'
  | 'NOTE_ONLY';

export interface ModerationAction {
  id: string;
  moderatorId: string;
  moderator?: User;
  targetType: ModerationTargetType;
  targetId: string;
  actionType: ModerationActionType;
  reason: string;
  details?: string | null;
  previousValue?: string | null;
  newValue?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string | null;
  user?: User;
  action: string;
  resourceType?: string | null;
  resourceId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  success: boolean;
  errorMessage?: string | null;
  createdAt: Date;
}

// ==================== SEARCH & FILTER TYPES ====================

export interface SearchFilters {
  query?: string;
  category?: string;
  tag?: string;
  creator?: string;
  sortBy?: 'newest' | 'popular' | 'views' | 'likes' | 'duration';
  duration?: 'short' | 'medium' | 'long' | 'all';
  page?: number;
  limit?: number;
}

export interface SearchResults {
  videos: Video[];
  total: number;
  page: number;
  totalPages: number;
  filters: SearchFilters;
}

// ==================== NAVIGATION & HISTORY TYPES ====================

export interface HistoryState {
  type: 'page' | 'modal' | 'drawer' | 'fullscreen' | 'overlay';
  key: string;
  data?: Record<string, unknown>;
  scrollPosition?: number;
  timestamp: number;
}

export interface NavigationState {
  currentPage: string;
  previousPage?: string;
  historyStack: HistoryState[];
  modalOpen: boolean;
  drawerOpen: boolean;
  fullscreenVideo: boolean;
  searchQuery: string;
  searchFilters: SearchFilters;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== UPLOAD TYPES ====================

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadMetadata {
  title: string;
  description?: string;
  categoryId: string;
  tags: string[];
  visibility: VideoVisibility;
  contentWarnings?: string[];
  thumbnailFile?: File | null;
  consentConfirmed: boolean;
}
