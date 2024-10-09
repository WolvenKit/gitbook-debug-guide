import { createIntegration, createComponent, FetchEventCallback, RuntimeContext } from "@gitbook/runtime";

const defaultContent = `---
start:
  title: What platform do you have the game from? :cat_hmm2:
  options:
    - label: Steam
      target: success
    - label: GoG
      target: success
    - label: Not allowed to say
      target: pirate
    - label: Other
      target: pirate

success:
  title: Game is good, yay!

pirate:
  title: "?rule3"
`;

type IntegrationContext = {} & RuntimeContext;
type IntegrationBlockProps = { content: string };
type IntegrationBlockState = { content: string };
type IntegrationAction = { action: "click" };

const handleFetchEvent: FetchEventCallback<IntegrationContext> = async (request, context) => {
  const { api } = context;
  const user = api.user.getAuthenticatedUser();

  return new Response(JSON.stringify(user));
};

const guideBlock = createComponent<IntegrationBlockProps, IntegrationBlockState, IntegrationAction, IntegrationContext>(
  {
    componentId: "debugguide",
    initialState: (props) => {
      return {
        content: props.content || defaultContent,
      };
    },
    action: async (element, action, context) => {
      switch (action.action) {
        case "click":
          console.log("Button Clicked");
          return {};
      }
    },
    render: async (element, { environment }) => {
      if (element.context.type !== "document") {
        throw new Error("Invalid context");
      }
      const { editable } = element.context;
      const { content } = element.state;

      element.setCache({
        maxAge: 86400,
      });

      const output = <text>{element.state.content}</text>;

      return (
        <block>
          {editable ? (
            <codeblock
              state="content"
              content={content}
              syntax="yaml"
              onContentChange={{
                action: "@editor.node.updateProps",
                props: {
                  content: element.dynamicState("content"),
                },
              }}
              footer={[output]}
            />
          ) : (
            output
          )}
        </block>
      );
    },
  },
);

export default createIntegration({
  fetch: handleFetchEvent,
  components: [guideBlock],
  events: {},
});
