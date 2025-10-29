import { EResources, TCreateRole, TRegister } from '@repo/common';

export const initialUsers: TRegister[] = [
  {
    firstName: 'Ahmadin',
    middleName: 'Jabal',
    lastName: 'Admin',
    email: 'admin@ahmadin.et',
    password: 'Pass1122',
    phone: '+251911111111',
  }
];

export const initialRoles: Omit<TCreateRole, 'id'>[] = [
  // Owner - Full access
  {
    name: 'owner',
    active: true,
    permission: {
      [EResources.USER]: {
        create: true,
        update: true,
        viewOne: true,
        viewMany: true,
        delete: true,
        active: true,
      },
      [EResources.BOOK]: {
        viewOne: true,
        viewMany: true,
        featured: true,
        create: true,
        update: true,
        delete: true,
        active: true,
      },
      [EResources.ORDER]: {
        viewOne: true,
        viewMany: true,
        update: true,
        delete: true,
      },
      [EResources.PAYMENT]: {
        viewOne: true,
        viewMany: true,
        update: true,
      },
      [EResources.SETTING]: {
        update: true,
        viewOne: true,
        viewMany: true,
      },
      [EResources.ROLE]: {
        create: true,
        assign: true,
        update: true,
        viewOne: true,
        viewMany: true,
        delete: true,
      },
    },
  },
  {
    name: 'admin',
    active: true,
    permission: {
      [EResources.USER]: {
        create: true,
        update: true,
        viewOne: true,
        viewMany: true,
        delete: true,
        active: true,
      },
      [EResources.BOOK]: {
        create: true,
        update: true,
        viewOne: true,
        viewMany: true,
        delete: true,
        active: true,
        featured: true,
      },
      [EResources.SETTING]: {
        update: true,
        viewOne: true,
        viewMany: true,
      },
      [EResources.ROLE]: {
        create: true,
        assign: true,
        update: true,
        viewOne: true,
        viewMany: true,
        delete: true,
      },
      [EResources.ORDER]: {
        update: true,
        viewOne: true,
        viewMany: true,
        delete: true,
      },
      [EResources.PAYMENT]: {
        update: true,
        viewOne: true,
        viewMany: true,
      },
    },
  },
];
