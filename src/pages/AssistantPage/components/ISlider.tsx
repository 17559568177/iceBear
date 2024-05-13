import { Col, InputNumber, Row, Slider } from 'antd';
import { forwardRef, memo, useImperativeHandle, useState } from 'react';

type ISliderProps = {
    range: [min: number, max: number];
    initValue: number;
    onChangeComplete?: (value: number) => void;
};
interface ISliderRef {
    getValue: () => number | null;
}

const ISlider: React.FC<ISliderProps & React.RefAttributes<ISliderRef>> = memo(
    forwardRef<ISliderRef, ISliderProps>((props, ref) => {
        const [inputValue, setInputValue] = useState<number | null>(props.initValue);

        const onChange = (newValue: number | null) => {
            setInputValue(newValue);
        };

        const onChangeComplete = (newValue: number) => {
            props.onChangeComplete?.(newValue!);
        };
        useImperativeHandle(ref, () => ({
            getValue: () => inputValue
        }));
        return (
            <Row>
                <Col span={12}>
                    <InputNumber
                        min={props.range[0]}
                        max={props.range[1]}
                        style={{ margin: 0 }}
                        step={0.01}
                        value={inputValue}
                        onChange={onChange}
                    />
                </Col>
                <Col span={10}>
                    <Slider
                        min={props.range[0]}
                        max={props.range[1]}
                        onChangeComplete={onChangeComplete}
                        onChange={onChange}
                        value={typeof inputValue === 'number' ? inputValue : 0}
                        step={0.01}
                    />
                </Col>
            </Row>
        );
    })
);

export default ISlider;
