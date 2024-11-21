/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { OKXUniversalProvider } from '@okxconnect/universal-provider';

export default function useUser() {
	const [provider, setProvider] = useState<any>(null);
	const [walletAddress, setWalletAddress] = useState<any>(null);

	useEffect(() => {
		async function initProvider() {
			const okxProvider = await OKXUniversalProvider.init({
				dappMetaData: {
					name: 'OKX Telegram DApp',
					icon: 'https://cryptologos.cc/logos/flow-flow-logo.png', // Replace with your app icon
				},
			});
			setProvider(okxProvider);
		}
		initProvider();
	}, []);

	const addChain = async () => {
		if (!provider) return;
		try {
			await provider.request({
				method: 'wallet_addEthereumChain',
				params: [
					{
						chainId: '747',
						chainName: 'Flow',
						nativeCurrency: {
							name: 'Flow',
							symbol: 'FLOW',
							decimals: 18,
						},
						rpcUrls: ['https://mainnet.evm.nodes.onflow.org'],
						blockExplorerUrls: ['https://evm.flowscan.io/'], // Optional
					},
				],
			});
		} catch (error) {
			console.error('Error adding chain:', error);
		}
	};

	const logIn = async () => {
		if (!provider) return;
		// Ensure the chain is added before connecting
		await addChain();
		try {
			const session = await provider.connect({
				namespaces: {
					eip155: {
						chains: ['eip155:747'], // Add other chains if needed chains: ["eip155:1", "eip155:xxx"],
						defaultChain: '747',
					},
				},
			});
			const accounts = session?.accounts || [];
			setWalletAddress(accounts[0] || null);
		} catch (error) {
			console.error('Error logging in:', error);
		}
	};

	const logOut = () => {
		provider?.disconnect();
		setWalletAddress(null);
	};

	return { walletAddress, logIn, logOut, addChain };
}
