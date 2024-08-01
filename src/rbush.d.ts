declare module 'rbush' {
    export type BBox = [number, number, number, number];
  
    export default class RBush<T> {
      constructor();
      load(data: T[]): void;
      insert(item: T): void;
      remove(item: T): void;
      search(bbox: BBox): T[];
    }
  }
  