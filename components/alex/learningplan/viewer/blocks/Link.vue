<template>
  <v-card :href="linkBlock.link" target="_blank" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-overline mb-4">
          {{ linkBlock.meta.domain }}
        </div>
        <v-list-item-title class="text-h5 mb-1">
          {{ linkBlock.meta.title }}
          <v-btn
            v-if="!isDesktop"
            outlined
            rounded
            icon
            color="primary"
            title="Visualização limpa"
            @click.prevent="openArticleViewer"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            v-if="isDesktop && isDownloaded"
            outlined
            rounded
            icon
            color="primary"
            title="Download"
            @click.prevent="openFile(linkBlock.downloadedLink)"
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </v-list-item-title>
        <v-list-item-subtitle class="mb-2">
          {{ linkBlock.meta.description }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar
        v-if="linkBlock.meta.image"
        tile
        size="80"
        color="grey"
      >
        <v-img  :src="imageLink" />
      </v-list-item-avatar>
    </v-list-item>
    <article-viewer
      :ref="'articleViewer-' + linkBlock.id"
      :data-key="linkBlock.id"
      :url="linkBlock.link"
    />
  </v-card>
</template>

<script>

export default {
  props: {
    linkBlock: {
      type: Object,
      required: true,
    },
    isDesktop: {
      type: Boolean,
      default: false,
    },
    isDownloaded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    imageLink() {
      return (this.isDesktop && this.isDownloaded)
        ? `file://${this.linkBlock.meta.image ? this.linkBlock.meta.image.downloadedUrl : '' }`
        : this.linkBlock.meta.image.url
    },
  },
  methods: {
    openArticleViewer() {
      this.$refs[`articleViewer-${this.linkBlock.id}`].handleModal(true);
      this.$refs[`articleViewer-${this.linkBlock.id}`].parsePage();
    },
     openFile(url) {
      if (!this.isDesktop) {
        return;
      }

      window.openFile(url);
    },
  },
};
</script>

