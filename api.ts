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
        const baseUrl = API_URL.replace('/v1', '');
        const token = getToken();
        // Construct custom fetch because api.post uses API_URL with /v1
        const response = await fetch(`${baseUrl}/checkin/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(answers),
        });
        if (!response.ok) throw new Error('Check-In Failed');
        return response.json();
    },

    getCheckInStatus: async () => {
        return api.get('/checkin/today');
    },

    // Affective Engine
    analyzeAffective: async (answers: number[]) => {
        const token = getToken();
        // Note: The affective router was mounted at /api/affective, NOT /api/v1/affective
        // So we construct the URL manually or adjust the prefix. 
        // Let's assume consistent prefixing: I mounted it at /api/affective in main.py.
        // The API_URL is http://localhost:8000/api/v1
        // So we need to strip 'v1' or just use absolute path.
        const baseUrl = API_URL.replace('/v1', '');

        const response = await fetch(`${baseUrl}/affective/analyze/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ answers }),
        });
        if (!response.ok) throw new Error('Analysis Failed');
        return response.json();
    }
};
