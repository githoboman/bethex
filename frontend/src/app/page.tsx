"use client";

import React, { useState } from 'react';
import { BrowserProvider, ethers } from 'ethers';

const BOT_CHAIN_ID = '0x2a5'; // 677
const WBOT_ADDRESS = "0xD5452816194a3784dBa983426cCe7c122F4abd30";

// Dummy contract for UI demo purposes if real one isn't deployed yet
const BETHEX_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; 

const MARKETS = [
  { id: 1, title: "BTC Price > $65,000 on Friday", yesOdds: 1.85, noOdds: 1.95, pool: "1,250 WBOT" },
  { id: 2, title: "ETH Gas < 15 gwei weekend avg", yesOdds: 2.10, noOdds: 1.75, pool: "840 WBOT" },
  { id: 3, title: "Bot Chain hits 1M txs this month", yesOdds: 1.50, noOdds: 2.40, pool: "3,100 WBOT" },
];

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // App State
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [betAmount, setBetAmount] = useState<string>("0.01");
  const [betSide, setBetSide] = useState<"YES" | "NO" | null>(null);
  const [isProcessingTx, setIsProcessingTx] = useState(false);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      setError("Please install a Web3 wallet like MetaMask.");
      return;
    }
    
    setIsConnecting(true);
    setError(null);
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) setAccount(accounts[0]);

      const network = await provider.getNetwork();
      if (network.chainId.toString() !== '677') {
        try {
          await provider.send("wallet_switchEthereumChain", [{ chainId: BOT_CHAIN_ID }]);
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await provider.send("wallet_addEthereumChain", [{
                chainId: BOT_CHAIN_ID,
                chainName: "BOT Chain Mainnet",
                rpcUrls: ["https://rpc.botchain.ai"],
                nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 },
                blockExplorerUrls: ["https://scan.botchain.ai"],
            }]);
          } else throw switchError;
        }
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to connect wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  const placeBet = async () => {
    if (!account || !selectedMarket || !betSide) return;
    
    try {
      setError(null);
      setIsProcessingTx(true);
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      
      // If no contract deployed, simulate the transaction for the demo video
      if (BETHEX_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        console.log("Simulating Bethex interaction (Contract not yet deployed)...");
        // Force MetaMask popup by having them sign a message instead of sending a tx that would fail
        await signer.signMessage(`Place ${betAmount} WBOT Bet on: ${selectedMarket.title} (${betSide})\n\nBethex MVP Demo`);
        alert(`Successfully placed bet on ${selectedMarket.title}!\n\n(Note: This was a simulated Web3 interaction for your MVP demo)`);
        return;
      }

      // Real contract logic (requires deployed contract)
      const depositAmount = ethers.parseEther(betAmount);
      const ERC20_ABI = ["function approve(address spender, uint256 amount) external returns (bool)"];
      const wbot = new ethers.Contract(WBOT_ADDRESS, ERC20_ABI, signer);
      
      console.log("Approving WBOT...");
      const approveTx = await wbot.approve(BETHEX_CONTRACT_ADDRESS, depositAmount);
      await approveTx.wait();

      const BETHEX_ABI = ["function deposit(address token, uint256 amount) external"];
      const bethex = new ethers.Contract(BETHEX_CONTRACT_ADDRESS, BETHEX_ABI, signer);
      const depositTx = await bethex.deposit(WBOT_ADDRESS, depositAmount);
      await depositTx.wait();
      
      alert(`Successfully placed bet!\nTx: ${depositTx.hash}`);
    } catch (err: any) {
      console.error(err);
      setError(err.reason || err.message || "Transaction failed");
    } finally {
      setIsProcessingTx(false);
    }
  };

  return (
    <main className="container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
        <div className="logo" style={{ fontSize: '28px', fontWeight: 'bold' }}>Bethex</div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="https://scan.botchain.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Explorer</a>
          {!account ? (
            <button className="btn btn-primary" onClick={connectWallet} disabled={isConnecting} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', padding: '10px 20px', borderRadius: '8px', color: '#3b82f6', fontWeight: 'bold' }}>
              {account.slice(0,6)}...{account.slice(-4)}
            </div>
          )}
        </div>
      </header>

      {!account ? (
        <section style={{ textAlign: 'center', marginTop: '100px' }}>
          <span style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '6px 12px', borderRadius: '100px', fontSize: '14px', fontWeight: 'bold' }}>LIVE ON BOT CHAIN</span>
          <h1 style={{ fontSize: '64px', margin: '20px 0', letterSpacing: '-1px' }}>The Future of Prediction Markets</h1>
          <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 40px auto' }}>Experience ultra-fast, secure, and verifiable predictions powered by BOT Chain's high-performance Layer 1 infrastructure.</p>
          <button onClick={connectWallet} style={{ padding: '16px 32px', fontSize: '18px', background: '#3b82f6', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Launch Exchange</button>
        </section>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          
          {/* Markets List */}
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Active Markets</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {MARKETS.map(market => (
                <div key={market.id} onClick={() => setSelectedMarket(market)} style={{ background: 'rgba(255,255,255,0.03)', border: selectedMarket?.id === market.id ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '20px' }}>{market.title}</h3>
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>Pool: {market.pool}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedMarket(market); setBetSide("YES"); }} style={{ flex: 1, padding: '12px', background: betSide === "YES" && selectedMarket?.id === market.id ? '#16a34a' : 'rgba(22, 163, 74, 0.1)', border: '1px solid #16a34a', color: betSide === "YES" && selectedMarket?.id === market.id ? '#fff' : '#4ade80', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                      YES {market.yesOdds}x
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedMarket(market); setBetSide("NO"); }} style={{ flex: 1, padding: '12px', background: betSide === "NO" && selectedMarket?.id === market.id ? '#dc2626' : 'rgba(220, 38, 38, 0.1)', border: '1px solid #dc2626', color: betSide === "NO" && selectedMarket?.id === market.id ? '#fff' : '#f87171', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                      NO {market.noOdds}x
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bet Slip */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', height: 'fit-content' }}>
            <h2 style={{ fontSize: '24px', margin: '0 0 24px 0' }}>Bet Slip</h2>
            
            {!selectedMarket ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>Select a market to place a bet.</p>
            ) : (
              <div>
                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>{selectedMarket.title}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '24px', fontSize: '14px' }}>
                  <span>Outcome: <strong style={{ color: betSide === 'YES' ? '#4ade80' : '#f87171' }}>{betSide || "Not selected"}</strong></span>
                  <span>Odds: {betSide === 'YES' ? selectedMarket.yesOdds : betSide === 'NO' ? selectedMarket.noOdds : '-'}x</span>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Amount (WBOT)</label>
                  <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', color: 'white', borderRadius: '8px', fontSize: '16px' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginBottom: '24px' }}>
                  <span style={{ color: '#94a3b8' }}>Potential Payout</span>
                  <strong style={{ color: '#3b82f6', fontSize: '18px' }}>
                    {betSide ? (parseFloat(betAmount) * (betSide === 'YES' ? selectedMarket.yesOdds : selectedMarket.noOdds)).toFixed(4) : "0.00"} WBOT
                  </strong>
                </div>

                <button onClick={placeBet} disabled={!betSide || isProcessingTx} style={{ width: '100%', padding: '16px', background: !betSide || isProcessingTx ? '#475569' : '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: !betSide || isProcessingTx ? 'not-allowed' : 'pointer' }}>
                  {isProcessingTx ? "Processing..." : "Place Bet"}
                </button>
                {error && <p style={{color: '#ef4444', marginTop: '12px', fontSize: '14px'}}>{error}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      <footer style={{ marginTop: '80px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px', color: '#94a3b8' }}>
        <p>Bethex 2026. Powered by BOT Chain.</p>
      </footer>
    </main>
  );
}
