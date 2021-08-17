const fs = require('fs');

export function nowInMillis(): number {
  return Date.now();
}

export function nowInSeconds(): number {
  return (nowInMillis() / 1000) | 0;
}

export async function timeout(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getFileNameFromPath(path: string): string {
    const fileEntities = path.split('/');
    return fileEntities[fileEntities.length - 1];
}

export function fileExists(path: string): boolean {
    return fs.existsSync(path);
}
