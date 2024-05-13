import style from './index.module.less';
import { CopyOutlined, FrownFilled, FrownOutlined, SmileFilled, SmileOutlined } from '@ant-design/icons';

const ISmileOutlined = ({ onClick }: { onClick: () => void }) => {
    return <SmileOutlined className={style.iconNormal} onClick={onClick} />;
};
const ISmileFilled = ({ onClick }: { onClick: () => void }) => {
    return <SmileFilled className={style.iconFilled} onClick={onClick} />;
};
const IFrownOutlined = ({ onClick }: { onClick: () => void }) => {
    return <FrownOutlined className={style.iconNormal} onClick={onClick} />;
};
const IFrownFilled = ({ onClick }: { onClick: () => void }) => {
    return <FrownFilled className={style.iconFilled} onClick={onClick} />;
};
const ICopyOutlined = ({ onClick }: { onClick: () => void }) => {
    return <CopyOutlined className={style.iconNormal} onClick={onClick} />;
};

export { ISmileOutlined, ISmileFilled, IFrownOutlined, IFrownFilled, ICopyOutlined };
