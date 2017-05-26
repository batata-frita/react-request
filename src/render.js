/**
 * This is the only entry point you need to create a Fiber renderer. Note that
 * it currently lives within the `react-dom` package and not `react.
 */
const ReactFiberReconciler = require('react-dom/lib/ReactFiberReconciler')

const log = (a, b, c, d) => {
  console.log(a, b, c, d)
}

console.log('what?')

const toJSON = node => {
  const props = node.props
  if (typeof props.toJSON === 'function') {
    return props.toJSON(props)
  }

  let children = null
  if (props.children) {
    if (Array.isArray(props.children)) {
      children = props.children.map(toJSON)
    } else if (props.children) {
      children = toJSON(props.children)
    }
    return Object.assign({}, props, { children })
  } else {
    const clone = Object.assign({}, props)
    delete clone.children
    return clone
  }
}

/**
 * The fun begins!
 *
 * We create a private reconciler instance. The methods defined here can be
 * thought of as the lifecycle of a renderer. React will manage all non-host
 * components, such as composites, stateless, and fragments.
 */
const RequestRenderer = ReactFiberReconciler({
  // the tree creation and updating methods. If you’re familiar with the DOM API
  // this will look familiar

  createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    log('createInstance', type, props, rootContainerInstance)

    return {
      type,
      props,
    }
  },

  // this is called instead of `appendChild` when the parentInstance is first
  // being created and mounted
  // added in https://github.com/facebook/react/pull/8400/
  appendInitialChild(parentInstance, child) {
    //
    log('appendInitialChild', child)
  },

  appendChild(parentInstance, child) {
    log('appendChild', arguments)

    parentInstance.children = parentInstance.children || []
    parentInstance.children.push(child)

    // do the request!?

    // const index = parentInstance.children.indexOf(child)
    // if (index !== -1) {
    //   parentInstance.children.splice(index, 1)
    // }
    // parentInstance.children.push(child)
  },

  removeChild(parentInstance, child) {
    log('removeChild', child)
    // parentInstance.removeChild(child);
  },

  insertBefore(parentInstance, child, beforeChild) {
    log('insertBefore')
    // parentInstance.insertBefore(child, beforeChild);
  },

  // finalizeInitialChildren is the final HostConfig method called before
  // flushing the root component to the host environment

  finalizeInitialChildren(instance, type, props, rootContainerInstance) {
    log('finalizeInitialChildren')
    // setInitialProperties(instance, type, props, rootContainerInstance);
    return false
  },

  // prepare update is where you compute the diff for an instance. This is done
  // here to separate computation of the diff to the applying of the diff. Fiber
  // can reuse this work even if it pauses or aborts rendering a subset of the
  // tree.

  prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, hostContext) {
    log('TODO: prepareUpdate', arguments)

    newProps.reduce()

    // return Object.keys(newProps)
    return []
    // return diffProperties(instance, type, oldProps, newProps, rootContainerInstance, hostContext);
  },

  commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
    // Apply the diff to the DOM node.
    // updateProperties(instance, updatePayload, type, oldProps, newProps);
    log('commitUpdate', arguments)
  },

  // commitMount is called after initializeFinalChildren *if*
  // `initializeFinalChildren` returns true.

  commitMount(instance, type, newProps, internalInstanceHandle) {
    log('commitMount')
    // noop
  },

  // HostContext is an internal object or reference for any bookkeeping your
  // renderer may need to do based on current location in the tree. In DOM this
  // is necessary for calling the correct `document.createElement` calls based
  // upon being in an `html`, `svg`, `mathml`, or other context of the tree.

  getRootHostContext(rootContainerInstance) {
    log('getRootHostContext')
    return emptyObject
  },

  getChildHostContext(parentHostContext, type) {
    log('getChildHostContext')
    return emptyObject
  },

  // getPublicInstance should be the identity function in 99% of all scenarios.
  // It was added to support the `getNodeMock` functionality for the
  // TestRenderers.

  getPublicInstance(instance) {
    return instance
  },

  // the prepareForCommit and resetAfterCommit methods are necessary for any
  // global side-effects you need to trigger in the host environment. In
  // ReactDOM this does things like disable the ReactDOM events to ensure no
  // callbacks are fired during DOM manipulations

  prepareForCommit() {
    log('prepareForCommit')
    // noop
  },

  resetAfterCommit() {
    log('resetAfterCommit')
    // noop
  },

  // the following four methods are regarding TextInstances. In our example
  // renderer we don’t have specific text nodes like the DOM does so we’ll just
  // noop all of them.

  shouldSetTextContent(props) {
    log('shouldSetTextContent')
    return false
  },

  resetTextContent(instance) {
    log('resetTextContent')
    // noop
  },

  createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) {
    log('createTextInstance')
    return null
  },

  commitTextUpdate(textInstance, oldText, newText) {
    log('commitTextUpdate')
    // noop
    throw new Error('commitTextUpdate should not be called')
  },

  scheduleAnimationCallback() {
    log('scheduleAnimationCallback')
  },

  scheduleDeferredCallback() {
    log('scheduleDeferredCallback')
  },

  useSyncScheduling: true,
})

/**
 * Our public renderer. When someone requires your renderer, this is all they
 * should have access to. `render` and `unmountComponentAtNode` methods should
 * be considered required, though that isn’t strictly true.
 */
const defaultContainer = {}
const Request = {
  render(element, callback, container) {
    const containerKey = typeof container === 'undefined' ? defaultContainer : container
    let root = roots.get(containerKey)
    if (!root) {
      root = RequestRenderer.createContainer(containerKey)
      roots.set(container, root)
    }

    RequestRenderer.updateContainer(element, root, null, callback)
    return RequestRenderer.getPublicRootInstance(root)
  },
  unmountComponentAtNode(container) {
    const containerKey = typeof container === 'undefined' ? defaultContainer : container
    const root = roots.get(containerKey)
    if (root) {
      RequestRenderer.updateContainer(null, root, null, () => {
        roots.delete(container)
      })
    }
  },
  // other API methods you may support, such as `renderPortal()`
}

const roots = new Map()
const emptyObject = {}

export default Request
