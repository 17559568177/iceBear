import React, { forwardRef, useImperativeHandle } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';


type CustomButtonProps = {
    title: string;
    url: string;
    background?: string;
    img?: string;
    showimg?: boolean;
};



const CustomButton = forwardRef((props: CustomButtonProps, ref) => {

    const parameter = {
        background: props.background || '#ffff',
        img: props.img || "src/assets/imgs/myagent/redo.svg",
        showimg: true
    }

    const navigate = useNavigate();

    return <Button style={{ display: 'flex', alignItems: 'center', fontSize: '14px', padding: '13px', background: parameter.background }}
        onClick={() => {
            navigate(props.url)
        }}>
        <img src={parameter.img} alt="" />&nbsp;{props.title}
    </Button>
});



export default CustomButton;