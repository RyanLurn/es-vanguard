import { parsePnpmLockfilePeers } from "@/pnpm/utils/parse-peers";

export function parsePnpmLockfileV9SnapshotKey({ key }: { key: string }) {
  const parsePeersResult = parsePnpmLockfilePeers({ text: key });

  if (!parsePeersResult) {
  }
}
