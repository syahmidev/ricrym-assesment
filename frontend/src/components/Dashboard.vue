<template>
    <div class="container mx-auto px-4 py-6">
        <header class="bg-gray-800 text-white p-4 flex flex-wrap justify-between items-center mb-6 rounded-md">
            <h1 class="text-xl font-bold">WIRA Dashboard</h1>
            <div class="flex flex-wrap gap-4 mt-4 md:mt-0">
                <button
                    v-if="!is2FAEnabled"
                    @click="enable2FA"
                    class="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                    Enable 2FA
                </button>
                <button
                    v-if="is2FAEnabled"
                    disabled
                    class="inline-flex items-center py-2 rounded-md font-semibold text-sm text-green-600 uppercase tracking-widest transition ease-in-out duration-150"
                >
                    Sucessfully Enabled 2FA
                </button>
                <button
                    @click="logout"
                    class="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                    Logout
                </button>
            </div>
        </header>

        <div class="flex justify-start items-center">
            <input
                v-model="search"
                @input="fetchScores"
                type="text"
                class="border border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full px-3 py-2"
                placeholder="Search by username..."
            />
        </div>

        <div class="inline-block min-w-full py-2 align-middle">
            <table class="w-full divide-y divide-gray-300 mt-6">
                <thead>
                    <tr>
                        <th 
                            scope="col"
                            class="py-3 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            Username
                        </th>
                        <th 
                            scope="col"
                            class="py-3 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            Class
                        </th>
                        <th 
                            scope="col"
                            class="py-3 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            Reward Score
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                    <tr
                        v-for="(score) in scores"
                        :key="score.id"
                        class="even:bg-gray-50"
                    >
                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900">
                            {{ score.Character?.Account?.username || 'Unknown' }}
                        </td>
                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900">
                            {{ score.Character?.class_id || 'N/A' }}
                        </td>
                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900">
                            {{ score.reward_score || 0 }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex justify-center mt-6 gap-6">
            <button
                @click="prevPage"
                class="bg-gray-300 px-4 py-2 rounded-lg"
                :class="{ 'bg-gray-100': page === 1 }"
                :disabled="page === 1"
            >
                Previous
            </button>
            <span class="px-4 py-2">{{ page }}</span>
            <button
                @click="nextPage"
                class="bg-gray-300 px-4 py-2 rounded-lg"
                :class="{ 'bg-gray-100': page === totalPages }"
                :disabled="page === totalPages"
            >
                Next
            </button>
        </div>
    </div>
</template>

<script>
    import axios from '../axios';
    import VueJwtDecode from 'vue-jwt-decode'
    
    export default {
        data() {
            return {
                scores: [],
                totalPages: '',
                search: '',
                page: 1,
                limit: 10,
                is2FAEnabled: false,
            };
        },
        methods: {
            async fetchScores() {
                try {
                    const response = await axios.get('/scores', {
                        params: {
                            page: this.page,
                            limit: this.limit,
                            search: this.search,
                        },
                    });

                    // Ensure proper structure
                    this.scores = response.data.scores.map(score => ({
                        ...score,
                        Character: score.Character || { class_id: 'N/A', Account: { username: 'Unknown' } },
                    }));
                    this.totalPages = response.data.totalPages;
                } catch (error) {
                    console.error('Error fetching scores:', error);
                }
            },
            nextPage() {
                if (this.page < this.totalPages) {
                    this.page++;
                    this.fetchScores();
                }
            },
            prevPage() {
                if (this.page > 1) {
                    this.page--;
                    this.fetchScores();
                }
            },
            async check2FA() {
                try {
                    const response = await axios.post('/auth/check-2fa', { username: this.getCurrentUsername() });
                    this.is2FAEnabled = response.data; 
                } catch (error) {
                    console.error('Error checking 2FA:', error);
                }
            },
            enable2FA() {
                // Redirect to 2fa
                this.$router.push('enable-2fa');
            },
            logout() {
                localStorage.removeItem('token');
                // Redirect to login
                this.$router.push('/login');
            },
            getCurrentUsername() {
                const token = localStorage.getItem('token');
                if (!token) {
                    return null; // No token means no logged-in user
                }

                try {
                    const decoded = VueJwtDecode.decode(token);
                    return decoded.name; 
                } catch (error) {
                    console.error('Failed to verify token:', error);
                    return null;
                }
            }
        },
        mounted() {
            this.fetchScores(); 
            this.check2FA();
        },
    };
</script>