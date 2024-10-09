import {
  createIntegration,
  createComponent,
  FetchEventCallback,
  RuntimeContext,
} from "@gitbook/runtime";
import { Content, defaultContent, loadContent } from "./data";
import { createGuide } from "./guide";

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
  initialState(props) {
    return {
      content: props.content || defaultContent,
      currentStep: "start",
    };
  },
  async action(element, action) {
    switch (action.action) {
      case "click":
        return { state: { ...element.state, currentStep: action.step } };
    }
  },
  async render(element, { environment }) {
    if (element.context.type !== "document") {
      throw new Error("Invalid context");
    }
    const { context, state } = element;
    const { editable } = context;

    let parsedContent: Content | null = null;
    let error: string | null = null;

    const result = loadContent(state.content);
    if (typeof result === "string") {
      error = result;
    } else {
      parsedContent = result;
    }

    const step = parsedContent?.[state.currentStep];

    element.setCache({
      maxAge: 0,
    });

    /// EDITOR
    const getEditor = () => (
      <codeblock
        state="content"
        content={state.content}
        header={[<markdown content="## Debug Guide" />]}
        syntax="yaml"
        onContentChange={{
          action: "@editor.node.updateProps",
          props: {
            content: element.dynamicState("content"),
          },
        }}
        footer={[
          <divider />,
          error ? (
            <vstack align="center">
              <text style="code">{error}</text>
            </vstack>
          ) : (
            createGuide(step)
          ),
        ]}
      />
    );

    // FRONTEND

    // Make sure there is a way to get out of non-existing step (for whatever reason)
    const getGuide = () =>
      step ? (
        createGuide(step)
      ) : (
        <vstack>
          <markdown content="## An error has occurred, please press the button bellow." />
          <button
            label="Reset / Try again"
            onPress={{
              action: "click",
              step: "start",
            }}
          />
        </vstack>
      );

    const getFrontend = () =>
      error ? (
        // Don't show errors to users
        <markdown content="# Error!\nDebug Guide is misconfigured.\nPlease contact authors of this wiki!" />
      ) : (
        getGuide()
      );

    return <block>{editable ? getEditor() : getFrontend()}</block>;
  },
});

export default createIntegration({
  fetch: handleFetchEvent,
  components: [guideBlock],
  events: {},
});
