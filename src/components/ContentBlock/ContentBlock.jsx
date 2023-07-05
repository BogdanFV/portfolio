import React, { useState, useEffect, useRef } from 'react';
import './ContentBlock.scss';
import InfoBlock from '../InfoBlock/InfoBlock';
import PageRightDecoration from '../PageDecoration/PageRightDecoration';

const ContentBlock = () => {
    const [, setScrollIndex] = useState(0);
    const secondaryCoverRef = useRef(null);
    const cube = useRef(null);
    const currentSide = useRef(1);
    const isScrolling = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            const container = secondaryCoverRef.current;
            const newIndex = Math.floor(container.scrollLeft / container.offsetWidth);
            setScrollIndex(newIndex);
        };

        const handleWheel = (event) => {
            if (!isScrolling.current) {
                isScrolling.current = true;

                const delta = event.deltaY;
                let rotateX = 0;

                currentSide.current += delta > 0 ? 1 : -1;
                if (currentSide.current > 4) currentSide.current = 1;
                if (currentSide.current < 1) currentSide.current = 4;

                const cubeElement = secondaryCoverRef.current;

                switch (true) {
                    case currentSide.current === 2:
                        rotateX = 90;
                        break;
                    case currentSide.current === 3:
                        rotateX = 180;
                        break;
                    case currentSide.current === 4:
                        rotateX = 270;
                        break;
                    default:
                        rotateX = 0;
                        break;
                }

                if (cubeElement) {
                    cubeElement.style.transform = `rotateX(${rotateX}deg)`;
                }

                setTimeout(() => {
                    isScrolling.current = false;
                }, 1600);
            }
        };

        const container = secondaryCoverRef.current;
        cube.current = container;
        container.addEventListener('scroll', handleScroll);
        window.addEventListener('wheel', handleWheel);

        return () => {
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div className='content-cover' ref={secondaryCoverRef}>
            <section className='test test-1'>
                <PageRightDecoration />
                <InfoBlock />
            </section>
            <section className='test test-2'>
                <PageRightDecoration />
                second
            </section>
            <section className='test test-3'>
                <PageRightDecoration />
                third
            </section>
            <section className='test test-4'>
                <PageRightDecoration />
                fourth
            </section>
        </div>
    );
};

export default ContentBlock;
