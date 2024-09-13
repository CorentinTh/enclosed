<script setup>
const credentials = defineModel({
    default: () => [
        {
            email: '',
            password: ''
        }
    ]
})

function addCredential() {
    credentials.value = [
        ...credentials.value,
        {
            email: '',
            password: ''
        }
    ]
}

function removeCredential(index) {
    credentials.value = credentials.value.filter((_, i) => i !== index)
}

</script>

<template>

    <div class="container">
        <div v-for="(credential, index) in credentials" :key="index" class="row-container">
            <input class="input" v-model="credential.email" type="text" placeholder="Email" />
            <input class="input" v-model="credential.password" type="password" placeholder="Password" />
            <button class="btn" @click="removeCredential(index)" :disabled="credentials.length <= 1">Remove</button>
        </div>
        <button class="btn" @click="addCredential">
            + Add credential
        </button>
    </div>
</template>

<style scoped lang="less">

.container {
    margin: 40px 0;
}

.row-container {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}

.input {
    flex: 1;
    padding: 5px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;

    &:focus {
        outline: none;
        border-color: #000;
    }
}

.btn {
    padding: 5px 14px;
    background-color: var(--vp-input-switch-bg-color);
    border-radius: 5px;
    font-weight: 500;


    &:hover {
      border-color: #000;
    }

    &:focus {
        outline: none;
        border-color: #000;
    }

    &:disabled {
        opacity: 0.5;
    }

    &.btn-primary {
        background-color: #000;
        color: #fff;
    }
}
</style>