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

	const logIn = async () => {
		if (!provider) return;
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
	};

	const logOut = () => {
		provider?.disconnect();
		setWalletAddress(null);
	};

	return { walletAddress, logIn, logOut };
}
