import { useCallback, useEffect, useRef, useState } from 'react';
import { playHoverSound, playPressSound, uiSoundProps } from '../../utils/uiSound';
import './ProjectSlider.scss';

const ICONS = {
  cabinet: (
    <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm1 3v2h10V7H7zm0 4v2h6v-2H7zm0 4v2h8v-2H7z" />
  ),
  shop: (
    <path d="M4 7 6 3h12l2 4v2H4V7zm1 4h14v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9zm3 2v5h2v-5H8zm6 0v5h2v-5h-2z" />
  ),
  rx: (
    <path d="M7 3h10v4H7V3zm-2 6h14v12H5V9zm4 3v2h2.2l2.3 3.2L16 12h2l-3.2 4.4L18 21h-2.1l-2.4-3.4L11 21H9l3.1-4.6L8 12h1z" />
  ),
  tasks: (
    <path d="M9 4h11v2H9V4zm0 7h11v2H9v-2zm0 7h11v2H9v-2zM4.5 3.5 6 5l2.5-2.5L7.2 1 6 2.2 5.2 1.4 4.5 3.5zm0 7L6 12l2.5-2.5L7.2 8 6 9.2 5.2 8.4 4.5 10.5zm0 7L6 19l2.5-2.5L7.2 15 6 16.2 5.2 15.4 4.5 17.5z" />
  ),
};

const ProjectIcon = ({ name }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {ICONS[name] || ICONS.cabinet}
  </svg>
);

const NavArrow = ({ dir = 'prev' }) => (
  <svg className="project-slider__arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
    {dir === 'next' ? (
      <path d="M7 12h9.5M13.5 7.5 18 12l-4.5 4.5" />
    ) : (
      <path d="M17 12H7.5M10.5 7.5 6 12l4.5 4.5" />
    )}
  </svg>
);

