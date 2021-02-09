import { AbsoluteDomain, RelativeDomain } from 'data/Types/Domain';
import { collate as collateLogs, evict as evictLogs, LogSeries } from 'data/Types/LogSeries';
import { collate as collateMetrics, evict as evictMetrics, MetricSeries } from 'data/Types/MetricSeries';

import { Collection } from './Collection';
import { Domain } from './Domain';
import { Selection } from './Selection';

export class Region {
    constructor(initialDomain?: AbsoluteDomain | RelativeDomain) {
        this.domain = new Domain(initialDomain);
        this.selection = new Selection();

        this.metrics = new Collection(this.domain, collateMetrics, evictMetrics);
        this.logs = new Collection(this.domain, collateLogs, evictLogs);
    }

    readonly domain: Domain;
    readonly selection: Selection;

    readonly metrics: Collection<number, MetricSeries>;
    readonly logs: Collection<string, LogSeries>;
}
