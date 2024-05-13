/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef, HTMLAttributes } from 'react';

import ReactMarkdown from 'react-markdown';

import RehypeKatex from 'rehype-katex';
import RemarkBreaks from 'remark-breaks';
import RemarkGfm from 'remark-gfm';
import RemarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import { copyToClipboard } from '../hooks/copyToClipboard';
import { Button, message } from 'antd';

// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// @ts-ignore
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '@/assets/style/github-markdown-light.css';
import style from './index.module.less';
import { CopyOutlined } from '@ant-design/icons';

function cleanCode(code: string | null) {
    const regex = /^(?:\w+\d+)?\d*\s*/gm;

    return code?.replace(regex, '');
}

export const PreCode: React.FC<HTMLAttributes<HTMLPreElement>> = props => {
    const ref = useRef<HTMLPreElement>(null);

    return (
        <pre ref={ref} className={style.mdCopy}>
            <Button
                title="复制"
                onClick={() => {
                    if (ref.current) {
                        const code = ref.current.textContent;
                        copyToClipboard(cleanCode(code) || '');
                        message.success('已复制到剪贴板');
                    }
                }}
            >
                <CopyOutlined />
            </Button>
            {props.children}
        </pre>
    );
};

export function Markdown(props: { content: string }) {
    return (
        <div className={style.gptmarkdown}>
            <ReactMarkdown
                className="markdown-body"
                children={props.content}
                remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
                rehypePlugins={[rehypeRaw, RehypeKatex]}
                // components={{ pre: PreCode }}
                components={{
                    // @ts-ignore
                    code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');

                        return !inline && match ? (
                            <>
                                <span className="language">{match[1]}</span>
                                <SyntaxHighlighter
                                    children={String(children).replace(/\n$/, '')}
                                    style={prism}
                                    language={match[1]}
                                    PreTag="div"
                                    showLineNumbers={true}
                                    wrapLongLines={true}
                                    {...props}
                                />
                            </>
                        ) : (
                            <code className={className} {...props} children={children} />
                        );
                    },
                    // @ts-ignore
                    inlineCode({ value }: { value: unknown }) {
                        return (
                            <SyntaxHighlighter
                                style={prism}
                                language="plaintext"
                                children={value}
                                customStyle={{ display: 'inline', padding: '0.2em' }}
                            />
                        );
                    },
                    // @ts-ignore
                    pre: PreCode
                }}
            ></ReactMarkdown>
        </div>
    );
}
