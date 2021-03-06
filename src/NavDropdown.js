import classNames from 'classnames';
import React from 'react';

import Dropdown from './Dropdown';
import splitComponentProps from './utils/splitComponentProps';
import ValidComponentChildren from './utils/ValidComponentChildren';

const propTypes = {
  ...Dropdown.propTypes,

  // Toggle props.
  title: React.PropTypes.node.isRequired,
  noCaret: React.PropTypes.bool,
  active: React.PropTypes.bool,

  // Override generated docs from <Dropdown>.
  /**
   * @private
   */
  children: React.PropTypes.node,
};

class NavDropdown extends React.Component {
  isActive({ props }, activeKey, activeHref) {
    if (
      props.active ||
      activeKey != null && props.eventKey === activeKey ||
      activeHref && props.href === activeHref
    ) {
      return true;
    }

    if (props.children) {
      return ValidComponentChildren.some(props.children, child => (
        this.isActive(child, activeKey, activeHref)
      ));
    }

    return props.active;
  }

  render() {
    const {
      title,
      activeKey,
      activeHref,
      className,
      style,
      children,
      ...props,
    } = this.props;

    const active = this.isActive(this, activeKey, activeHref);
    delete props.active; // Accessed via this.isActive().
    delete props.eventKey; // Accessed via this.isActive().

    const [dropdownProps, toggleProps] =
      splitComponentProps(props, Dropdown.ControlledComponent);

    // Unlike for the other dropdowns, styling needs to go to the `<Dropdown>`
    // rather than the `<Dropdown.Toggle>`.

    return (
      <Dropdown
        {...dropdownProps}
        componentClass="li"
        className={classNames(className, { active })}
        style={style}
      >
        <Dropdown.Toggle {...toggleProps} useAnchor>
          {title}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {ValidComponentChildren.map(children, child => (
            React.cloneElement(child, {
              active: this.isActive(child, activeKey, activeHref),
            })
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

NavDropdown.propTypes = propTypes;

export default NavDropdown;
