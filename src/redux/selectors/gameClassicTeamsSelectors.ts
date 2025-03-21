import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/store'

const teamsState = (state: RootState) => state.gameClassicTeams.teams
const historyClassicTeamsState = (state: RootState) => state.gameClassicTeams.historyClassicTeams
const currentTeamIndexState = (state: RootState) => state.gameClassicTeams.currentTeamIndex
const currentPlayerIndexInTeamState = (state: RootState) => state.gameClassicTeams.currentPlayerIndexInTeam

export const selectTeams = createSelector([teamsState], (teams) => teams)
export const selectHistoryClassicTeams = createSelector([historyClassicTeamsState], (historyClassicTeams) => historyClassicTeams)
export const selectCurrentTeamIndex = createSelector([currentTeamIndexState], (currentTeamIndex) => currentTeamIndex)
export const selectCurrentPlayerIndexInTeam = createSelector([currentPlayerIndexInTeamState], (currentPlayerIndexInTeam) => currentPlayerIndexInTeam)
