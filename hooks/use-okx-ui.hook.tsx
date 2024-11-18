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

	const openModal = async () => {
		if (!ui) return;
		try {
			const session = await ui.openModal({
				namespaces: {
					eip155: {
						chains: ['eip155:747'], // Flow EVM
						defaultChain: '747',
					},
				},
			});
			console.log('Session:', session);
		} catch (error) {
			console.error('Failed to open UI modal:', error);
		}
	};

	return { openModal };
}
