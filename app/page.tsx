// app/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';

export default function Home() {
	const { walletAddress, logIn, logOut } = useAuth();

	return (
		<div className="page-container">
			<div className="card">
				<h1 className="card-title">Connect OKX Wallet</h1>
				{walletAddress ? (
					<div>
						<p>Connected: {walletAddress}</p>
						<button onClick={logOut}>Disconnect</button>
					</div>
				) : (
					<button onClick={logIn} className="button button-connect">
						Connect Wallet
					</button>
				)}
			</div>
		</div>
	);
}
