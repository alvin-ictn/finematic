import React from 'react';
import { cn } from '@/lib/utils';

// Example component using the cn utility
function ExampleComponent({ className }: { className?: string }) {
  return (
    <div className={cn('default-class', className)}>
      This component uses the cn utility from lib/utils
    </div>
  );
}

export default ExampleComponent;
