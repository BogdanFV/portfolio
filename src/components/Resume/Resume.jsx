import { useEffect, useState } from 'react';
import resumes from '../../data/resume';
import {
  applyPrefsToDocument,
  readEffectsEnabled,
  readSoundEnabled,
  setEffectsEnabled,
  setSoundEnabled,
} from '../../utils/uiPrefs';
import { syncUiEffectsEnabled, syncUiSoundEnabled, uiSoundProps } from '../../utils/uiSound';
import ProjectSlider from '../ProjectSlider/ProjectSlider';
import TraxPlayer from '../TraxPlayer/TraxPlayer';
import './Resume.scss';

const LANG_KEY = 'resume-lang';
const THEME_KEY = 'resume-theme';

const readLang = () => {
  const saved = localStorage.getItem(LANG_KEY);
  return saved === 'en' ? 'en' : 'ru';
};

const readTheme = () => {
  const saved = localStorage.getItem(THEME_KEY);
  return saved === 'nfsu2' ? 'nfsu2' : 'clean';
};

const Resume = () => {
  const [lang, setLang] = useState(readLang);
  const [theme, setTheme] = useState(readTheme);
  const [soundOn, setSoundOn] = useState(readSoundEnabled);
  const [effectsOn, setEffectsOn] = useState(readEffectsEnabled);
  const resume = resumes[lang];

  useEffect(() => {
    applyPrefsToDocument();
    syncUiSoundEnabled(readSoundEnabled());
    syncUiEffectsEnabled(readEffectsEnabled());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.theme = theme;
    document.title = resume.pageTitle;
    localStorage.setItem(LANG_KEY, lang);
    localStorage.setItem(THEME_KEY, theme);
  }, [lang, theme, resume.pageTitle]);

  const changeSound = (enabled) => {
    setSoundOn(enabled);
    setSoundEnabled(enabled);
    syncUiSoundEnabled(enabled);
  };

  const changeEffects = (enabled) => {
    setEffectsOn(enabled);
    setEffectsEnabled(enabled);
    syncUiEffectsEnabled(enabled);
  };

  return (
    <div className="page">
      <header className="header">
        <div className="topbar">
          <p className="kicker">{resume.kicker}</p>
          <div className="topbar__controls">
            <div className="switcher" role="group" aria-label={resume.themeLabel}>
              <button
                type="button"
                aria-pressed={theme === 'clean'}
                onClick={() => setTheme('clean')}
              >
                {resume.themes.clean}
              </button>
              <button
                type="button"
                aria-pressed={theme === 'nfsu2'}
                onClick={() => setTheme('nfsu2')}
              >
                {resume.themes.nfsu2}
              </button>
            </div>
            <div className="switcher" role="group" aria-label={resume.languageLabel}>
              <button type="button" aria-pressed={lang === 'ru'} onClick={() => setLang('ru')}>
                RU
              </button>
              <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
                EN
              </button>
            </div>
            <div className="switcher switcher--pref" role="group" aria-label={resume.soundLabel}>
              <span className="switcher__label">{resume.soundLabel}</span>
              <button type="button" aria-pressed={soundOn} onClick={() => changeSound(true)}>
                {resume.soundOn}
              </button>
              <button type="button" aria-pressed={!soundOn} onClick={() => changeSound(false)}>
                {resume.soundOff}
              </button>
            </div>
            <div className="switcher switcher--pref" role="group" aria-label={resume.effectsLabel}>
              <span className="switcher__label">{resume.effectsLabel}</span>
              <button type="button" aria-pressed={effectsOn} onClick={() => changeEffects(true)}>
                {resume.effectsOn}
              </button>
              <button type="button" aria-pressed={!effectsOn} onClick={() => changeEffects(false)}>
                {resume.effectsOff}
              </button>
            </div>
          </div>
        </div>
        <div className="intro">
          <div className="intro__text">
            <h1 className="name">{resume.name}</h1>
            <p className="headline">{resume.title}</p>
            <p className="facts">
              {resume.location}
              <span aria-hidden="true"> · </span>
              {resume.availability}
            </p>
            <p className="summary">{resume.summary}</p>
            <ul className="contacts">
              {resume.contacts.map((contact) => (
                <li key={contact.href}>
                  <a href={contact.href} {...(theme === 'nfsu2' ? uiSoundProps : {})}>
                    {contact.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="intro__aside">
            <div className="avatar">
              <img src="/profile-pic.jpg" alt={resume.name} width={160} height={160} />
            </div>
            <a
              className="download-resume"
              href={resume.resumeFile}
              download="Bogdan-Farsiev-Resume.pdf"
              {...(theme === 'nfsu2' ? uiSoundProps : {})}
            >
              {resume.downloadResume}
            </a>
          </div>
        </div>
      </header>

      {theme === 'nfsu2' ? (
        <TraxPlayer labels={resume.trax} lang={lang} soundEnabled={soundOn} />
      ) : null}

      <main>
        {theme === 'nfsu2' && resume.projects?.length ? (
          <ProjectSlider
            projects={resume.projects}
            labels={resume.projectSlider}
            sectionTitle={resume.sections.projects}
          />
        ) : null}

        <section className="section" aria-labelledby="experience-title">
          <h2 id="experience-title">{resume.sections.experience}</h2>
          {resume.experience.map((job) => (
            <article className="job" key={job.id}>
              <div className="job__head">
                <div>
                  <h3 className="job__company">{job.company}</h3>
                  <p className="job__position">{job.position}</p>
                </div>
                <div className="job__when">
                  <p>{job.period}</p>
                  <p>{job.duration}</p>
                </div>
              </div>
              <div>
                <p className="job__place">
                  {job.place}
                  {job.site ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      <a href={job.site.href}>{job.site.label}</a>
                    </>
                  ) : null}
                </p>

                {job.phases.map((phase) => (
                  <div className="phase" key={phase.years}>
                    <p className="phase__years">{phase.years}</p>
                    <p className="phase__summary">{phase.summary}</p>
                    <p className="stack">{phase.stack.join(' · ')}</p>
                    <ul className="links">
                      {phase.links.map((link) => (
                        <li key={link.href}>
                          <a href={link.href}>{link.label}</a>
                        </li>
                      ))}
                    </ul>
                    <ul className="points">
                      {phase.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="section section--split" aria-labelledby="education-title">
          <div>
            <h2 id="education-title">{resume.sections.education}</h2>
            <p className="edu__level">{resume.education.level}</p>
            <p className="edu__school">{resume.education.school}</p>
            <p className="edu__faculty">{resume.education.faculty}</p>
            <p className="edu__year">{resume.education.year}</p>
          </div>
          <div>
            <h2 id="languages-title">{resume.sections.languages}</h2>
            <ul className="languages">
              {resume.languages.map((language) => (
                <li key={language.name}>
                  <span>{language.name}</span>
                  <span>{language.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section--last" aria-labelledby="skills-title">
          <h2 id="skills-title">{resume.sections.skills}</h2>
          <div className="meters" aria-hidden={theme !== 'nfsu2'}>
            {resume.skillMeters.map((meter) => (
              <div className="meter" key={meter.label} tabIndex={0}>
                <span className="meter__label">{meter.label}</span>
                <div className="meter__track">
                  <span
                    className={`meter__fill${meter.boost ? ' has-boost' : ''}`}
                    style={{ width: `${meter.value}%` }}
                  />
                  {meter.boost ? (
                    <span
                      className="meter__boost"
                      style={{ left: `${meter.value}%`, width: `${meter.boost}%` }}
                    />
                  ) : null}
                  <span className="meter__tick" style={{ left: `${meter.value}%` }} />
                </div>
                {meter.hint ? (
                  <p className="meter__hint" role="tooltip">
                    {meter.hint}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          <dl className="skills">
            {resume.skills.map((group) => (
              <div key={group.label}>
                <dt>{group.label}</dt>
                <dd>{group.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
          <p className="updated">
            {resume.updatedLabel} {resume.updated}
          </p>
        </section>
      </main>

      {theme === 'nfsu2' && resume.disclaimer ? (
        <footer className="site-disclaimer">
          <p>{resume.disclaimer}</p>
        </footer>
      ) : null}
    </div>
  );
};

export default Resume;
