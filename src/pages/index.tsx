import ILayout from '@/components/Layout';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const nav = useNavigate();
    useEffect(() => {
        nav('/assistant');
    }, []);
    return <ILayout />;
};

export default Dashboard;
