const API_URL = 'http://localhost:8000/api/v1';

// Ideally, handle auth token storage/retrieval here. 
// For now we assume a hardcoded token or simple open endpoints if we relax auth for demo.
// But we implemented auth, so we need a token.
// Let's create a Helper that tries to get token from localStorage.

const getToken = () => localStorage.getItem('token');

export const api = {
    get: async (endpoint: string) => {
        const token = getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Handle unauthorized
                console.error("Unauthorized access");
            }
            throw new Error(`API call failed: ${response.statusText}`);
        }
        return response.json();
    },

    post: async (endpoint: string, data: any) => {
        const token = getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }
        return response.json();
    },

    put: async (endpoint: string, data: any) => {
        const token = getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }
        return response.json();
    },

    login: async (username: string, password: string) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_URL}/auth/token`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        return data;
    },

    getProfile: async () => {
        return api.get('/users/me');
    },

    updateProfile: async (data: any) => {
        return api.put('/users/me', data);
    },

    // Journal
    getJournalEntries: async () => {
        return api.get('/journal/');
    },

    createJournalEntry: async (entry: { mood: string, content: string, title?: string }) => {
        return api.post('/journal/', entry);
    },

    // Chat
    sendChatMessage: async (message: string) => {
        return api.post('/chat/message', { message });
    },

    // Risk
    getRiskInsights: async () => {
        return api.get('/insights/risk');
    },

    // Check-In
    submitCheckIn: async (answers: Record<string, number>) => {
        return api.post('/checkin/', answers);
    },

    getCheckInStatus: async () => {
        return api.get('/checkin/today');
    },

    // Affective Engine
    analyzeAffective: async (answers: number[]) => {
        return api.post('/affective/analyze/questions', { answers });
    }
};
