type PipelineStep<Input, Output> = (data: Input) => Output | Promise<Output>;

export class DataPipeline<Input, Output> {
  private steps: PipelineStep<unknown, unknown>[] = [];

  addStep<NextOutput>(
    step: PipelineStep<Output extends Promise<infer T> ? T : Output, NextOutput>
  ): DataPipeline<Input, NextOutput> {
    this.steps.push(step as PipelineStep<unknown, unknown>);
    return this as unknown as DataPipeline<Input, NextOutput>;
  }

  async execute(input: Input): Promise<Output> {
    let result: unknown = input;
    for (const step of this.steps) {
      result = await step(result);
    }
    return result as Output;
  }

  static create<T>(): DataPipeline<T, T> {
    return new DataPipeline<T, T>();
  }
}

export const createTransformPipeline = <T>() => {
  return DataPipeline.create<T>();
};

export const filterData = <T>(predicate: (item: T) => boolean) => {
  return (data: T[]): T[] => data.filter(predicate);
};

export const mapData = <T, U>(mapper: (item: T) => U) => {
  return (data: T[]): U[] => data.map(mapper);
};

export const sortData = <T>(compareFn: (a: T, b: T) => number) => {
  return (data: T[]): T[] => [...data].sort(compareFn);
};

export const groupData = <T, K extends string | number>(
  keySelector: (item: T) => K
) => {
  return (data: T[]): Record<K, T[]> => {
    const groups = {} as Record<K, T[]>;
    data.forEach((item) => {
      const key = keySelector(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    return groups;
  };
};

export const aggregateData = <T, U>(
  reducer: (acc: U, item: T) => U,
  initialValue: U
) => {
  return (data: T[]): U => {
    return data.reduce(reducer, initialValue);
  };
};

export const deduplicateData = <T>(keySelector?: (item: T) => unknown) => {
  return (data: T[]): T[] => {
    if (!keySelector) {
      return Array.from(new Set(data));
    }
    const seen = new Set();
    return data.filter((item) => {
      const key = keySelector(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };
};

export const limitData = <T>(limit: number) => {
  return (data: T[]): T[] => data.slice(0, limit);
};

export const skipData = <T>(skip: number) => {
  return (data: T[]): T[] => data.slice(skip);
};

export const paginateData = <T>(page: number, pageSize: number) => {
  return (data: T[]): T[] => {
    const skip = (page - 1) * pageSize;
    return data.slice(skip, skip + pageSize);
  };
};

