import React from 'react';

import styles from './index.module.scss';

type Props = {
  infinite?: boolean,
};

export default (props: Props) => {
  const style: any = {};
  if (props.infinite) {
    style.animationIterationCount = 'infinite';
    style.animationDirection = 'alternate';
  }
  return (
    <>
      <div className={ styles.logo }>
        <div className={ styles.blob } style={ style }></div>
        <div className={ styles.blob } style={ style }></div>
      </div>

      <svg className={ styles.svgFilter } xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </>
  );
};