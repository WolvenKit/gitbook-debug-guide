import { createIntegration, createComponent } from "@gitbook/runtime";

const guideBlock = createComponent({
  componentId: "debugguide",
  async render() {
    return (
      <block>
        <webframe
          source={{
            url: "https://wolvenkit.github.io/gitbook-debug-guide/",
          }}
          aspectRatio={16 / 9}
        />
      </block>
    );
  },
});

export default createIntegration({
  components: [guideBlock],
  events: {},
});
