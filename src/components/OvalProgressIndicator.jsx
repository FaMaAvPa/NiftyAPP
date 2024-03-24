import React, { useEffect, useState } from 'react';
import { View, Easing, StyleSheet } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';


const radioX = 110
const radioY = 140
const circunferencia = 2 * Math.PI * Math.sqrt((radioX * radioX + radioY * radioY) / 2)

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse)


const OvalProgressIndicator = ({ propProgress }) => {
    const progress = useSharedValue(propProgress === 0 ? 0 : propProgress - 0.1)
    progress.value = withTiming(propProgress, { duration:2000 })
    
    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circunferencia * (1 - progress.value)
    }))



    return (
        <View style={styles.container}>
            <Svg style={styles.container}>
                <Ellipse cx="50%" cy="50%" rx={radioX} ry={radioY} fill="transparent" stroke="#000" strokeWidth="10" ></Ellipse>
                <AnimatedEllipse 
                    cx="50%" 
                    cy="50%" 
                    rx={radioX} 
                    ry={radioY} 
                    fill="transparent" 
                    stroke="#090" 
                    strokeWidth="5"
                    strokeDasharray={circunferencia}
                    animatedProps={animatedProps}
                    strokeLinecap={'round'}
                ></AnimatedEllipse>
            </Svg>
        </View>
    );
}


const styles = StyleSheet.create({
    container:{ 
        flex: 1 , 
    }
})

export default OvalProgressIndicator;
