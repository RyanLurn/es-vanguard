export function parsePnpmLockfilePeers({ text }: { text: string }) {
  const peersStartIndex = text.indexOf("(");
  if (peersStartIndex === -1) {
    return;
  }

  const textWithoutPeers = text.substring(0, peersStartIndex);
  const peers = text.substring(peersStartIndex);

  return {
    textWithoutPeers,
    peers,
  };
}
