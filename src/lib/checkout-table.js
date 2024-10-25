const checkoutMap = {
   '2': 'D1',
   '3': '1, D1',
   '4': 'D2',
   '5': '1, D2',
   '6': 'D3 or 2, D2',
   '7': '3, D2',
   '8': 'D4',
   '9': '1, D4',
   '10': 'D5',
   '11': '3, D4',
   '12': 'D6',
   '13': '5, D4',
   '14': 'D7',
   '15': '7, D4',
   '16': 'D8',
   '17': '9, D4',
   '18': 'D9',
   '19': '11, D4 or 3, D8',
   '20': 'D10',
   '21': '17, D2 or 5, D8',
   '22': 'D11',
   '23': '7, D8',
   '24': 'D12',
   '25': '17, D4 or 9, D8',
   '26': 'D13',
   '27': '19, D4',
   '28': 'D14',
   '29': '13, D8',
   '30': 'D15',
   '31': '7, D12 or 15, D8',
   '32': 'D16',
   '33': '1, D16 or 17, D8',
   '34': 'D17',
   '35': '3, D16',
   '36': 'D18',
   '37': '5, D16',
   '38': 'D19',
   '39': '7, D16',
   '40': 'D20',
   '41': '9, D16',
   '42': '10, D16 or 6, D18',
   '43': '3, D20 or 11, D16',
   '44': '12, D16 or 4, D20',
   '45': '13, D16 or 19, D13',
   '46': '6, D20 or 14, D16',
   '47': '15, D16 or 7, D20',
   '48': '16, D16',
   '49': '9, D20',
   '50': '10, D20',
   '51': '11, D20 or 15, D18',
   '52': '12, D20',
   '53': '13, D20 or 17, D18',
   '54': '14, D20',
   '55': '15, D20',
   '56': '16, D20',
   '57': '17, D20',
   '58': '18, D20',
   '59': '19, D20',
   '60': '20, D20',
   '61': 'T15, D8 or T7, D20',
   '62': 'T10, D16 or T12, D13',
   '63': 'T9, D18 or T13, D12',
   '64': 'T16, D8',
   '65': 'Outer, D20 or T15, D10',
   '66': 'T10, D18 or T16, D9',
   '67': 'T9, D20 or T17, D8',
   '68': 'T16, D10 or T12, D16',
   '69': 'T11, D18 or T19, D6',
   '70': 'T10, D20 or T18, D8',
   '71': 'T13, D16 or T17, D10',
   '72': 'T16, D12 or T12, D18',
   '73': 'T19, D8',
   '74': 'T14, D16 or T18, D10',
   '75': 'T17, D12',
   '76': 'T20, D8 or T16, D14',
   '77': 'T19, D10',
   '78': 'T18, D12 or T14, D18',
   '79': 'T19, D11',
   '80': 'T20, D10',
   '81': 'Outer, 16, D20 or T19, D12',
   '82': 'Bull, D16 or T14, D20',
   '83': 'Outer, 18, D20 or T17, D16',
   '84': 'Outer, 19, D20 or T20, D12',
   '85': 'T15, D20 or Outer, 20, D20',
   '86': 'T18, D16',
   '87': 'T17, D18',
   '88': 'T20, D14',
   '89': 'T19, D16',
   '90': 'T20, D15 or Bull, D20',
   '91': 'Bull, 9, D16 or T17, D20',
   '92': 'T20, D16 or Bull, 10, D16',
   '93': 'Bull, 11, D16 or T19, D18',
   '94': 'T18, D20 or Bull, 12, D16',
   '95': 'T19, D19',
   '96': 'T20, D18',
   '97': 'T19, D20',
   '98': 'T20, D19 or T20, 6, D16',
   '99': 'T19, 10, D16 or T19, 6, D18',
   '100': 'T20, D20',
   '101': 'T20, 9, D16 or T19, 12, D16',
   '102': 'T20, 10, D16 or T20, 6, D18',
   '103': 'T19, 10, D18 or T20, 11, D16',
   '104': 'T20, 12, D16 or T18, 10, D20',
   '105': 'T20, 13, D16',
   '106': 'T20, 6, D20 or T20, 10, D18',
   '107': 'T19, T10, D10 or T19, 18, D16',
   '108': 'T18, 18, D18 or T20, 16, D16',
   '109': 'T20, 9, D20 or T19, 12, D20',
   '110': 'T20, 10, D20 or T20, 18, D16',
   '111': 'T19, 14, D20 or T20, 11, D20',
   '112': 'T20, 12, D20 or T20, T16, D2',
   '113': 'T19, 16, D20 or T20, 13, D20',
   '114': 'T18, 20, D20 or T19, 17, D20',
   '115': 'T20, 15, D20 or T19, 18, D20',
   '116': 'T19, 19, D20 or T20, 16, D20',
   '117': 'T19, 20, D20 or T20, 17, D20',
   '118': 'T20, 18, D20',
   '119': 'T19, T12, D13',
   '120': 'T20, 20, D20',
   '121': 'T20, T11, D14 or T17, T18, D8',
   '122': 'T18, T18, D7',
   '123': 'T19, T16, D9',
   '124': 'T20, T14, D11',
   '125': 'Outer, T20, D20 or T18, T19, D7',
   '126': 'T19, T19, D6',
   '127': 'T20, T17, D8',
   '128': 'T18, T16, D13 or T18, T14, D16',
   '129': 'T19, T16, D12 or Outer, T18, Bull',
   '130': 'T20, T20, D5 or T19, T19, D8',
   '131': 'T20, T13, D16 or T19, T16, D13',
   '132': 'Bull, T14, D20 or Bull, Bull, D16',
   '133': 'T20, T19, D8',
   '134': 'T20, T14, D16',
   '135': 'Bull, T19, D14 or Bull, T15, D20',
   '136': 'T20, T20, D8',
   '137': 'T20, T19, D10',
   '138': 'T20, T18, D12 or T20, T14, D18',
   '139': 'T19, Bull, D16 or T19, T14, D20',
   '140': 'T20, T16, D16 or T20, T20, D10',
   '141': 'T20, T19, D12',
   '142': 'T20, T14, D20 or T19, T19, D14',
   '143': 'T20, T17, D16 or T19, T18, D16',
   '144': 'T20, T20, D12 or T18, T18, D18',
   '145': 'T20, T15, D20 or T20, T19, D14',
   '146': 'T20, T18, D16 or T19, T19, D16',
   '147': 'T20, T17, D18 or T19, T18, D18',
   '148': 'T20, T20, D14 or T19, T17, D20',
   '149': 'T20, T19, D16',
   '150': 'T20, T18, D18 or T19, T19, D18',
   '151': 'T20, T17, D20 or T19, T18, D20',
   '152': 'T20, T20, D16 or T19, T19, D19',
   '153': 'T20, T19, D18',
   '154': 'T20, T18, D20 or T19, T19, D20',
   '155': 'T20, T19, D19',
   '156': 'T20, T20, D18',
   '157': 'T20, T19, D20',
   '158': 'T20, T20, D19',
   '159': 'No out shot',
   '160': 'T20, T20, D20',
   '161': 'T20, T17, Bull',
   '162': 'No out shot',
   '163': 'No out shot',
   '164': 'T20, T18, Bull or T19, T19, Bull',
   '165': 'No out shot',
   '166': 'No out shot',
   '167': 'T20, T19, Bull',
   '168': 'No out shot',
   '169': 'No out shot',
   '170': 'T20, T20, Bull'
}

