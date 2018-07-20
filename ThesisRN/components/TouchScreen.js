import React from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';

export default class TouchScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0,
            text: ''
        };
    }
    static navigationOptions = {
        title: 'Touch',
    };

    componentWillMount() {
        this.setState({ text: 'Enter' })
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (e, gestureState) => {
                const { locationX, locationY } = e
                this.setState({ x: locationX, y: locationY, text: 'Grant!' })
            },

            onPanResponderMove: (evt, gestureState) => {
                const { x0, y0, dx, dy } = gestureState
                this.setState({ text: "Move!", x: dx, y: dy })
            },

            onPanResponderRelease: (e, { vx, vy }) => {
            }
        });
    }
    render() {
        const { text, x, y } = this.state
        return (
            <View style={styles.container} {...this._panResponder.panHandlers}>
                <Text>{x}</Text>
                <Text>{y}</Text>
                <Text>{text}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0FFFF',
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    }
});