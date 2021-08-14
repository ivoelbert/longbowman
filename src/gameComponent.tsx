import { useEffect } from 'react';
import { assertExists } from './utils';
import { useLazyRef } from './hooks/useLazyRef';
import { Longbowman } from './game/Longbowman';

type CallbackRef = (element: HTMLElement | null) => void;

export const useLongbowman = (): CallbackRef => {
    const longbowman = useLazyRef(() => new Longbowman());

    useEffect(() => {
        longbowman.start();

        return () => longbowman.dispose();
    }, [longbowman]);

    const callbackRef = (element: HTMLElement | null): void => {
        assertExists(element).appendChild(longbowman.domElement);
    };

    return callbackRef;
};

const GameComponent: React.VFC = () => {
    const ref = useLongbowman();

    return <div className="game-container" ref={ref} />;
};

export default GameComponent;
