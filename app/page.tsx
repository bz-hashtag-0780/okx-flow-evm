'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
	const [client, setClient] = useState<OKXUniversalConnectUI | null>(null);
	const [walletAddress, setWalletAddress] = useState<any>('');
	const initRef = useRef(false);

	useEffect(() => {
		async function initClient() {
			if (initRef.current) return;
			initRef.current = true;

			try {
				const client = await OKXUniversalConnectUI.init({
					dappMetaData: {
						icon: 'https://cryptologos.cc/logos/flow-flow-logo.png',
						name: 'Flow DApp',
					},
					actionsConfiguration: {
						returnStrategy: 'none',
						modals: 'all',
					},
					uiPreferences: {
						theme: THEME.LIGHT,
					},
				});
				setClient(client);
			} catch (e) {
				console.error('Error initializing client:', e);
			} finally {
				initRef.current = false;
			}
		}
		initClient();
	}, []);

	// const initOKXUI = async () => {
	// 	universalUi.current = await OKXUniversalConnectUI.init({
	// 		dappMetaData: {
	// 			icon: 'https://cryptologos.cc/logos/flow-flow-logo.png',
	// 			name: 'Flow DApp',
	// 		},
	// 		uiPreferences: {
	// 			theme: THEME.LIGHT,
	// 		},
	// 	});
	// };

	// useEffect(() => {
	// 	initOKXUI();
	// }, []);

	// const handleConnectWallet = async () => {
	// 	if (!universalUi.current) return;

	// 	try {
	// 		const session: any = await universalUi.current.openModal({
	// 			namespaces: {
	// 				eip155: {
	// 					chains: ['eip155:747'],
	// 					rpcMap: {
	// 						747: flowChainConfig.rpcUrls[0],
	// 					},
	// 					defaultChain: '747',
	// 				},
	// 			},
	// 		});

	// 		const account = session.namespaces.eip155.accounts[0];
	// 		setWalletAddress(account.split(':')[2]); // Extract address

	// 		// Ensure the Flow EVM chain is added
	// 		await universalUi.current.request({
	// 			method: 'wallet_addEthereumChain',
	// 			params: [flowChainConfig],
	// 		});
	// 	} catch (error) {
	// 		console.error('Connection failed:', error);
	// 	}
	// };

	// const handleDisconnectWallet = async () => {
	// 	if (universalUi.current) {
	// 		await universalUi.current.disconnect();
	// 		setWalletAddress('');
	// 	}
	// };

	return (
		<div style={{ textAlign: 'center', padding: '2rem' }}>
			<h1>Flow EVM Wallet Connection</h1>
			{walletAddress ? (
				<>
					<p>Connected to Wallet: {walletAddress}</p>
					<button
						className="button button-disconnect"
						onClick={async () => {
							await client?.disconnect();
							setWalletAddress('');
						}}
					>
						Disconnect
					</button>
				</>
			) : (
				<button
					className="button button-connect"
					onClick={async () => {
						try {
							if (initRef.current) {
								alert(
									'Please wait for the client to initialize.'
								);
								return;
							}
							if (!client) {
								alert('Client not initialized.');
								return;
							}
							if (client.connected()) {
								await client.disconnect();
							}

							const session = await client.openModal({
								namespaces: {
									eip155: {
										chains: ['eip155:1'],
										defaultChain: '1',
									},
								},
								optionalNamespaces: {
									eip155: {
										chains: ['eip155:747'],
										defaultChain: '747',
										rpcMap: {
											747: flowChainConfig.rpcUrls[0],
										},
									},
								},
							});

							if (session) {
								const addressWithChain =
									session.namespaces.eip155.accounts[0];
								if (
									!session.namespaces.eip155.chains.includes(
										'eip155:747'
									)
								) {
									await client.request({
										method: 'wallet_addEthereumChain',
										params: [flowChainConfig],
									});
								}
								setWalletAddress(addressWithChain);
							} else {
								throw new Error('Init session failed');
							}
						} catch (e) {
							alert('Connection failed:');
						}
					}}
				>
					Connect Wallet
				</button>
			)}
		</div>
	);
}
