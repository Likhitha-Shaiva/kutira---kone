export type ListingStatus = 'available' | 'reserved' | 'exchanged';
export type ListingType = 'swap' | 'buy' | 'free';
export type MaterialType = 'Cotton' | 'Silk' | 'Wool' | 'Linen' | 'Polyester' | 'Denim' | 'Other';

export interface Location {
  city: string;
  lat: number;
  lng: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  material: MaterialType;
  color: string;
  size: string;
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  location: Location;
  status: ListingStatus;
  type: ListingType;
  price?: number;
  createdAt: any;
  updatedAt: any;
}

export interface SwapRequest {
  id: string;
  listingId: string;
  ownerId: string;
  requesterId: string;
  requesterName: string;
  proposedListingId?: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: any;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  city?: string;
}
