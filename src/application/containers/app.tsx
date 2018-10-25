import * as React from 'react'
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {Navbar, Button, Alignment, ControlGroup, FormGroup, MenuItem} from '@blueprintjs/core'
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";

import {
    appState,
    IFhirResource,
    IDatabase,
} from '../types'
import * as actions from '../actions'

import InputDatabaseSelect from '../components/selects/inputDatabaseSelect'
import FhirResourceSelect from '../components/selects/fhirResourceSelect'
import StringSelect from '../components/selects/stringSelect'
import FhirResourceTree from '../components/fhirResourceTree'

import {fhirResources, inputDatabases} from '../mockdata/mockData';

const mapReduxStateToReactProps = (state : appState): appState => {
    return state
}

function reduxify(mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) {
    return (target: any) => (connect(mapReduxStateToReactProps, mapDispatchToProps, mergeProps, options)(target) as any)
}

@reduxify(mapReduxStateToReactProps)
export class App extends React.Component<appState, any> {
    public render () {
        let {currentFhirResource, currentInputDatabase, dispatch} = this.props

        let currentOwners = Object.keys(currentInputDatabase.schema);

        let currentTables = currentFhirResource.owner ? Object.keys(
            currentInputDatabase.schema[currentFhirResource.owner]
        ) :
        [];

        let currentColumns = currentFhirResource.owner ? (
            currentFhirResource.table ?
            Object.keys(
                currentInputDatabase.schema[currentFhirResource.owner][currentFhirResource.table]
            ) :
            []
        ) :
        [];


        return (
            <div id='application'>
                <Navbar className={'bp3-dark'}>
                    <Navbar.Group align={Alignment.LEFT}>
                        <Navbar.Heading>
                            Fhirball
                        </Navbar.Heading>
                        <Navbar.Divider />
                        <FormGroup
                            label="Database"
                            labelFor="text-input"
                            inline={true}
                        >
                            <InputDatabaseSelect
                                inputItem={currentInputDatabase}
                                items={inputDatabases}
                                action={actions.changeCurrentInputDatabase}
                                dispatch={dispatch}
                            />
                        </FormGroup>
                        <Navbar.Divider />
                        <FormGroup
                            label="FHIR Resource"
                            labelFor="text-input"
                            inline={true}
                        >
                            <FhirResourceSelect
                                inputItem={currentFhirResource}
                                items={fhirResources}
                                action={actions.changeCurrentFhirResource}
                                dispatch={dispatch}
                            />
                        </FormGroup>
                        <Navbar.Divider />
                        <FormGroup
                            label="Path to Primary Key"
                            labelFor="text-input"
                            inline={true}
                        >
                            <ControlGroup fill={true} vertical={false}>
                                <StringSelect
                                    inputItem={currentFhirResource.owner}
                                    items={Object.keys(currentInputDatabase.schema)}
                                    action={actions.changeCurrentDBOwner}
                                    dispatch={dispatch}
                                />
                                <StringSelect
                                    inputItem={currentFhirResource.table}
                                    items={currentTables}
                                    action={actions.changeCurrentDBTable}
                                    dispatch={dispatch}
                                />
                                <StringSelect
                                    inputItem={currentFhirResource.primaryKey}
                                    items={currentColumns}
                                    action={actions.changeCurrentDBPrimaryKey}
                                    dispatch={dispatch}
                                />
                            </ControlGroup>
                        </FormGroup>
                    </Navbar.Group>
                </Navbar>

                <div id='left-panel'>
                    <FhirResourceTree
                        nodes={currentFhirResource ? currentFhirResource.content : null}
                        dispatch={dispatch}
                    />
                </div>
            </div>
        )
    }
}
