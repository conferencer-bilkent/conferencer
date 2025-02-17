export const menuItemsByPage: Record<string, string[]> = {
    home: ['MY TASKS',
  'MY ROLES',
  'CONFERENCES',
  'NOTIFICATIONS',
  'CHATS',
  'SETTINGS',
  'PROFILE',
  'LOG OUT'],
    profile: ['MY TASKS',
  'MY ROLES',
  'CONFERENCES',
  'NOTIFICATIONS',
  'CHATS',
  'SETTINGS',
  'PROFILE',
  'LOG OUT'],
  };
  
  export function getMenuItemsForPage(page: string): string[] {
    return menuItemsByPage[page] || [];
  }
