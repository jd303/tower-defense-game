export const StorageKeys = [
	"user_loadout",
	"user_progress",
] as const;
export type StorageKey = typeof StorageKeys[number];