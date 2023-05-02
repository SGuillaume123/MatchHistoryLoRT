import { Box, Typography } from '@mui/material';

// COMPONENT REQUIREMENTS
interface PlayerInfosProps {
	summonerName: string;
	summonerLevel: number;
    summonerIcon: number;
}

//SX is to override the styling
const imageStyle = {
    borderRadius: '50%',
    width: '20%',
    height: '20%',
} as const

function PlayerInfos(props: PlayerInfosProps) {
    // DECONSTRUCTING THE OBJECT AND CREATING A CONST
	const { summonerName, summonerLevel, summonerIcon } = props;
	return (
		<Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                marginTop: 5, 
            }}
        >
            <Typography
                sx={{
                    marginBottom: 3,
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                }}
                variant='h3'
             >
                Player Infos	
            </Typography>
            {/* GET THE ICONS FROM THE COMMUNITY TO LOAD THEM */}
            <img style={imageStyle} src={`https://cdn.communitydragon.org/latest/profile-icon/${summonerIcon}`}/>
			<Typography 
                sx={{
                    marginTop: 0.5,
                }} 
                variant='h4'
            >
                {summonerName}
            </Typography>
			<Typography variant='h6'>summoner level: {summonerLevel}</Typography>
		</Box>
	);
}

export default PlayerInfos;
