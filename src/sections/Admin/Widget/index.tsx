import React from 'react'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

import styles from './index.module.scss'

type Props = {
  title: string;
  content: string | number | null;
  icon?: IconProp;
  iconBg?: "blue" | "orange" | "green";
  history?: string | number | null;
  tooltip?: string;
};

export default (props: Props) => {
  let content = (
    <>
      <div className={ styles.title }>{props.title}</div>
      <span className={ styles.content }>{props.content}</span>
      {props.icon && (
        <span className={classNames("icon", props.iconBg)}>
          <FontAwesomeIcon icon={props.icon} />
        </span>
      )}
      <div className={ styles.history }>
        <span className={ 'text-muted' }>{props.history}</span>
      </div>
    </>
  );

  content = (
    <div className={ styles.dashboardWidget }>
      { content }
    </div>
  );

  if (!props.tooltip) {
    return content;
  }

  const tooltip = (
    <Tooltip id='counterTooltip'>
      { props.tooltip }
    </Tooltip>
  );

  return (
    <OverlayTrigger
      delay={{ show: 50, hide: 0 }}
      overlay={ tooltip }
    >
      { content }
    </OverlayTrigger>
  );
};