const ProjectSlider = ({ projects, labels, sectionTitle }) => {
  const rootRef = useRef(null);
  const indexRef = useRef(0);
  const screenIndexRef = useRef(0);
  const activeRef = useRef(false);
  const lightboxRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [screenIndex, setScreenIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const total = projects.length;
  const active = projects[index];
  const screens = active?.screens || [];
  const activeScreen = screens[screenIndex] || screens[0];

  indexRef.current = index;
  screenIndexRef.current = screenIndex;
  lightboxRef.current = lightbox;

  const go = useCallback(
    (nextIndex) => {
      if (!total) return;
      playPressSound();
      setIndex(((nextIndex % total) + total) % total);
      setScreenIndex(0);
      setLightbox(false);
    },
    [total],
  );

  const goScreen = useCallback(
    (nextIndex) => {
      if (!screens.length) return;
      playPressSound();
      setScreenIndex(((nextIndex % screens.length) + screens.length) % screens.length);
    },
    [screens.length],
  );

  const openLightbox = () => {
    if (!activeScreen) return;
    playPressSound();
    setLightbox(true);
  };

  const closeLightbox = () => {
    playPressSound();
    setLightbox(false);
  };

  useEffect(() => {
    if (!lightbox) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [lightbox]);

  useEffect(() => {
    if (!total) return undefined;

    const onKeyDown = (event) => {
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return;

      if (lightboxRef.current) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeLightbox();
          return;
        }
        if (event.key === 'ArrowLeft' || event.key === 'Left') {
          event.preventDefault();
          goScreen(screenIndexRef.current - 1);
          return;
        }
        if (event.key === 'ArrowRight' || event.key === 'Right') {
          event.preventDefault();
          goScreen(screenIndexRef.current + 1);
        }
        return;
      }

      if (!activeRef.current) return;

      if (event.key === 'ArrowLeft' || event.key === 'Left') {
        event.preventDefault();
        go(indexRef.current - 1);
        return;
      }

      if (event.key === 'ArrowRight' || event.key === 'Right') {
        event.preventDefault();
        go(indexRef.current + 1);
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        go(0);
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        go(total - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [go, goScreen, total]);

  if (!total) return null;

  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  const activate = () => {
    activeRef.current = true;
  };

  const deactivate = (event) => {
    if (!rootRef.current?.contains(event.relatedTarget)) {
      activeRef.current = false;
    }
  };

  return (
    <section
      ref={rootRef}
      className="project-slider"
      aria-labelledby="projects-title"
      tabIndex={0}
      onMouseEnter={activate}
      onMouseLeave={() => {
        activeRef.current = false;
      }}
      onFocusCapture={activate}
      onBlurCapture={deactivate}
    >
      <h2 id="projects-title">{sectionTitle}</h2>

      <div className="project-slider__rail">
        <button
          type="button"
          className="project-slider__arrow"
          onClick={prev}
          aria-label={labels.prev}
          onMouseEnter={playHoverSound}
        >
          <NavArrow dir="prev" />
        </button>

        <div className="project-slider__track" role="listbox" aria-label={sectionTitle}>
          {projects.map((project, i) => {
            const selected = i === index;
            return (
              <button
                key={project.id}
                type="button"
                role="option"
                aria-selected={selected}
                className={`project-slider__item${selected ? ' is-active' : ''}`}
                onClick={() => go(i)}
                onMouseEnter={playHoverSound}
              >
                <span className="project-slider__icon">
                  <ProjectIcon name={project.icon} />
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="project-slider__arrow"
          onClick={next}
          aria-label={labels.next}
          onMouseEnter={playHoverSound}
        >
          <NavArrow dir="next" />
        </button>
      </div>

      <p className="project-slider__label">{active.title}</p>

      <div className={`project-slider__card${screens.length ? ' has-screens' : ''}`}>
        <p className="project-slider__note">{active.note}</p>

        {screens.length && activeScreen ? (
          <div className="project-slider__showcase" aria-label={active.title}>
            <div className="project-slider__stage">
              <button
                type="button"
                className="project-slider__screen-nav project-slider__screen-nav--prev"
                onClick={() => goScreen(screenIndex - 1)}
                aria-label={labels.prevScreen || labels.prev}
                onMouseEnter={playHoverSound}
                disabled={screens.length < 2}
              >
                <NavArrow dir="prev" />
              </button>

              <button
                type="button"
                className="project-slider__screen project-slider__screen--button"
                onClick={openLightbox}
                onMouseEnter={playHoverSound}
                aria-label={labels.expand || activeScreen.alt}
              >
                <img src={activeScreen.src} alt={activeScreen.alt} loading="lazy" />
                <span className="project-slider__screen-caption">{activeScreen.alt}</span>
              </button>

              <button
                type="button"
                className="project-slider__screen-nav project-slider__screen-nav--next"
                onClick={() => goScreen(screenIndex + 1)}
                aria-label={labels.nextScreen || labels.next}
                onMouseEnter={playHoverSound}
                disabled={screens.length < 2}
              >
                <NavArrow dir="next" />
              </button>
            </div>

            {screens.length > 1 ? (
              <div className="project-slider__dots" role="tablist" aria-label={active.title}>
                {screens.map((screen, i) => (
                  <button
                    key={screen.src}
                    type="button"
                    role="tab"
                    aria-selected={i === screenIndex}
                    className={`project-slider__dot${i === screenIndex ? ' is-active' : ''}`}
                    onClick={() => goScreen(i)}
                    onMouseEnter={playHoverSound}
                    aria-label={screen.alt}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : active.href ? (
          <a
            className="project-slider__link"
            href={active.href}
            target="_blank"
            rel="noreferrer"
            {...uiSoundProps}
          >
            {labels.open}
          </a>
        ) : null}
      </div>

      {lightbox && activeScreen ? (
        <div
          className="project-slider__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activeScreen.alt}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="project-slider__lightbox-close"
            onClick={closeLightbox}
            onMouseEnter={playHoverSound}
            aria-label={labels.close}
          >
            ×
          </button>

          {screens.length > 1 ? (
            <button
              type="button"
              className="project-slider__lightbox-nav project-slider__lightbox-nav--prev"
              onClick={(event) => {
                event.stopPropagation();
                goScreen(screenIndex - 1);
              }}
              onMouseEnter={playHoverSound}
              aria-label={labels.prevScreen || labels.prev}
            >
              <NavArrow dir="prev" />
            </button>
          ) : null}

          <img
            className="project-slider__lightbox-image"
            src={activeScreen.src}
            alt={activeScreen.alt}
            onClick={(event) => event.stopPropagation()}
          />

          {screens.length > 1 ? (
            <button
              type="button"
              className="project-slider__lightbox-nav project-slider__lightbox-nav--next"
              onClick={(event) => {
                event.stopPropagation();
                goScreen(screenIndex + 1);
              }}
              onMouseEnter={playHoverSound}
              aria-label={labels.nextScreen || labels.next}
            >
              <NavArrow dir="next" />
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default ProjectSlider;