//Converting values into array
const checkoutArray = Object.values(checkoutMap)


// CHECK FUNCTIONS IN ORDER TO MAKE SURE KEY = VALUE:
// function parseAndCalculate(scoreString) {
//    if (scoreString === 'No out shot') {
//       return ['No out shot']
//    }

//    const options = scoreString.split('or').map(option => option.trim())
//    let possibleScores = []

//    for (let option of options) {
//       const throws = option.split(',').map(throwPart => throwPart.trim())
//       let totalScore = 0

//       for (let throwPart of throws) {
//          let multiplier = 1
//          if (throwPart.startsWith('T')) {
//             multiplier = 3
//             throwPart = throwPart.slice(1)
//          } else if (throwPart.startsWith('D')) {
//             multiplier = 2
//             throwPart = throwPart.slice(1)
//          }
      
//          const value = throwPart === 'Bull' ? 50 : throwPart === 'Outer' ? 25 : parseInt(throwPart, 10)
//          totalScore += value * multiplier
//       }

//       possibleScores.push(totalScore)
//    }

//    return possibleScores
// }

// function checkCheckoutMap(checkoutMap) {
//    for (const [key, value] of Object.entries(checkoutMap)) {
//       if (value === 'No out shot') {
//          console.log(`Match for ${key}: No out shot`)
//          continue
//       }

//       const calculatedScores = parseAndCalculate(value)
//       const targetScore = parseInt(key, 10)

//       if (calculatedScores.includes(targetScore)) {
//          console.log(`Match for ${key}: Calculated scores ${calculatedScores.join(' or ')}`)
//       } else {
//          console.log(`Mismatch for ${key}: Expected ${targetScore}, Calculated scores ${calculatedScores.join(' or ')}`)
//       }
//    }
// }

// checkCheckoutMap(checkoutMap)

export default checkoutArray