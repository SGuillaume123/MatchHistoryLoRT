import { useEffect, useState } from 'react';
import MatchHistoryItem from './MatchHistoryItem';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import moment from 'moment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import fs from 'fs';


interface MatchHistoryListProps {
	matchHistory: any[];
	playerPuuid: string;
	playerName: string;
}

function matchHistoryList(props: MatchHistoryListProps) {
	const { matchHistory, playerPuuid, playerName } = props;
	const [expanded, setExpanded] = useState<any>({});

	useEffect(()=> {
		let expendedDict: any = {};
		matchHistory.forEach((match: any) => {
			expendedDict[match.metadata.match_id] = false;
		});
		setExpanded(expendedDict);
	}, [])

	function expendAccordion(matchId: string) {
		let expendedDict = {...expanded};
		expendedDict[matchId] = !expendedDict[matchId];
		setExpanded(expendedDict);
	}

	let AccordionSummeryStyle = {
		backgroundColor: '',
		width: '100%',
		'.MuiTypography-root': {
			color: 'white',
		},
	};

	let infosStyle = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 2,
		width: '10em',
	};

	function convertDate(date: string) {
		return moment(date).utc().format('DD/MM/YYYY');
	}

	function getFactionIcon(faction: string) {
		let source = `./src/assets/images/factions/icon-${faction
			.substring(faction.indexOf('_') + 1, faction.lastIndexOf('_'))
			.toLowerCase()}.png`;
		if (source.includes('piltover' || 'zaun')) {
			source = './src/assets/images/factions/icon-piltoverzaun.png';
		} else if (source.includes('targon')) {
			source = './src/assets/images/factions/icon-targon.png';
		} else if (faction === 'AI') {
			source = './src/assets/images/factions/icon-all.png';
		}
		return source;
	}


	return (
		<Box sx={{ padding: '10px 0 20px 0' }}>
			{matchHistory.map((match: any, index: number) => {
				const { game_start_time_utc, game_type, total_turn_count } = match.info;
				const isAI = game_type === 'AI';
				const player = match.info.players.find(
					(player: any) => player.puuid === playerPuuid
				);
				const adversary = match.info.players.find(
					(player: any) => player.puuid !== playerPuuid
				);
				return (
					<Accordion key={index}>
						<AccordionSummary
							sx={AccordionSummeryStyle}
							style={{
								backgroundColor:
									player.game_outcome === 'win' ? '#349c27' : '#d13139',
								pointerEvents: isAI ? 'none' : 'auto',
							}}
							onClick={() => {
								if (!isAI) {
									expendAccordion(match.metadata.match_id);
								}
							}}
							expandIcon={!isAI && <ExpandMoreIcon sx={{ color: 'white' }} />}
						>
							<Box sx={infosStyle} style={{ width: '60px' }}>
								<Typography
									sx={{
										fontWeight: 'bold',
										textTransform: 'uppercase',
									}}
								>
									{player.game_outcome}
								</Typography>
								<Typography>{game_type}</Typography>
							</Box>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Box sx={infosStyle}>
									<Typography>{playerName}</Typography>
									<Box sx={{ display: 'flex', justifyContent: 'center' }}>
										{player.factions.map((faction: any, index: number) => {
											return (
												<img
													style={{ width: '30%' }}
													key={index}
													src={getFactionIcon(faction)}
												/>
											);
										})}
									</Box>
								</Box>
								<Typography sx={{ fontWeight: 700 }}>VS</Typography>
								<Box sx={infosStyle}>
									<Typography>{isAI ? 'AI' : 'Enemy'}</Typography>
									{!isAI ? (
										<Box sx={{ display: 'flex', justifyContent: 'center' }}>
											{adversary.factions.map(
												(faction: any, index: number) => {
													return (
														<img
															style={{ width: '30%' }}
															key={index}
															src={getFactionIcon(faction)}
														/>
													);
												}
											)}
										</Box>
									) : (
										<img
											style={{ width: '20%' }}
											key={index}
											src={getFactionIcon('AI')}
										/>
									)}
								</Box>
							</Box>
							<Box sx={infosStyle}>
								<Typography>Turns played: {total_turn_count}</Typography>
							</Box>
							<Box sx={infosStyle}>
								<Typography>{convertDate(game_start_time_utc)}</Typography>
							</Box>
						</AccordionSummary>
						<AccordionDetails>
							{expanded[match.metadata.match_id] && (
								<MatchHistoryItem playerName={playerName} playerPuuid={playerPuuid} matchInfo={match} />
							)}
						</AccordionDetails>
					</Accordion>
				);
			})}
		</Box>
	);
}

export default matchHistoryList;
