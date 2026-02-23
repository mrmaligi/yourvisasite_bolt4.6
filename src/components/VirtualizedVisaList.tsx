import { List } from 'react-window';
import { AutoSizer } from 'react-virtualized-auto-sizer';
import { InfiniteLoader as InfiniteLoaderBase } from 'react-window-infinite-loader';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardBody } from './ui/Card';
import { Badge } from './ui/Badge';
import { CardSkeleton } from './ui/Skeleton';
import type { Visa } from '../types/database';
import { CSSProperties } from 'react';

// Cast InfiniteLoader to any because types are broken in v2
const InfiniteLoader = InfiniteLoaderBase as any;

interface VirtualizedVisaListProps {
  visas: Visa[];
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  loadNextPage: () => void;
  className?: string;
}

interface ListChildComponentProps {
  index: number;
  style: CSSProperties;
  data?: any;
  isScrolling?: boolean;
}

const GUTTER_SIZE = 24; // gap-6 is 1.5rem = 24px
const ROW_HEIGHT = 280; // Estimated height for cards

export function VirtualizedVisaList({
  visas,
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  className = '',
}: VirtualizedVisaListProps) {
  return (
    <div className={`w-full h-full min-h-[500px] flex-1 ${className}`}>
      <AutoSizer renderProp={({ height, width }: { height: number | undefined; width: number | undefined }) => {
          if (width === undefined || height === undefined) return null;

          const columnCount = width < 640 ? 1 : width < 1024 ? 2 : 3;
          const columnWidth = (width - (columnCount - 1) * GUTTER_SIZE) / columnCount;

          const rowCount = Math.ceil(visas.length / columnCount) + (hasNextPage ? 1 : 0);

          const isRowLoaded = (index: number) => {
            if (!hasNextPage) return true;
            const lastRowIndex = Math.ceil(visas.length / columnCount);
            return index < lastRowIndex;
          };

          const loadMoreRows = async () => {
             if (isNextPageLoading) return;
             loadNextPage();
          };

          const Row = ({ index, style }: ListChildComponentProps) => {
            const startIndex = index * columnCount;
            // If it's the loading row
            if (!isRowLoaded(index)) {
               return (
                 <div style={style} className="flex gap-6">
                    {Array.from({ length: columnCount }).map((_, i) => (
                      <div key={i} style={{ width: columnWidth }}>
                        <CardSkeleton />
                      </div>
                    ))}
                 </div>
               );
            }

            const rowVisas = visas.slice(startIndex, startIndex + columnCount);

            return (
              <div style={style} className="flex gap-6">
                {rowVisas.map((visa) => (
                  <div key={visa.id} style={{ width: columnWidth, height: '100%' }}>
                     <Link to={`/visas/${visa.id}`} className="block h-full">
                        <Card hover className="h-full group">
                            <CardBody className="space-y-4 h-full flex flex-col">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2 flex-wrap">
                                <Badge>{visa.subclass}</Badge>
                                <Badge variant="primary">{visa.category}</Badge>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
                            </div>

                            <div className="flex-grow">
                                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                                    {visa.name}
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                    {visa.summary}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between text-sm mt-auto">
                                <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                                    {visa.cost_aud ? visa.cost_aud : 'Free / Varies'}
                                </span>
                                {visa.processing_time_range && (
                                    <span className="text-neutral-500 dark:text-neutral-400 truncate max-w-[50%] text-right">
                                        {visa.processing_time_range}
                                    </span>
                                )}
                            </div>
                            </CardBody>
                        </Card>
                    </Link>
                  </div>
                ))}
              </div>
            );
          };

          return (
            <InfiniteLoader
              isRowLoaded={isRowLoaded}
              rowCount={rowCount}
              loadMoreRows={loadMoreRows}
              threshold={2}
            >
              {({ onRowsRendered }: { onRowsRendered: any }) => (
                <List
                  // @ts-ignore
                  height={height}
                  // @ts-ignore
                  width={width}
                  rowCount={rowCount}
                  rowHeight={ROW_HEIGHT + GUTTER_SIZE}
                  onRowsRendered={onRowsRendered}
                  rowComponent={Row}
                />
              )}
            </InfiniteLoader>
          );
        }}
      />
    </div>
  );
}
