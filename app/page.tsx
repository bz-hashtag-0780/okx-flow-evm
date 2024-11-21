'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { OKXUniversalConnectUI, THEME } from '@okxconnect/ui';

const flowChainConfig = {
	chainId: '747',
	chainName: 'Flow',
	nativeCurrency: {
		name: 'Flow',
		symbol: 'FLOW',
		decimals: 18,
	},
	rpcUrls: ['https://mainnet.evm.nodes.onflow.org'],
	blockExplorerUrls: ['https://evm.flowscan.io/'],
};

export default function HomePage() {
	const universalUi = useRef<OKXUniversalConnectUI | null>(null);
	const [walletAddress, setWalletAddress] = useState('');

	const initOKXUI = async () => {
		universalUi.current = await OKXUniversalConnectUI.init({
			dappMetaData: {
				icon: 'https://cryptologos.cc/logos/flow-flow-logo.png',
				name: 'Flow DApp',
			},
			uiPreferences: {
				theme: THEME.LIGHT,
			},
		});
	};

	useEffect(() => {
		initOKXUI();
	}, []);

	const handleConnectWallet = async () => {
		if (!universalUi.current) return;

		try {
			const session: any = await universalUi.current.openModal({
				namespaces: {
					eip155: {
						chains: ['eip155:747'],
						rpcMap: {
							747: flowChainConfig.rpcUrls[0],
						},
						defaultChain: '747',
					},
				},
			});

			const account = session.namespaces.eip155.accounts[0];
			setWalletAddress(account.split(':')[2]); // Extract address

			// Ensure the Flow EVM chain is added
			await universalUi.current.request({
				method: 'wallet_addEthereumChain',
				params: [flowChainConfig],
			});
		} catch (error) {
			console.error('Connection failed:', error);
		}
	};

	const handleDisconnectWallet = async () => {
		if (universalUi.current) {
			await universalUi.current.disconnect();
			setWalletAddress('');
		}
	};

	return (
		<div style={{ textAlign: 'center', padding: '2rem' }}>
			<h1>Flow EVM Wallet Connection</h1>
			{walletAddress ? (
				<>
					<p>Connected to Wallet: {walletAddress}</p>
					<button
						className="button button-disconnect"
						onClick={handleDisconnectWallet}
					>
						Disconnect
					</button>
				</>
			) : (
				<button
					className="button button-connect"
					onClick={handleConnectWallet}
				>
					Connect Wallet
				</button>
			)}
		</div>
	);
}
