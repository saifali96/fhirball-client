import {
    IDatabaseSchemas,
    ISimpleAction,
} from '../types'

const initialState: IDatabaseSchemas = {
    loadingDatabaseSchema: false,
    schemaByDatabaseName: {},
}

const databaseSchemas = (state = initialState, action: ISimpleAction): any => {
    switch (action.type) {
        // Cases handling fhir resource json fetching
        case 'LOADING_DATABASE_SCHEMA':
            return {
                ...state,
                loadingDatabaseSchema: true,
            }

        case 'FETCH_DATABASE_SCHEMA_SUCCESS':
            return {
                ...state,
                schemaByDatabaseName: {
                    ...state.schemaByDatabaseName,
                    [action.payload.databaseName]: {
                        ...action.payload.schema,
                    }
                },
                loadingDatabaseSchema: false,
            }

        case 'FETCH_DATABASE_SCHEMA_FAILURE':
            return {
                ...state,
                loadingDatabaseSchema: false,
            }

        default:
            return state
    }
}

export default databaseSchemas