import React, { useState, useEffect } from 'react';
import { Box, Typography, Tooltip, List, ListItem, TextField } from '@mui/material';
import { DeckEncoder } from 'runeterra';
import { set1, set2, set3, set4, set5, set6, set7 } from '../../assets/data';
import fs from 'fs';

interface MatchHistoryItemProps {
	matchInfo: any;
	playerPuuid: string;
	playerName: string;
}

function matchHistoryItem(props: MatchHistoryItemProps) {
	const { matchInfo, playerPuuid, playerName } = props;
	const { info } = matchInfo;
	const [playerDeck, setPlayerDeck] = useState<any[]>([]);
	const [adversaryDeck, setAdversaryDeck] = useState<any[]>([]);
	const [playerDeckWithInfos, setPlayerDeckWithInfos] = useState<any[]>([]);
	const [adversaryDeckWithInfos, setAdversaryDeckWithInfos] = useState<any[]>([]);
	const player = info.players.find((player: any) => player.puuid === playerPuuid);
	const adversary = info.players.find((player: any) => player.puuid !== playerPuuid);
	const setDatas = [...set1, ...set2, ...set3, ...set4, ...set5, ...set6, ...set7];

	function getDeckInfos(deck: any) {
		const deckWithInfos = deck.map((card: any) => {
			const cardInfos: any = setDatas.find(
				(cardInfo: any) => cardInfo.cardCode === card.code
			);
			return cardInfos;
		});
		return deckWithInfos;
	}

	useEffect(() => {
		if (player) {
			const deck = DeckEncoder.decode(player.deck_code);
			setPlayerDeck(deck);
		}
	}, [player]);
	console.log(player)

	useEffect(() => {
		if (adversary) {
			const deck = DeckEncoder.decode(adversary.deck_code);
			setAdversaryDeck(deck);
		}
	}, [adversary]);

	useEffect(() => {
		if (playerDeck.length > 0 && setDatas.length > 0) {
			const deck = getDeckInfos(playerDeck);
			setPlayerDeckWithInfos(deck);
		}
	}, [playerDeck]);

	useEffect(() => {
		if (adversaryDeck.length > 0 && setDatas.length > 0) {
			const deck = getDeckInfos(adversaryDeck);
			setAdversaryDeckWithInfos(deck);
		}
	}, [adversaryDeck]);

	function cardTooltip(card: any) {
		return (
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				<Typography sx={{ width: '100%', textAlign: 'center' }} variant="h6">
					{card.name}
				</Typography>
				<List>
					<ListItem>
						<Typography variant="body1">Cost: {card.cost}</Typography>
					</ListItem>
					<ListItem>
						<Typography variant="body1">Attack: {card.attack}</Typography>
					</ListItem>
					<ListItem>
						<Typography variant="body1">Health: {card.health}</Typography>
					</ListItem>
					<ListItem>
						<Typography variant="body1">Type: {card.supertype !== '' ? card.supertype : card.type}</Typography>
					</ListItem>
					<ListItem>
						<Typography variant="body1">Description: {card.descriptionRaw}</Typography>
					</ListItem>
				</List>
				<Typography sx={{ opacity: 0.7 }} variant="caption">
					{`“${card.flavorText}”`}
				</Typography>
			</Box>
		);
	}

	function loadCardImages(deck: any) {
		let cardByType: any = {};
		deck.forEach((card: any) => {
			if (card === undefined || !card) {return null}
			if(card !== undefined && card.supertype !== '') {
				if (cardByType[card.supertype]) {
					cardByType[card.supertype].push(card);
				} else {
					cardByType[card.supertype] = [card];
				}
			} else {
				if (cardByType[card.type]) {
					cardByType[card.type].push(card);
				} else {
					cardByType[card.type] = [card];
				}
			}
		});
		return Object.keys(cardByType).map((key: any) => {
			if (cardByType[key].length > 0) {
				return (
					<>
						<Typography
							sx={{
								fontWeight: 'bold',
								margin: '10px 0 10px 0',
								textTransform: 'uppercase',
							}}
							variant="h6"
						>
							{key}
						</Typography>
						<Box
							sx={{
								display: 'flex',
								flexWrap: 'wrap',
								width: '80%',
								justifyContent: 'center',
							}}
						>
							{cardByType[key].map((card: any) => {
								return (
									<Tooltip
										enterDelay={800}
										title={<React.Fragment>{cardTooltip(card)}</React.Fragment>}
									>
										<img
											src={`${card.assets[0].gameAbsolutePath}`}
											alt={card.cardCode}
											style={{
												width: '120px',
												height: '180px',
											}}
										/>
									</Tooltip>
								);
							})}
						</Box>
					</>
				);
			}
		});
	}

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'justify-between',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						width: '50%',
						alignItems: 'center',
					}}
				>
					<Typography variant="h5">{`${playerName} Deck:`}</Typography>
					<TextField
						label="Deck Code"
						defaultValue={player.deck_code || ''}
						InputProps={{
							readOnly: true,
						}}
						variant="filled"
						sx={{
							width: '500px',
							marginTop: '10px'
						}}
					/>
					{playerDeckWithInfos.length > 0 && loadCardImages(playerDeckWithInfos)}
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						width: '50%',
						alignItems: 'center',
					}}
				>
					<Typography variant="h5">Enemy Deck:</Typography>
					{adversary && (
						<TextField
							label="Deck Code"
							defaultValue={adversary.deck_code || '' }
							InputProps={{
								readOnly: true,
							}}
							variant="filled"
							sx={{
								width: '500px',
								marginTop: '10px'
							}}
						/>
					)}
					
					{adversaryDeck.length > 0 && loadCardImages(adversaryDeckWithInfos)}
				</Box>
			</Box>
		</Box>
	);
}

export default matchHistoryItem;
