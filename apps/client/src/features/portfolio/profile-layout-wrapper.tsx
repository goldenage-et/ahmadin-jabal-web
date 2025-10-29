import { getAddresses } from '@/actions/address.action';
import {
  TAddress,
  TFetcherResponse,
  TOrderBasic,
  TUserBasic,
  TWishlist,
} from '@repo/common';
import { redirect } from 'next/navigation';
import { getAuth } from '../../../../actions/auth.action';
import {
  getMyOrders,
  getMyProfile,
  getMyWishlist,
} from '../../../../actions/profile.action';
import { ProfileLayout } from './profile-layout';

// Force dynamic rendering since we use authentication and server actions
export const dynamic = 'force-dynamic';

type ProfileData = {
  user: TUserBasic;
  totalOrders: number;
  totalSpent: number;
};

type InitialAddresses = TFetcherResponse<{
  data: TAddress[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  error: undefined | true;
}>;

export async function ProfileLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAuth();

  if (!user) {
    redirect('/login');
  }

  let initialAddresses: InitialAddresses = {
    data: [],
    total: 0,
    page: 0,
    limit: 0,
    totalPages: 0,
    error: undefined,
  };

  let profileData: ProfileData = {
    user,
    totalOrders: 0,
    totalSpent: 0,
  };

  let orders: TOrderBasic[] = [];
  let wishlist: TWishlist[] = [];

  try {
    const [addresses, profile, userOrders, userWishlist] = await Promise.all([
      getAddresses({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
      getMyProfile(),
      getMyOrders(),
      getMyWishlist(),
    ]);
    initialAddresses = addresses;
    profileData = profile;
    orders = userOrders.orders;
    wishlist = userWishlist;
  } catch (err) {
    console.error('Error fetching profile data:', err);
    // Fallbacks already set above
  }

  const safeAddresses = initialAddresses.error
    ? {
      data: [],
      total: 0,
      page: 0,
      limit: 0,
      totalPages: 0,
    }
    : initialAddresses;

  return (
    <ProfileLayout
      user={user}
      initialProfileData={profileData}
      initialOrders={orders}
      initialWishlist={wishlist}
      initialAddresses={safeAddresses}
    >
      {children}
    </ProfileLayout>
  );
}
