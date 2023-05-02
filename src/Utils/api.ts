import axios from 'axios';
// GOTTEN FROM ENV FOLDER
const token = import.meta.env.VITE_API_KEY;

// RIOT ALWAYS RETURNS AN ERROR
export async function getPlayerByName(name: string) {
	try {
		const response = await axios.get(
			`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${token}`
		);
		return response.data;
	} catch (error) {
		console.log(error);
	}
    return null;
}

export async function getPlayerMatches(puuid: string) {
	try {
		const response = await axios.get(
			`https://americas.api.riotgames.com/lor/match/v1/matches/by-puuid/${puuid}/ids?api_key=${token}`
		);
		return response.data;
	} catch (error) {
		console.log(error);
	}
    return null;
}

export async function getMatchInfo(matchId: string) {
	try {
		const response = await axios.get(
			`https://americas.api.riotgames.com/lor/match/v1/matches/${matchId}?api_key=${token}`
		);
		return response.data;
	} catch (error) {
		console.log(error);
	}
    return null;
}
