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
						chainId: '0x2EB', // Hexadecimal for 747
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
		}
	};

	const checkConnection = async () => {
		if (!ui) return false;
		if (!ui.connected()) {
			await openModal();
		}
		return true;
	};

	const openModal = async () => {
		if (!ui) return;
		try {
			const chains = ui.session?.chains || [];
			if (!chains.includes('eip155:747')) {
				await addChain();
			}
			const session = await ui.openModal({
				namespaces: {
					eip155: {
						chains: ['eip155:747'],
						defaultChain: '747',
					},
				},
			});
			console.log('Session:', session);
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

	return { openModal, sendTransaction, checkConnection };
}
