export const BASE_URL = 'https://quantum-save.up.railway.app/api/v1.0/';
const CLOUDINARY_CLOUD_NAME = 'dr3pehhi2';

export const API_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
};
