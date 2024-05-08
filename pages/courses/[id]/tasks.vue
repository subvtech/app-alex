<script setup lang="ts">
// const { t } = useI18n();
const headerStore = usePageHeaderStore();

// const isOpen = ref(false);

definePageMeta({ middleware: 'auth' });

onBeforeMount(() => {
  headerStore.showHeader = true;
});
</script>

<template>
  <div class="bg-white p-4 rounded">
    <div
      class="mx-auto max-w-4xl p-6 bg-white dark:bg-black rounded-lg shadow-md"
    >
      <div class="border-b dark:border-gray-700 pb-6 mb-6">
        <div class="flex items-center space-x-4">
          <Avatar class="w-28 h-28 rounded-full shadow-lg">
            <AvatarImage src="/placeholder.svg" alt="user profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div class="flex-grow">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
              Chris Norman
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">@chrisnorman</p>
          </div>
          <Button variant="ghost">
            <Edit2 class="w-5 h-5 text-blue-500" />
          </Button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div class="flex items-center space-x-2 mb-3">
            <User class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
              Overview
            </h3>
          </div>
          <div class="space-y-3">
            <div>
              <label
                class="text-sm font-semibold text-gray-600 dark:text-gray-400"
                for="jobTitle"
                >Job Title</label
              >
              <Input
                id="jobTitle"
                disabled
                value="Product Designer"
                class="mt-1 w-full"
              />
            </div>
            <div>
              <label
                class="text-sm font-semibold text-gray-600 dark:text-gray-400"
                for="company"
                >Company</label
              >
              <Input
                id="company"
                disabled
                value="Airbnb, Inc."
                class="mt-1 w-full"
              />
            </div>
            <div>
              <label
                class="text-sm font-semibold text-gray-600 dark:text-gray-400"
                for="location"
                >Location</label
              >
              <Input
                id="location"
                disabled
                value="San Francisco, CA"
                class="mt-1 w-full"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="flex items-center space-x-2 mb-3">
            <Mail class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
              Contact Info
            </h3>
          </div>
          <div class="space-y-3">
            <div>
              <label
                class="text-sm font-semibold text-gray-600 dark:text-gray-400"
                for="email"
                >Email</label
              >
              <Input
                id="email"
                disabled
                value="chrisnorman@example.com"
                class="mt-1 w-full"
              />
            </div>
            <div>
              <label
                class="text-sm font-semibold text-gray-600 dark:text-gray-400"
                for="phone"
                >Phone</label
              >
              <Input
                id="phone"
                disabled
                value="+1234567890"
                class="mt-1 w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6">
        <div class="flex items-center space-x-2 mb-3">
          <MapPin class="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            About Me
          </h3>
        </div>
        <Textarea
          disabled
          placeholder="A short bio goes here."
          class="w-full resize-none"
          rows="5"
        >
          I'm a product designer with a passion for user-centered design and
          making the web a better place.
        </Textarea>
      </div>
      <Button variant="secondary" class="w-full mt-6 py-2">Edit Profile</Button>
    </div>
  </div>
</template>
