import {
    Button,
    ControlGroup,
} from '@blueprintjs/core'
import * as React from 'react'

// Import custom actions
import {
    changeInputColumnScript,
    changeJoinSourceColumn,
    changeJoinTargetColumnOwner,
    changeJoinTargetColumnTable,
    changeJoinTargetColumnColumn,
    changeMergingScript,
    clickRemoveInputColumn,
    clickRemoveJoin,
    clickAddJoin,
} from '../actions/mapping'

// Import custom components
import ColumnPicker from './columnPicker'
import StringSelect from './selects/stringSelect'

// Import custom types
import {
    IDatabaseSchema,
    IInputColumn,
    IFhirIntegrationSpec,
} from '../types'

// Import mock data
import {
    scriptList,
} from '../mockdata/nameLists'

export interface IInputColumnsTableProps {
    spec: IFhirIntegrationSpec;
    databaseSchema: IDatabaseSchema;
    dispatch: any;
}

export interface IInputColumnsTableState {

}

export default class InputColumnsTable extends React.Component<IInputColumnsTableProps, IInputColumnsTableState> {
    private handleRemoveColumnClick = (columnIndex: number) => {
        return (event: any) => {
            this.props.dispatch(clickRemoveInputColumn(columnIndex))
        }
    }

    private handleRemoveJoinClick = (columnIndex: number) => {
        return (event: any) => {
            this.props.dispatch(clickRemoveJoin(columnIndex))
        }
    }

    private handleAddJoinClick = (columnIndex: number) => {
        return (event: any) => {
            this.props.dispatch(clickAddJoin(columnIndex))
        }
    }

    public render() {
        let {
            spec,
            databaseSchema,
            dispatch,
        } = this.props;

        let rows = (spec && spec.inputColumns) ?
            spec.inputColumns.map((column: IInputColumn, index: number) =>
                <tr key={index}>
                    <td>
                        <Button
                            icon={'delete'}
                            minimal={true}
                            onClick={this.handleRemoveColumnClick(index)}
                        />
                    </td>
                    <td>{`${column.owner} > ${column.table} > ${column.column}`}</td>
                    {
                        column.join ?
                            <td>
                                <Button
                                    icon={'delete'}
                                    minimal={true}
                                    onClick={this.handleRemoveJoinClick(index)}
                                />
                            </td> :
                            <td colSpan={3}>
                                <Button
                                    icon={'add'}
                                    minimal={true}
                                    onClick={this.handleAddJoinClick(index)}
                                />
                            </td>
                    }
                    {
                        column.join ?
                            <td>
                                <StringSelect
                                    inputItem={column.join.sourceColumn}
                                    items={databaseSchema[column.owner][column.table]}
                                    icon={'column-layout'}
                                    action={changeJoinSourceColumn(index)}
                                    dispatch={dispatch}
                                />
                            </td> :
                            null
                    }
                    {
                        column.join ?
                            <td>
                                <ColumnPicker
                                    changeOwner={changeJoinTargetColumnOwner(index)}
                                    changeTable={changeJoinTargetColumnTable(index)}
                                    changeColumn={changeJoinTargetColumnColumn(index)}
                                    databaseColumn={column.join.targetColumn}
                                    databaseSchema={databaseSchema}
                                    dispatch={dispatch}
                                />
                            </td> :
                            null
                    }
                    <td>
                        <StringSelect
                            inputItem={column.script}
                            items={scriptList}
                            icon={'function'}
                            action={changeInputColumnScript(index)}
                            dispatch={dispatch}
                        />
                    </td>
                    {
                        spec.inputColumns.length > 1 ?
                            (
                                index == 0 ?
                                    <td rowSpan={spec.inputColumns.length}>
                                        <StringSelect
                                            inputItem={spec.mergingScript}
                                            items={scriptList}
                                            icon={'function'}
                                            action={changeMergingScript}
                                            dispatch={dispatch}
                                        />
                                    </td> :
                                    null
                            ) :
                            null
                    }
                </tr>) :
            []

        return (
            <div>
                <table className={'bp3-dark'}>
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Column Path</th>
                            <th colSpan={3}>Join</th>
                            <th>Column Script</th>
                            {(spec && spec.inputColumns.length> 1) ? <th>Final Script</th> : null}
                        </tr>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}
