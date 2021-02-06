import React from 'react';

import { DataSetContext } from './DataSet.context'
import { DataSetProps } from './DataSet.props'

export const DataSet = (props: DataSetProps): JSX.Element => {
    return (
        <DataSetContext.Provider value={[props.name, props.labels ?? {}]}>
            { props.children }
        </DataSetContext.Provider>
    );
};
