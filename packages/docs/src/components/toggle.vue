<script setup>
const checked = defineModel({
  default: false,
});

function toggle() {
  checked.value = !checked.value;
}
</script>

<template>
  <div class="switch-wrapper">
    <div class="switch">
      <input :id="$.uid" v-model="checked" type="checkbox" class="checkbox">
      <div class="slider" @click="toggle" />
    </div>

    <label :id="$.uid" class="label" @click="toggle">
      <slot />
    </label>
  </div>
</template>

<style scoped lang="less">
.switch-wrapper {
  display: flex;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
  margin: 9px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--vp-custom-block-info-bg);
  -webkit-transition: .4s;
  transition: .4s cubic-bezier(0,1,0.5,1);
  border-radius: 4px;
  border-radius: 34px;

}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: var(--vp-c-bg);
  -webkit-transition: .4s;
  transition: .4s cubic-bezier(0,1,0.5,1);
  border-radius: 3px;
  border-radius: 50%;

}

input:checked + .slider {
  background-color: var(--vp-c-brand-1);
}

input:focus + .slider {
  box-shadow: 0 0 4px var(--vp-c-brand-1);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(22px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
