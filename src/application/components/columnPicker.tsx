import {
    ControlGroup,
    FormGroup,
    InputGroup,
    Switch
} from '@blueprintjs/core'
import * as React from 'react'

import StringSelect from './selects/stringSelect'
import {
    IDatabaseColumn,
    IDatabaseSchema,
} from '../types'

export interface IColumnPickerProps {
    onChangeOwner: any,
    onChangeTable: any,
    onChangeColumn: any,
    databaseColumn: IDatabaseColumn,
    databaseSchema: IDatabaseSchema,
    dispatch?: any,
    label?: string,
    vertical?: boolean,
}

export interface IColumnPickerState {

}

export default class ColumnPicker extends React.Component<IColumnPickerProps, IColumnPickerState> {
    public render() {
        let {
            onChangeOwner,
            onChangeTable,
            onChangeColumn,
            databaseColumn,
            databaseSchema,
            dispatch,
            label,
            vertical,
        } = this.props

        let owners = Object.keys(databaseSchema)

        let tables = (databaseColumn && databaseColumn.owner) ?
            Object.keys(databaseSchema[databaseColumn.owner]) :
            []

        let columns = (databaseColumn && databaseColumn.table) ?
            databaseSchema[databaseColumn.owner][databaseColumn.table] :
            []

        let controlGroup = <ControlGroup fill={false} vertical={vertical || false}>
            <StringSelect
                inputItem={databaseColumn ? databaseColumn.owner : null}
                items={owners}
                icon={'group-objects'}
                onChange={onChangeOwner}
                dispatch={dispatch}
            />
            <StringSelect
                inputItem={databaseColumn ? databaseColumn.table : null}
                items={tables}
                icon={'th'}
                onChange={onChangeTable}
                dispatch={dispatch}
            />
            <StringSelect
                inputItem={databaseColumn ? databaseColumn.column : null}
                items={columns}
                icon={'column-layout'}
                onChange={onChangeColumn}
                dispatch={dispatch}
            />
        </ControlGroup>

        return label ?
            <FormGroup
                label={label}
                labelFor="text-input"
                inline={true}
            >
                {controlGroup}
            </FormGroup> :
            controlGroup
    }
}
