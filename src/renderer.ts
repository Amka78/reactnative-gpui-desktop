import Reconciler from 'react-reconciler';

// GPUI風の要素ノード
export interface GPUIViewNode {
  type: string;
  props: Record<string, any>;
  children: GPUIViewNode[];
  parent: GPUIViewNode | null;
}

function createNode(type: string, props: Record<string, any>): GPUIViewNode {
  return {
    type,
    props,
    children: [],
    parent: null,
  };
}

function appendChild(parent: GPUIViewNode, child: GPUIViewNode) {
  child.parent = parent;
  parent.children.push(child);
}

function removeChild(parent: GPUIViewNode, child: GPUIViewNode) {
  child.parent = null;
  const index = parent.children.indexOf(child);
  if (index !== -1) {
    parent.children.splice(index, 1);
  }
}

const hostConfig: Reconciler.HostConfig<
  string,
  Record<string, any>,
  GPUIViewNode,
  GPUIViewNode,
  GPUIViewNode,
  GPUIViewNode,
  GPUIViewNode,
  GPUIViewNode,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
> = {
  createInstance: createNode,
  createTextInstance: (text: string) => createNode('text', { content: text }),
  appendInitialChild: appendChild,
  appendChild,
  appendChildToContainer: appendChild,
  removeChild,
  removeChildFromContainer: removeChild,
  insertBefore: (parent: GPUIViewNode, child: GPUIViewNode, beforeChild: GPUIViewNode) => {
    child.parent = parent;
    const index = parent.children.indexOf(beforeChild);
    parent.children.splice(index, 0, child);
  },
  commitUpdate: (node: GPUIViewNode, type: string, prevProps: Record<string, any>, nextProps: Record<string, any>, internalHandle: any) => {
    node.props = nextProps;
  },
  commitTextUpdate: (node: GPUIViewNode, oldText: string, newText: string) => {
    node.props.content = newText;
  },
  supportsMutation: true,
  supportsPersistence: false,
  clearContainer: (container: GPUIViewNode) => {
    container.children.length = 0;
  },
  getRootHostContext: () => ({}),
  getChildHostContext: () => ({}),
  shouldSetTextContent: (_type: string, props: Record<string, any>) => {
    return typeof props.children === 'string' || typeof props.children === 'number';
  },
  getPublicInstance: (instance: GPUIViewNode) => instance,
  prepareForCommit: () => null,
  resetAfterCommit: () => {},
  preparePortalMount: () => {},
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  isPrimaryRenderer: true,
  getCurrentUpdatePriority: () => 0,
  getInstanceFromNode: () => null,
  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},
  prepareScopeUpdate: () => {},
  getInstanceFromScope: () => null,
  detachDeletedInstance: () => {},
  rendererVersion: '0.1.0',
  rendererPackageName: 'react-gpui-desktop',
  extraDevToolsConfig: null,
  bindToConsole: (methodName: string, context: any) => (console as any)[methodName].bind(console),
  requestPostPaintCallback: () => {},
  setCurrentUpdatePriority: () => {},
  resolveUpdatePriority: () => 0,
  shouldAttemptEagerTransition: () => false,
  trackSchedulerEvent: () => {},
  resolveEventType: () => '',
  resolveEventTimeStamp: () => 0,
  maySuspendCommit: () => false,
  preloadInstance: () => true,
  startSuspendingCommit: () => {},
  suspendInstance: () => {},
  waitForCommitToBeReady: () => (initiateCommit: any) => initiateCommit,
  NotPendingTransition: null,
  resetFormInstance: () => {},
  finalizeInitialChildren: () => false,
  supportsHydration: false,
  HostTransitionContext: {} as any,
  maySuspendCommitOnUpdate: () => false,
  maySuspendCommitInSyncRender: () => false,
  suspendOnActiveViewTransition: () => false,
  getSuspendedCommitReason: () => null,
};

export const reconciler = Reconciler(hostConfig);

export function render(element: React.ReactElement, container: GPUIViewNode) {
  const handleError = (error: unknown, info: any) => console.error(error, info);
  const root = (reconciler.createContainer as any)(
    container,
    1,
    null,
    false,
    null,
    '',
    handleError,
    handleError,
    handleError,
    () => {},
    null
  );
  reconciler.flushSyncFromReconciler(() => {
    reconciler.updateContainerSync(element, root, null, () => {});
  });
  return root;
}
