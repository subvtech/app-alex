declare namespace vis {
  class DataSet<T> {
    constructor(data: T[]);
  }

  class Timeline {
    constructor(
      container: HTMLElement,
      items: DataSet<TimelineItem>,
      groups: DataSet<TimelineGroup>,
      options: TimelineOptions,
    );

    on(event: string, callback: (event: any, properties?: any) => void): void;
    setOptions(options: Partial<TimelineOptions>): void;
    destroy(): void;
  }

  interface TimelineItem {
    id: string | number;
    group: string | number;
    content: string;
    start: string | Date;
    end?: string | Date;
    type?: 'box' | 'point' | 'range' | 'background';
    className?: string;
  }

  interface TimelineGroup {
    id: string | number;
    content: string;
    nestedGroups?: (string | number)[];
  }

  interface TimelineOptions {
    stack?: boolean;
    start?: string | Date;
    end?: string | Date;
    groupHeightMode?: 'auto' | 'fixed' | 'fitItems';
    editable?:
      | boolean
      | {
          add?: boolean;
          updateTime?: boolean;
          updateGroup?: boolean;
          remove?: boolean;
          overrideItems?: boolean;
        };
    margin?: {
      item?: number;
      axis?: number;
    };
    orientation?: 'top' | 'bottom';
    format?: {
      minorLabels?: {
        day?: string;
        month?: string;
      };
      majorLabels?: {
        day?: string;
        month?: string;
      };
    };
    height?: string | number;
    autoResize?: boolean;
    verticalScroll?: boolean;
    horizontalScroll?: boolean;
    zoomKey?: 'ctrlKey' | 'altKey' | 'metaKey';
    moveable?: boolean;
    zoomable?: boolean;
    maxHeight?: number;
    minHeight?: number;
    width?: string | number;
  }
}
