import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';
import LandingTemplate from '../templates/LandingTemplate';

const Home = () => {
    const { data: items } = useQuery({
        queryKey: ['manukato-items-home'],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/api/collection/manukato`);
            return response.data;
        }
    });

    // Pick 3 random images for the hero if available
    const heroImages = items && items.length > 0
        ? [...items].sort(() => 0.5 - Math.random()).slice(0, 3)
        : [];

    return <LandingTemplate heroImages={heroImages} />;
};

export default Home;
