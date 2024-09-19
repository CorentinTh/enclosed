<script setup>
import CredentialInputs from '../components/credential-inputs.vue'
import Toggle from '../components/toggle.vue'
import { ref, computed, watch } from 'vue'
import bcrypt from 'bcryptjs'

const credentials = ref([
    { email: '', password: '' },
])

const shouldEscapeWithDollar = ref(false)
const shouldEscapeWithBackslash = ref(false)

const envValue = computed(() => {
    return credentials.value
    .filter(({ email, password }) => email && password)
    .map(({ email, password }) => {

        const hashedPassword = bcrypt.hashSync(password, 10)
        const escapedPassword = shouldEscapeWithDollar.value
            ? hashedPassword.split('$').join('$$')
            : shouldEscapeWithBackslash.value
                ? hashedPassword.split('$').join('\\$')
                : hashedPassword

        return `${email}:${escapedPassword}`

    }).join(',')
})

watch(shouldEscapeWithDollar, () => {
    if (shouldEscapeWithDollar.value) {
        shouldEscapeWithBackslash.value = false
    }
})

watch(shouldEscapeWithBackslash, () => {
    if (shouldEscapeWithBackslash.value) {
        shouldEscapeWithDollar.value = false
    }
})
</script>

# User Authentication Key Generator

This tool generates the value for the `AUTHENTICATION_USERS` environment variable. This variable is used to define the users that can authenticate to the application. The value should be a comma-separated list of email and password pairs, where the password is hashed using bcrypt.

<CredentialInputs v-model="credentials" />

```txt-vue
AUTHENTICATION_USERS={{ envValue }}
```

<Toggle v-model="shouldEscapeWithDollar">
    Escape for Docker Compose (use <code>$$</code> instead of <code>$</code>)
</Toggle>

<Toggle v-model="shouldEscapeWithBackslash">
    Escape for Docker Run (use <code>\$</code> instead of <code>$</code>)
</Toggle>

---

> [!INFO] Escaping in Docker Run
> When using env variables in docker run command with `-e` on bash, the `$` character should be escaped in the password hash. For example, `\$2a\$10\$...`.

> [!INFO] Escaping in Docker Compose
> When using env variables in docker-compose, the `$` character should be escaped with another `$`. For example, `$$2a$$10$$...`.
