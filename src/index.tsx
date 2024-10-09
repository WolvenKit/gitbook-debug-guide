import {
  createIntegration,
  createComponent,
  FetchEventCallback,
  RuntimeContext,
} from "@gitbook/runtime";
import YAML from "yaml";

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
type IntegrationBlockState = { content: string; currentStep: string };
type IntegrationAction = { action: "click"; step: string };

const handleFetchEvent: FetchEventCallback<IntegrationContext> = async (
  request,
  context
) => {
  const { api } = context;
  const user = api.user.getAuthenticatedUser();

  return new Response(JSON.stringify(user));
};

const guideBlock = createComponent<
  IntegrationBlockProps,
  IntegrationBlockState,
  IntegrationAction,
  IntegrationContext
>({
  componentId: "debugguide",
  initialState: (props) => {
    return {
      content: props.content || defaultContent,
      currentStep: "start",
    };
  },
  action: async (element, action, context) => {
    switch (action.action) {
      case "click":
        return { state: { ...element.state, currentStep: action.step } };
    }
  },
  render: async (element, { environment }) => {
    if (element.context.type !== "document") {
      throw new Error("Invalid context");
    }
    const { context, state } = element;
    const { editable } = context;
    let parsedContent;

    try {
      parsedContent = JSON.parse(state.content);
    } catch (e) {
      // TODO:
    }

    const step = parsedContent[state.currentStep];

    element.setCache({
      maxAge: 86400,
    });

    const output = (
      <box>
        <markdown content={"## " + step.title} />
        {step.buttons?.map((button) => (
          <button
            label={button.label}
            onPress={{
              action: "click",
              step: button.target,
            }}
          />
        ))}
      </box>
    );

    return (
      <block>
        {editable ? (
          <codeblock
            state="content"
            content={state.content}
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
});

export default createIntegration({
  fetch: handleFetchEvent,
  components: [guideBlock],
  events: {},
});
