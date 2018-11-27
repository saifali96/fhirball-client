import {combineReducers} from 'redux'

import {appData} from './appData'
import {currentDatabase} from './currentDatabase'
import {currentFhirAttribute} from './currentFhirAttribute'
import {currentFhirResource} from './currentFhirResource'
import {mapping} from './mapping'
import {nameLists} from './nameLists'
import {mimic} from './mimic'

import mappingExplorer from '../views/mappingExplorer/reducer'

const dataReducer = combineReducers({
    mapping,
})

const viewReducer = combineReducers({
    mappingExplorer,
})
const mainReducer = combineReducers({
    data: dataReducer,
    views: viewReducer,
})

// const mainReducer = combineReducers({
//     currentDatabase,
//     currentFhirResource,
//     currentFhirAttribute,
//     mapping,
//     appData,
//     nameLists,
//     mimic,
// })

export default mainReducer
