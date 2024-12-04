<template>
    <div class="bg-gray-100 min-h-screen flex flex-col justify-center items-center pt-6 sm:pt-0">
        <div class="w-full sm:max-w-md px-6 overflow-hidden flex flex-col justify-center items-center">
            <div class="flex flex-col gap-3 items-center justify-center mt-6" v-if="qrCode">
                <h2>Scan this QR Code</h2>
                <img class="w-40" :src="qrCode" alt="2FA QR Code" />
                <p class="text-center">Or use this secret key: {{ secret }}</p>
            </div>

            <input 
                class="mt-6 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm block w-full px-3 py-2" 
                v-model="code" 
                placeholder="Enter 2FA Code" 
            />
            <button
                @click="verify2FA"
                class="mt-6 inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-base text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
                Verify
            </button>
            <p class="text-red-500 mt-4" v-if="message">{{ message }}</p>
        </div>
    </div>
</template>

<script>
    import axios from '../axios';
    import VueJwtDecode from 'vue-jwt-decode'
    
    export default {
        data() {
            return {
                qrCode: null,
                secret: null,
                code: '',
                message: '',
            };
        },
        methods: {
            async enable2FA() {
                try {
                    const response = await axios.post('/auth/enable-2fa', { username: this.getCurrentUsername() });
                    this.qrCode = response.data.qrCode;
                    this.secret = response.data.secret;
                } catch (error) {
                    console.error('Error enabling 2FA:', error);
                }
            },
            async verify2FA() {
                try {
                    const response = await axios.post('/auth/verify-2fa', { username: this.getCurrentUsername(), code: this.code, secret: this.secret });
                    this.$router.push('/');
                } catch (error) {
                    this.message = error.response.data.error || 'Verification failed';
                }
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
            this.enable2FA();
        }
    };
</script>