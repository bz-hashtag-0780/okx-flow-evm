// 'use client';

// import { useAuth } from '@/context/AuthContext';

// export default function Home() {
// 	const { walletAddress, logIn, logOut } = useAuth();

// 	return (
// 		<div className="page-container">
// 			<div className="card">
// 				<h1 className="card-title">Connect OKX Wallet</h1>
// 				{walletAddress ? (
// 					<div>
// 						<p>Connected: {walletAddress}</p>
// 						<button onClick={logOut}>Disconnect</button>
// 					</div>
// 				) : (
// 					<button onClick={logIn} className="button button-connect">
// 						Connect Wallet
// 					</button>
// 				)}
// 			</div>
// 		</div>
// 	);
// }

'use client';

import useOKXUI from '@/hooks/use-okx-ui.hook';

export default function Home() {
	const { openModal } = useOKXUI();

	return (
		<div style={{ textAlign: 'center', marginTop: '50px' }}>
			<h1>OKX Wallet Integration with UI</h1>
			<button
				onClick={openModal}
				style={{
					padding: '10px 20px',
					marginTop: '20px',
					fontSize: '16px',
					cursor: 'pointer',
				}}
			>
				Connect Wallet
			</button>
		</div>
	);
}
