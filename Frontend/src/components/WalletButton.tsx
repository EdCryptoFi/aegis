'use client';

import { ConnectButton } from '@mysten/dapp-kit';

export default function WalletButton() {
  return (
    <div className="wallet-button-wrapper">
      <ConnectButton />
      <style jsx>{`
        .wallet-button-wrapper {
          position: fixed;
          top: 20px;
          right: 70px;
          z-index: 1000;
        }
        .wallet-button-wrapper :global(button) {
          font-size: 13px !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
        }
      `}</style>
    </div>
  );
}
