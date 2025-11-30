import React from 'react';
import { usePageTitle } from './hooks/usePageTitle';


const FollowUs: React.FC = () => {
    usePageTitle('Follow Us');
    return (
        <div>
            <h1>Follow Us</h1>
        </div>
    );
};

export default FollowUs;