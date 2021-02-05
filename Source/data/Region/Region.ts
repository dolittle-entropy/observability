import { AbsoluteDomain, RelativeDomain } from 'Types/Domain';
import { collate as collateLogs, LogSeries } from 'Types/LogSeries';
import { collate as collateMetrics, MetricSeries } from 'Types/MetricSeries';

import { Collection } from './Collection';
import { Domain } from './Domain';
import { Selection } from './Selection';

export class Region {
    constructor(initialDomain?: AbsoluteDomain | RelativeDomain) {
        this.domain = new Domain(initialDomain);
        this.selection = new Selection();

        this.metrics = new Collection(this.domain, collateMetrics);
        this.logs = new Collection(this.domain, collateLogs);
    }

    readonly domain: Domain;
    readonly selection: Selection;

    readonly metrics: Collection<number, MetricSeries>;
    readonly logs: Collection<string, LogSeries>;
}
