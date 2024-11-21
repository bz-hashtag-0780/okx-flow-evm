/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { OKXUniversalConnectUI, THEME } from '@okxconnect/ui';

export default function useOKXUI() {
	const [ui, setUi] = useState<any>(null);

	useEffect(() => {
		async function initUI() {
			const uiInstance = await OKXUniversalConnectUI.init({
				dappMetaData: {
					name: 'My DApp',
					icon: 'https://cryptologos.cc/logos/flow-flow-logo.png',
				},
				actionsConfiguration: {
					returnStrategy: 'none',
					modals: 'all',
				},
				uiPreferences: {
					theme: THEME.LIGHT,
				},
			});
			setUi(uiInstance);
		}
		initUI();
	}, []);

	const addChain = async () => {
		if (!ui) return;
		try {
			await ui.provider.request({
				method: 'wallet_addEthereumChain',
				params: [
					{
						chainId: '747', // Hexadecimal for 747 - 0x2EB
						chainName: 'Flow EVM',
						nativeCurrency: {
							name: 'Flow',
							symbol: 'FLOW',
							decimals: 18,
						},
						rpcUrls: ['https://mainnet.evm.nodes.onflow.org'],
						blockExplorerUrls: ['https://evm.flowscan.io/'],
					},
				],
			});
			console.log('Chain added successfully.');
		} catch (error) {
			console.error('Failed to add chain:', error);
			throw error;
		}
	};

	const openModal = async () => {
		if (!ui) return;
		try {
			const session = await ui.openModal({
				namespaces: {
					eip155: {
						chains: ['eip155:747'], // Include Ethereum (1) and Flow EVM (747)
						defaultChain: '747',
					},
				},
				optionalNamespaces: {
					eip155: {
						chains: ['eip155:747'],
					},
				},
			});
			console.log('Session:', session);

			// Check if custom chain needs to be added
			const chains = session?.namespaces?.eip155?.chains || [];
			if (!chains.includes('eip155:747')) {
				await addChain();
			}
		} catch (error) {
			console.error('Failed to open UI modal:', error);
		}
	};

	const sendTransaction = async (txParams: any) => {
		if (!ui) return;
		try {
			const result = await ui.provider.request({
				method: 'eth_sendTransaction',
				params: [txParams],
			});
			console.log('Transaction sent:', result);
			return result;
		} catch (error) {
			console.error('Failed to send transaction:', error);
			throw error;
		}
	};

	return { openModal, sendTransaction };
}
