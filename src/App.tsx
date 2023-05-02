import { useEffect, useState } from 'react';
import { Box, InputBase, IconButton, Typography, Container, Divider, Alert } from '@mui/material';
import { getPlayerByName, getPlayerMatches, getMatchInfo } from './Utils/api';
import SearchIcon from '@mui/icons-material/Search';
import { PlayerInfos, MatchHistoryList } from './components';

//hooks, saves data until the page is refreshed usestate is for default values
function App() {
	const [searchText, setSearchText] = useState<string>('');
	const [playerInfos, setPlayerInfos] = useState<any>(null);
	const [playerMatchIds, setPlayerMatchIds] = useState<any[]>([]);
	const [playerMatches, setPlayerMatches] = useState<any[]>([]);
	const [appAlert, setAppAlert] = useState<any>({ message: '', severity: '' });
	const [showAlert, setShowAlert] = useState<boolean>(false);

	const alertStyle = {
		position: 'fixed',
		left: '50%',
		bottom: 50,
		transform: 'translate(-50%, 0)',
		display: 'flex',
		alignItems: 'center',
		padding: '10px 20px',
		zIndex: 4000,
	} as const;

		// Function to get the infos of the player using the API
	async function getPlayerInfos() {
		if (searchText !== '') {
			const player = await getPlayerByName(searchText);
			if (player) {
				setPlayerInfos(player);
			} else {
				setAppAlert({ message: 'No summoner name matches the input.', severity: 'error' });
			}
		} else {
			setAppAlert({ message: 'Please enter a summoner name', severity: 'error' });
		}
	}

	// Function to get 5 matches in the match history, 5 matches because of API call restrictions
	async function getMatcheIds() {
		const matches = await getPlayerMatches(playerInfos.puuid);
		if (matches && matches.length > 0) {
			const filteredMatches = matches.slice(0, 5);
			setPlayerMatchIds(filteredMatches);
		} else {
			setAppAlert({ message: 'No matches found', severity: 'error' });
		}
	}

    //Function to get the infos from the match
	async function getMatcheInfos() {
		const matches: any[] = [];
		for (let i = 0; i < playerMatchIds.length; i++) {
			const match = await getMatchInfo(playerMatchIds[i]);
			if (match) {
				matches.push(match);
			}
		}
		setPlayerMatches(matches);
	}

	// When page is loaded for the first time it will try to trigger this but it won't work right now due to the playerinfos being null
	useEffect(() => {
		if (playerInfos) {
			getMatcheIds();
		}
	}, [playerInfos]);

	//As soon as there is player infos it will trigger the effect
	useEffect(() => {
		if (appAlert.message !== '') {
			setShowAlert(true);
			setTimeout(() => {
				setShowAlert(false);
				setAppAlert({ message: '', severity: '' });
			}, 5000);
		}
	}, [appAlert]);

	useEffect(() => {
		if (playerMatchIds.length > 0) {
			getMatcheInfos();
		}
	}, [playerMatchIds]);

	// PREMADE COMPONENTS USING MUI 
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					width: '100vw',
					alignItems: 'center',
					justifyContent: 'space-around',
					paddingTop: 1,
					paddingBottom: 1,
					backgroundColor: '#d13139',
				}}
			>
				<Typography sx={{ color: 'white' }} variant="h6">
					Legend of Runeterra Match history
				</Typography>
				<Box
					sx={{
						border: '2px solid white',
						width: 'fit-content',
						padding: 0.4,
						borderRadius: 3,
					}}
				>
					<InputBase
						id="outlined-helperText"
						type="search"
						placeholder="Enter a summoner name"
						defaultValue={searchText}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								getPlayerInfos();
							}
						}}
						onChange={(event) => {
							setSearchText(event.target.value);
						}}
						sx={{
							color: 'white',
							width: 300,
							paddingLeft: '10px',
						}}
					/>
					<IconButton
						onClick={() => {
							getPlayerInfos();
						}}
					>
						<SearchIcon sx={{ color: 'white' }} />
					</IconButton>
				</Box>
			</Box>
			{/* LOAD THE PLAYER INFOS IN A CONTAINER */}
			<Container sx={{ maxWidth: '1600px'}}>
				{playerInfos && (
					<>
						<PlayerInfos
							summonerName={playerInfos.name}
							summonerLevel={playerInfos.summonerLevel}
							summonerIcon={playerInfos.profileIconId}
						/>
						<Divider sx={{ borderColor: 'white', margin: '10px 0 10px 0' }} />
					</>
				)}
				{playerMatches.length > 0 && (
					<MatchHistoryList
						playerName={playerInfos.name}
						playerPuuid={playerInfos.puuid}
						matchHistory={playerMatches}
					/>
				)}
			</Container>
			{/* SHOW THE ALERT MESSAGE */}
			{showAlert && (
				<Alert sx={alertStyle} severity={appAlert.severity}>
					<Typography sx={{ fontSize: 16, fontWeight: 500 }}>
						{appAlert.message}
					</Typography>
				</Alert>
			)}
		</Box>
	);
}

export default App;
