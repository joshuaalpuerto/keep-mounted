import React from 'react';

const isEmptyChildren = (children) =>
  Array.isArray(children) ? children.every((c) => !c) : !children;

const KeepMounted = ({ as: As = 'div', children, ...props }) => {
  const emptyChildren = isEmptyChildren(children);

  if (!emptyChildren) {
    if (!KeepMounted.cache.has(children.key)) {
      KeepMounted.cache.set(children.key, children);
    }
  }

  return [...KeepMounted.cache.values()].map((child) => (
    <As
      key={child.key}
      style={{ display: child.key !== children.key ? 'none' : null }}
      {...props}
    >
      {child}
    </As>
  ));
};

KeepMounted.cache = new Map();

export { KeepMounted };
