<script setup lang="ts">
import { useCounterStore } from "@/stores/counter";
const store = useCounterStore();
</script>

<template>
    <n-card title="useCounterStore">
        {{ store.count }} * 2 = {{ store.doubleCount }}
        <template #action>
            <n-button @click="store.increment">plus</n-button>
        </template>
    </n-card>
</template>
