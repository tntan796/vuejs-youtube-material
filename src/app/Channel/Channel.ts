import { GA } from "@/init/ga";
import Helmet from "@/app/shared/Helmet/Helmet.vue";
import { routes } from "./../../router/routeNames";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Location } from "vue-router";
import { youtubeService } from "@/services/youtube";
import FloatingDiv from "@/app/shared/FloatingDiv/FloatingDiv.vue";
import { LangKeys } from "@/translations";

type TabsListItem = {
  labelKey: string;
  icon: string;
  route: Location;
};
@Component({
  components: {
    FloatingDiv,
    Helmet
  },
  name: "Channel"
})
export default class Channel extends Vue {
  @Prop({ type: String, required: true })
  id!: string;

  channel: GoogleApiYouTubeChannelResource | null = null;

  $refs!: {
    tabBar: Vue;
  };

  get metaTitle() {
    if (this.channel) {
      let tabName =
        this.currentTab!.labelKey === "home"
          ? ""
          : `- ${this.$t(this.currentTab!.labelKey)}`;
      return `${this.channel.snippet.title} ${tabName}`;
    }
  }

  get metaDescription() {
    if (this.channel) {
      return this.channel.snippet.description.substr(0, 250);
    }
  }

  get metaImage() {
    return this.coverUrl;
  }

  get currentTab() {
    return this.tabs.find(i => i.route.name === this.$route.name);
  }

  get tabs(): TabsListItem[] {
    return [
      {
        labelKey: LangKeys.home,
        icon: "home",
        route: {
          name: routes.channel.children.home.name,
          params: {
            [routes.channel.params.id]: this.id
          }
        }
      },
      {
        labelKey: LangKeys.videos,
        icon: "video_library",
        route: {
          name: routes.channel.children.videos.name,
          params: {
            [routes.channel.params.id]: this.id
          }
        }
      },
      {
        labelKey: LangKeys.channels,
        icon: "tv",
        route: {
          name: routes.channel.children.channels.name,
          params: {
            [routes.channel.params.id]: this.id
          }
        }
      },
      {
        labelKey: LangKeys.about,
        icon: "info_outline",
        route: {
          name: routes.channel.children.about.name,
          params: {
            [routes.channel.params.id]: this.id
          }
        }
      }
    ];
  }

  get coverUrl() {
    if (this.channel) {
      if (this.$vuetify.breakpoint.smAndDown) {
        return this.channel.brandingSettings.image.bannerMobileImageUrl;
      } else if (this.$vuetify.breakpoint.lgAndDown) {
        return this.channel.brandingSettings.image.bannerTabletImageUrl;
      } else {
        return this.channel.brandingSettings.image.bannerTabletExtraHdImageUrl;
      }
    }
  }

  get coverAspect() {
    if (this.$vuetify.breakpoint.smAndDown) {
      return 640 / 175;
    } else if (this.$vuetify.breakpoint.lgAndDown) {
      return 1707 / 283;
    } else {
      return 2560 / 424;
    }
  }

  get title() {
    if (this.channel) {
      return this.channel.snippet.title;
    }
  }

  get thumbnail() {
    if (this.channel) {
      return this.channel.snippet.thumbnails.medium.url;
    }
  }

  get isTabTitleVisible() {
    return this.$vuetify.breakpoint.mdAndUp;
  }

  get stickyTabsClass() {
    if (this.$vuetify.breakpoint.xs) {
      return "sticky-mobile";
    } else if (this.$vuetify.breakpoint.smAndDown) {
      return "sticky-tab";
    } else {
      return "sticky-normal";
    }
  }

  @Watch("id", { immediate: true })
  getChannelInfo() {
    this.channel = null;
    youtubeService.getChannelDetails([this.id]).then(result => {
      this.channel = result.items[0];
    });
  }

  sendChannelTabGA(tab: string) {
    GA.sendGeneralEvent("engagement", "channel-page-tab-click", tab);
  }
}
