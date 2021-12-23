import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import runLoopAnimation from '../../modules/runLoopAnimation';
import { ILayout, IParticle } from '../../modules/types';
import Shapes from './Shapes';

const { concat, interpolateNode } = Animated;

type StaticProps = {
  Shapes: typeof Shapes;
};

type Props = {
  data: IParticle;
  layout: ILayout;
};

const Particle: StaticProps & React.FC<Props> = ({ data, layout }) => {
  const animation = useMemo(
    () =>
      runLoopAnimation({
        delay: data.deltas.delay,
        duration: data.deltas.duration,
      }),
    [data.deltas.delay, data.deltas.duration]
  );

  const animatedStyles = useMemo(
    () => [
      styles.container,
      {
        width: data.size,
        height: data.size,
        left: data.deltas.left * layout.width,
        bottom: interpolateNode(animation, {
          inputRange: [0, 1],
          outputRange: [
            layout.height + data.size * data.deltas.bottom,
            -layout.height + data.size * data.deltas.bottom,
          ],
        }),
        transform: [
          {
            rotateX: concat(
              interpolateNode(animation, {
                inputRange: [0, 1],
                outputRange: [0, data.deltas.rotateX * 360 * 10],
              }),
              'deg'
            ),
          },
          {
            rotateY: concat(
              interpolateNode(animation, {
                inputRange: [0, 1],
                outputRange: [0, data.deltas.rotateY * 360 * 5],
              }),
              'deg'
            ),
          },
          {
            translateX: interpolateNode(animation, {
              inputRange: [0, 0.4, 0.8, 1],
              outputRange: [
                0,
                -(data.deltas.swing * 30),
                data.deltas.swing * 30,
                0,
              ],
            }),
          },
        ],
      },
    ],
    [data, layout]
  );

  return <Animated.View style={animatedStyles}>{data.shape}</Animated.View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});

Particle.Shapes = Shapes;

export default Particle;
