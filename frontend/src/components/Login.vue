<template>
    <div class="bg-gray-100 min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
        <h1 class="text-3xl font-bold mb-6">Login</h1>
    
        <form class="w-full sm:max-w-md mt-6 px-6 py-4 overflow-hidden sm:rounded-lg" @submit.prevent="login">
            <div class="mb-4">
                <label class="block font-medium text-base text-gray-700">Username</label>
                <input
                    v-model="username"
                    type="text"
                    class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full px-3 py-2"
                    required
                />
            </div>
    
            <div class="mb-4">
                <label class="block font-medium text-base text-gray-700">Password</label>
                <input
                    v-model="password"
                    type="password"
                    class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full px-3 py-2"
                    required
                />
            </div>
    
            <div v-if="step === 2" class="mb-4">
                <label class="block font-medium text-base text-gray-700">2FA Code</label>
                <input
                    v-model="twoFactorCode"
                    type="text"
                    class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full px-3 py-2"
                    required
                />
            </div>
    
            <button
                type="submit"
                class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-base text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                {{ step === 1 ? 'Login' : 'Verify 2FA' }}
            </button>
        </form>
    
        <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    </div>
</template>

<script>
    import axios from '../axios';

    export default {
        data() {
            return {
                username: '',
                password: '',
                twoFactorCode: '',
                token: '',
                step: 1,
                error: '',
            };
        },
        methods: {
            async login() {
                try {
                    if (this.step === 1) {
                        const response = await axios.post('/auth/login', {
                            username: this.username,
                            password: this.password,
                        });

                        if (response.data.twoFactorRequired) {
                            // 2FA is required, go to step 2
                            this.step = 2;
                        } else {
                            // No 2FA required, log in user
                            localStorage.setItem('token', response.data.token);
                            this.$router.push('/'); // Redirect to dashboard
                        }
                    } else if (this.step === 2) {
                        // Step 2: Verify 2FA code
                        const response = await axios.post('/auth/verify-2fa', {
                            username: this.username,
                            code: this.twoFactorCode,
                        });

                        // Store token and redirect after successful 2FA
                        localStorage.setItem('token', response.data.token);
                        this.$router.push('/');
                    }
                } catch (error) {
                    this.error = error.response.data.error || 'An error occurred';
                }
            },
        },
    };
</script>