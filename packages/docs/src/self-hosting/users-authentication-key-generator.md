<script setup>
import CredentialInputs from '../components/credential-inputs.vue'
import { ref, computed } from 'vue'
import bcrypt from 'bcryptjs'

const credentials = ref([
    { email: '', password: '' },
])

const envValue = computed(() => {
    return credentials.value
    .filter(({ email, password }) => email && password)
    .map(({ email, password }) => [
        email,
        bcrypt.hashSync(password, 10)
    ].join(':')).join(',')
})

</script>

# User Authentication Key Generator

This tool generates the value for the `AUTHENTICATION_USERS` environment variable. This variable is used to define the users that can authenticate to the application. The value should be a comma-separated list of email and password pairs, where the password is hashed using bcrypt.

<CredentialInputs v-model="credentials" />


```txt-vue
AUTHENTICATION_USERS={{ envValue }}
```