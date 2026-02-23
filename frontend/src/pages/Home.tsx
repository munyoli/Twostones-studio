import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL } from '../services/api';
import LandingTemplate from '../templates/LandingTemplate';

interface ManukatoItem {
    id: number;
    brandName: string;
    imagePath: string;
}

const Home = () => {
    const { data: items, isLoading } = useQuery({
        queryKey: ['manukato-items-home'],
        queryFn: async () => {
            const response = await axios.get(`${BASE_URL}/api/collection/manukato`);
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
