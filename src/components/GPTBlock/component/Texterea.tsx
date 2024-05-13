import TextArea, { TextAreaProps } from 'antd/es/input/TextArea';
import React from 'react';
import style from './index.module.less';
const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, ...props }, ref) => {
    return (
        <div className={`${className} ${style.itextArea}`}>
            <TextArea ref={ref} {...props} autoSize={{ minRows: 1, maxRows: 12 }} />
        </div>
    );
});
Textarea.displayName = 'Textarea';

export { Textarea };
