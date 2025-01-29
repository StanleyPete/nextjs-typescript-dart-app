export interface PlayerNamesInputProps { maxPlayers: number }

export interface TeamsPlayerInput { 
    teamIndex: number 
    playerIndexes: number[] 
}

export interface GuestReadyProp {
    guestReady: boolean;
 }

export interface SetGuestReadyProp {
    setGuestReady: React.Dispatch<React.SetStateAction<boolean>>;
}








