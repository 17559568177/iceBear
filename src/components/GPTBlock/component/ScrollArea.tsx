import React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import style from './index.module.less';
const ScrollArea = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
    <ScrollAreaPrimitive.Root ref={ref} className={`${style.scrollArea} ${className}`} {...props}>
        <ScrollAreaPrimitive.Viewport className={style.scrollViewport}>{children}</ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
));

const ScrollBar = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
        ref={ref}
        orientation={orientation}
        // className={cn(
        //     'flex touch-none select-none transition-colors',
        //     orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
        //     orientation === 'horizontal' && 'h-2.5 border-t border-t-transparent p-[1px]',
        //     className
        // )}
        className={`${style.scrollBar} ${className}`}
        {...props}
    >
        <ScrollAreaPrimitive.ScrollAreaThumb className={style.scrollBar} />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
));

export { ScrollArea, ScrollBar };
