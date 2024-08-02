<script lang="ts" setup>
import { onMounted, shallowRef } from 'vue';
import { LIB_VERSION } from 'electric-sql/version';
import { uniqueTabId } from 'electric-sql/util';
import { ElectricDatabase, electrify } from 'electric-sql/wa-sqlite';
import { authToken } from './auth';
import { provideElectric } from './server/electric';
import { type Electric, schema } from './src/generated/client';

const electric = shallowRef<Electric>();

// yarn dev - port--3000

onMounted(async () => {
  const config = {
    url: import.meta.env.ELECTRIC_SERVICE,
  };

  const { tabId } = uniqueTabId();
  const scopedDbName = `basic-${LIB_VERSION}-${tabId}.db`;

  const conn = await ElectricDatabase.init(scopedDbName);
  const client = await electrify(conn, schema);
  await client.connect(authToken());

  // Resolves when the shape subscription has been established.
  const shape = await client.db.items.sync();

  // Resolves when the data has been synced into the local database.
  await shape.synced;
  electric.value = client;
});

provideElectric(electric);
</script>

<template>
  <div v-if="electric">
    <slot />
  </div>
</template>
