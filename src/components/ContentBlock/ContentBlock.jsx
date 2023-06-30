import React, { useState, useEffect, useRef } from 'react';
import './ContentBlock.scss';
import InfoBlock from '../InfoBlock/InfoBlock';
import PageRightDecoration from '../PageDecoration/PageRightDecoration';


const ContentBlock = () => {

    const [scrollIndex, setScrollIndex] = useState(0);
    const secondaryCoverRef = useRef(null);
    const cube = secondaryCoverRef.current;
    let currentSide = 1;
    let isScrolling = false;

    useEffect(() => {
        const handleScroll = () => {
            const container = secondaryCoverRef.current;
            const newIndex = Math.floor(container.scrollLeft / container.offsetWidth);
            setScrollIndex(newIndex);
        };

        const handleWheel = (event) => {
            if (!isScrolling) {
                isScrolling = true;

                const delta = event.deltaY;
                let rotateX = 0;

                currentSide += delta > 0 ? 1 : -1;
                if (currentSide > 4) currentSide = 1;
                if (currentSide < 1) currentSide = 4;
                console.log(currentSide);

                const cube = secondaryCoverRef.current;

                switch (true) {
                    case currentSide === 2:
                        rotateX = 90;
                        break;
                    case currentSide === 3:
                        rotateX = 180;
                        break;
                    case currentSide === 4:
                        rotateX = 270;
                        break;
                    default:
                        rotateX = 0;
                        break;
                }

                if (cube) {
                    cube.style.transform = `rotateX(${rotateX}deg)`;
                }

                setTimeout(() => {
                    isScrolling = false;
                }, 1600);
            }
        };

        const container = secondaryCoverRef.current;
        container.addEventListener('scroll', handleScroll);
        window.addEventListener('wheel', handleWheel);
        console.log(window.innerHeight);

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
