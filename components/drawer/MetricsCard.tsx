'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsCardProps {
  total?: number;
  className?: string;
  title?: string;
  changePercent?: number;
  showChange?: boolean;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  total = 0,
  className = '',
  title = 'Total Orders',
  changePercent = 12,
  showChange = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        'overflow-hidden p-4 bg-white transition-shadow duration-300 border border-border/40 backdrop-blur ',
        isHovered ? 'shadow-md' : 'shadow-sm',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className={`flex items-end ${showChange ? 'justify-between' : 'justify-end'} gap-2`}>
          {
            showChange && (
              <div
            className={cn(
              'flex items-center text-sm font-medium rounded px-1.5 py-0.5 transition-all duration-300',
              changePercent > 0
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30'
                : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-1'
            )}
          >
            {changePercent > 0 ? (
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
            )}
            <span>{changePercent}%</span>
          </div>
            )
          }


          <div className="text-3xl font-bold tracking-tight text-foreground">
            {total.toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
