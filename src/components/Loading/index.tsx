import { Spin } from 'antd';

const Loading: React.FC = () => (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin />
    </div>
);
export default Loading;
