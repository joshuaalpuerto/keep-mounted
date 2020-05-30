# keep-mounted

Will not unmount your component unnecessarily.

## The problem

The second most important React optimization technique after `shouldComponentUpdate` and friends is remount management. Some portions of the UI can be hidden or shown — sidebars, drop-down menus, modals and draggable widgets are all prominent examples. The basic React pattern for conditional rendering is boolean short-circuiting:

```js
{
  condition && <Component data={data} />;
}
```

However, if you go this way, you create DOM elements every time the component is displayed. As the component grows in size, the lag between the interaction and mounting can become noticeable. You can combat this (Vue and Angular even have this functionality built-in) by keeping the component rendered unconditionally and hiding it with CSS:

```js
<div style={{ display: condition ? null : "none" }}>
  <Component data={data} />
</div>
```

You also get to preserve Component‘s state for free along with the DOM state (scroll, focus, and input position). However, this solution has drawbacks, too:

1. You mount the component on startup, even if the user never accesses it. Mounting multiple components at the same time can accumulate to very sluggish start-up performance.
2. You update the component even when it’s invisible, which may or may not be what you want.

## This solution

The solution is pretty naive. You mount the component when the user first sees it, subsequent toggles use CSS. You can also control whether you want the hidden component to update with an option.

### Example

```js
/**
 * Imagine this component has request to api
 * and you don't want to rerequest this when  it is toggled
 **/
const ApiComponent = () => {
  //...request to api
};

const SomeOtherComponent = () => {
  //... some other component
};

<KeepMounted>
  {toggle ? (
    <ApiComponent key="filter" onToggle={() => setToggle(true)} />
  ) : (
    <SomeOtherComponent key="case" onToggle={() => setToggle(false)} />
  )}
</KeepMounted>
```

> Plese note that this component requires a key to handle which component should show.

## Lazy loading and code splitting

This pattern also enables two more interesting use cases. Since the component does not mount immediately, you can delay fetching the data needed to render it until the user sees it. Also, if the child component is heavy, you can slap a code-split boundary on it and only load the actual code when it’s necessary. This way, the users who never see the component will not have to pay for using it. Very exciting.
