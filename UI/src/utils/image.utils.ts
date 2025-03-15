import { environment } from '../environments/environment.dev';

export const getImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return '';
    
    // If the URL is already absolute (starts with http:// or https://)
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    // Remove /api from BE_APP_BASE_URL since image URLs are served from root
    const baseUrl = environment.BE_APP_BASE_URL.replace('/api', '');
    return `${baseUrl}${imageUrl}`;
};
