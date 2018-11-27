import {gql} from 'apollo-boost'
import {
    Button,
    Tag,
} from '@blueprintjs/core'
import * as React from 'react'
import {
    Mutation,
    Query,
    Subscription,
} from 'react-apollo'
import {connect} from 'react-redux'

// Import actions
import {
    changeDatabase,
    changeFhirResource,
    updateDatabase,
    updateFhirAttribute,
    updateFhirResource,
} from './actions'

import {
    fetchDatabaseNames,
} from '../../actions/databases'

import {
    fetchFhirResourceNames,
} from '../../actions/fhirResources'

// Import components
import FhirResourceTree from '../../components/fhirResourceTree'
import InputColumnsTable from '../../components/inputColumnsTable'
import StringSelect from '../../components/selects/stringSelect'

// Import types
import {
    IMappingExplorerViewState,
    IReduxStore,
} from '../../types'

import './style.less'

const mapReduxStateToReactProps = (state : IReduxStore): IMappingExplorerViewState => {
    return {
        ...state.views.mappingExplorer,
        data: state.data,
        dispatch: state.dispatch,
    }
}

const reduxify = (mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) : any => {
     return (target: any) => (
         connect(
             mapReduxStateToReactProps,
             mapDispatchToProps,
             mergeProps,
             options
         )(target) as any
     )
}

const getMappings = gql`
query Mapping($database: String!) {
    mapping (database: $database) {
        id
        database
        resources {
            id
            name
            primaryKey
        }
    }
}
`

const getInputColumns = gql`
query inputColumns($database: String!, $resource: String!, $attribute: String!) {
    mappings (where: {database: $database}) {
        id
        database
        resources (where: {name: $resource}) {
            id
            name
            attributes (where: {name: $attribute}) {
                id
                name
                inputColumns {
                    id
                    owner
                    table
                    column
                    script
                }
            }
        }
    }
}
`

const subscription = gql`
subscription subscribeToInputColumn($id: ID!) {
    inputColumnSubscription(id: $id) {
        updatedFields
        node {
            id
            owner
            column
            table
            script
        }
    }
}
`

const inputColumnMutation = gql`
mutation inputColumnMutation($id: ID!, $data: InputColumnUpdateInput) {
    updateInputColumn(id: $id, data: $data) {
        id
        owner
        column
        table
        script
    }
}
`

@reduxify(mapReduxStateToReactProps)
export default class MappingExplorerView extends React.Component<IMappingExplorerViewState, any> {
    public componentDidMount() {
        this.props.dispatch(fetchDatabaseNames('https://api.live.arkhn.org/schemas'))
        this.props.dispatch(fetchFhirResourceNames('https://api.live.arkhn.org/fhir_resources'))

        this.props.dispatch(updateDatabase('Crossway'))
        this.props.dispatch(changeFhirResource('Patient'))
        this.props.dispatch(updateFhirAttribute('name.given'))
    }

    public render = () => {
        const {
            data,
            dispatch,
            selectedDatabase,
            selectedFhirResource,
            selectedFhirAttribute,
        } = this.props

        return <div id='mapping-explorer-container'>
            <div id='left-part'>
                <div className={'panel-header'}>
                    <StringSelect
                        icon={'database'}
                        inputItem={selectedDatabase}
                        intent={'primary'}
                        items={Object.keys(data.databases.databaseNames)}
                        loading={data.databases.loadingDatabaseNames || data.databases.loadingDatabaseSchema}
                        onChange={(databaseName: string) => {
                            dispatch(changeDatabase(databaseName))
                        }}
                    />
                </div>

                <Query
                    query={getInputColumns}
                    variables={{
                        database: selectedDatabase,
                        resource: selectedFhirResource,
                        attribute: selectedFhirAttribute,
                    }}
                >
                    {({ loading, error, data }) => {
                        if (loading) {
                            return <p>Loading...</p>
                        }
                        if (error) {
                            console.log('Went through an error...')
                            console.log(error)
                            return <p>Something went wrong</p>
                        }

                        let inputColumns = []

                        try {
                            inputColumns = data.mappings[0].resources[0].attributes[0].inputColumns
                        }
                        catch (ex) {
                            console.log(ex)
                        }

                        return <div id='input-columns'>
                            <div id='input-column-rows'>
                                {inputColumns.map((inputColumn: any, index: number) => {
                                    return <Subscription
                                        key={index}
                                        subscription={subscription}
                                        variables={{
                                            id: inputColumn.id,
                                        }}
                                    >
                                        {({ data, loading }) => {
                                            const c = data ? data.inputColumnSubscription.node : inputColumn

                                            return <div className='input-column'>
                                                <Button
                                                    icon={'trash'}
                                                    minimal={true}
                                                />
                                                <div className='input-column-info'>
                                                    <div className='input-column-name'>
                                                        <Tag large={true}>{c.owner}</Tag>
                                                        <Tag large={true}>{c.table}</Tag>
                                                        <Tag large={true}>{c.column}</Tag>
                                                    </div>
                                                    <div className='input-column-join'>
                                                        Coucou
                                                    </div>
                                                    <div className='input-column-script'>
                                                        <Mutation
                                                            mutation={inputColumnMutation}
                                                        >
                                                            {(mutationName, {data, loading}) => {
                                                                return <StringSelect
                                                                    inputItem={c.script}
                                                                    items={['script1.py', 'script2.py']}
                                                                    loading={loading}
                                                                    onChange={(e: string) => {
                                                                        mutationName({
                                                                            variables: {
                                                                                id: c.id,
                                                                                data: {
                                                                                    script: e,
                                                                                },
                                                                            },
                                                                        })
                                                                    }}
                                                                />
                                                            }}
                                                        </Mutation>
                                                    </div>
                                                </div>
                                            </div>
                                        }}
                                    </Subscription>
                                })}
                            </div>
                            <div id='input-column-merging-script'>
                                <StringSelect
                                    icon={'layout-hierarchy'}
                                    inputItem={'mergingScript.py'}
                                    items={[]}
                                    loading={false}
                                    onChange={null}
                                />
                            </div>
                        </div>
                    }}
                </Query>
            </div>
            <div id='right-part'>
                <div className={'panel-header'}>
                    <StringSelect
                        icon={'layout-hierarchy'}
                        inputItem={selectedFhirResource}
                        intent={'primary'}
                        items={Object.keys(data.fhirResources.resourceNames)}
                        loading={data.fhirResources.loadingFhirResourceNames || data.fhirResources.loadingFhirResourceJson}
                        onChange={(resource: string) => {
                            dispatch(changeFhirResource(resource))
                        }}
                    />
                </div>
                <div id='fhir-resource-tree'>
                    <FhirResourceTree
                        json={
                            selectedFhirResource ?
                                data.fhirResources.jsonByResourceName[selectedFhirResource] :
                                null
                        }
                        onClickCallback={(attributeFlatPath: any) => {
                            dispatch(updateFhirAttribute(attributeFlatPath))
                        }}
                    />
                </div>
            </div>
        </div>
    }
}
