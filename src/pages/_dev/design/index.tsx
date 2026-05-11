import { Link } from 'react-router'

import { themeContract } from '~/styles/theme.css'
import { color } from '~/styles/tokens/color'
import { motion } from '~/styles/tokens/motion'
import { radius } from '~/styles/tokens/radius'
import { spacing } from '~/styles/tokens/spacing'
import { typography } from '~/styles/tokens/typography'

import * as s from './page.css'

const colorGroups = [
  {
    label: 'brand',
    keys: ['primary', 'primaryHover', 'primaryFocus', 'brandSecure', 'onPrimary'],
  },
  {
    label: 'surface ladder',
    keys: ['canvas', 'surface1', 'surface2', 'surface3', 'surface4'],
  },
  {
    label: 'sidebar chrome',
    keys: ['bgSidebar', 'bgSidebarRow', 'bgSidebarChip', 'sidebarTreeLine'],
  },
  {
    label: 'hairlines',
    keys: ['hairline', 'hairlineStrong', 'hairlineTertiary'],
  },
  {
    label: 'ink',
    keys: ['ink', 'inkMuted', 'inkSubtle', 'inkTertiary'],
  },
  {
    label: 'status · fg',
    keys: ['semanticSuccess', 'semanticDanger', 'semanticWarning', 'semanticInfo'],
  },
  {
    label: 'status · tinted bg',
    keys: [
      'semanticSuccessBg',
      'semanticDangerBg',
      'semanticWarningBg',
      'semanticInfoBg',
    ],
  },
  {
    label: 'inverse',
    keys: ['inverseCanvas', 'inverseSurface1', 'inverseSurface2', 'inverseInk'],
  },
] satisfies Array<{ label: string; keys: Array<keyof typeof color> }>

const typographyOrder = [
  'displayXl',
  'displayLg',
  'displayMd',
  'headline',
  'cardTitle',
  'subhead',
  'bodyLg',
  'body',
  'bodySm',
  'caption',
  'button',
  'eyebrow',
  'mono',
] satisfies Array<keyof typeof typography>

const specimenFor = (token: keyof typeof typography) => {
  if (token === 'mono') return 'const order = ${0x5e6ad2};'
  if (token === 'eyebrow') return 'EYEBROW · 02'
  if (token === 'button') return 'Continue with passkey'
  if (token.startsWith('display'))
    return token === 'displayXl'
      ? 'Compose'
      : token === 'displayLg'
        ? 'Compose surfaces'
        : 'Build with intent'
  if (token === 'headline') return 'A token system that keeps its promises'
  if (token === 'cardTitle') return 'Surface ladder · raised step'
  if (token === 'subhead') return 'Designed for the admin canvas, not the marketing hero.'
  if (token === 'caption') return '4px base · 12 token steps'
  return 'The fonts ladder from Inter Display through JetBrains Mono — one tempo, one voice. 中文字体亦同。'
}

const surfaceSteps = [
  {
    name: 'flat',
    desc: 'level 0 · canvas baseline',
    bg: themeContract.color.canvas,
    border: themeContract.color.hairline,
  },
  {
    name: 'raised',
    desc: 'level 1 · default card',
    bg: themeContract.color.surface1,
    border: themeContract.color.hairline,
  },
  {
    name: 'raisedStrong',
    desc: 'level 2 · featured card',
    bg: themeContract.color.surface2,
    border: themeContract.color.hairlineStrong,
  },
  {
    name: 'popover',
    desc: 'level 3 · floating surface',
    bg: themeContract.color.surface3,
    border: themeContract.color.hairline,
  },
] as const

const Hero = () => (
  <header className={s.hero} style={{ animationDelay: '0ms' }}>
    <span className={s.heroEyebrow}>mx_admin · spec 02 · design tokens</span>
    <h1 className={s.heroTitle}>Linear dark canvas, port one.</h1>
    <p className={s.heroLede}>
      A four-step surface ladder, lavender as the only hue with intent, hairlines doing the work
      shadows used to. This page renders every token in the contract — proof the wiring carries.
    </p>
    <Link to="/_dev/primitives" className={s.heroLink}>
      spec 03 · ui primitives →
    </Link>
  </header>
)

type SectionProps = {
  eyebrow: string
  title: string
  lede?: string
  delay: number
  children: React.ReactNode
}

const Section = ({ eyebrow, title, lede, delay, children }: SectionProps) => (
  <section className={s.section} style={{ animationDelay: `${delay}ms` }}>
    <div className={s.sectionHeader}>
      <span className={s.eyebrow}>{eyebrow}</span>
      <h2 className={s.sectionTitle}>{title}</h2>
      {lede ? <p className={s.sectionLede}>{lede}</p> : null}
    </div>
    {children}
  </section>
)

const ColorSection = () => (
  <Section
    eyebrow="01 · color"
    title="Palette"
    lede="Brand lavender carries every state. Surfaces step by hairlines, not luminance shifts."
    delay={120}
  >
    {colorGroups.map(({ label, keys }) => (
      <div key={label} className={s.colorGroup}>
        <span className={s.colorGroupLabel}>{label}</span>
        <div className={s.colorGrid}>
          {keys.map((key) => (
            <div key={key} className={s.swatch}>
              <div className={s.swatchTile} style={{ background: color[key] }} />
              <div className={s.swatchLabel}>
                <span className={s.swatchName}>{key}</span>
                <span className={s.swatchValue}>{color[key]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </Section>
)

const TypographySection = () => (
  <Section
    eyebrow="02 · typography"
    title="Type scale"
    lede="Inter for display and text, JetBrains Mono for code. Thirteen steps, one tempo."
    delay={200}
  >
    <div>
      {typographyOrder.map((token) => {
        const t = typography[token]
        const isMono = token === 'mono'
        return (
          <div key={token} className={s.typeRow}>
            <div className={s.typeMeta}>
              <span className={s.typeName}>{token}</span>
              <span className={s.typeSpecs}>
                {t.size} · {t.weight}
              </span>
            </div>
            <p
              className={s.typeSpecimen}
              style={{
                fontFamily: isMono
                  ? themeContract.fontFamily.mono
                  : themeContract.fontFamily.display,
                fontSize: t.size,
                fontWeight: Number(t.weight),
                lineHeight: t.lineHeight,
                letterSpacing: t.letterSpacing,
                textTransform: token === 'eyebrow' ? 'uppercase' : 'none',
              }}
            >
              {specimenFor(token)}
            </p>
          </div>
        )
      })}
    </div>
  </Section>
)

const SpacingSection = () => {
  const order: Array<keyof typeof spacing> = [
    'xxs',
    'xs',
    'sm',
    'md',
    'lg',
    'xl',
    'xxl',
    'section',
  ]
  return (
    <Section
      eyebrow="03 · spacing"
      title="4px base, eight steps"
      lede="A density that breathes. Section runs at 96 — used between major page bands, never inside cards."
      delay={280}
    >
      <div className={s.spacingTable}>
        {order.map((key) => (
          <div key={key} className={s.spacingRow}>
            <span className={s.spacingName}>{key}</span>
            <span className={s.spacingValue}>{spacing[key]}</span>
            <div className={s.spacingBar} style={{ width: spacing[key] }} />
          </div>
        ))}
      </div>
    </Section>
  )
}

const RadiusSection = () => {
  const order: Array<keyof typeof radius> = [
    'xs',
    'sm',
    'md',
    'lg',
    'xl',
    'xxl',
    'pill',
    'full',
  ]
  return (
    <Section
      eyebrow="04 · radius"
      title="Corner softness"
      lede="`pill` and `full` resolve to the same value — semantic forks for the same number."
      delay={360}
    >
      <div className={s.radiusGrid}>
        {order.map((key) => (
          <div key={key} className={s.radiusCell}>
            <div className={s.radiusTile} style={{ borderRadius: radius[key] }} />
            <div className={s.swatchLabel}>
              <span className={s.swatchName}>{key}</span>
              <span className={s.swatchValue}>{radius[key]}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

const SurfaceSection = () => (
  <Section
    eyebrow="05 · elevation"
    title="Surface ladder"
    lede="Depth without shadows. Each step lifts by ~8% lightness paired with a sharper hairline."
    delay={440}
  >
    <div className={s.surfaceLadder}>
      {surfaceSteps.map((step, i) => (
        <div
          key={step.name}
          className={s.surfaceCard}
          style={{ background: step.bg, border: `1px solid ${step.border}` }}
        >
          <span className={s.eyebrow}>{`level ${i}`}</span>
          <span
            style={{
              fontFamily: themeContract.fontFamily.display,
              fontSize: typography.cardTitle.size,
              fontWeight: Number(typography.cardTitle.weight),
              lineHeight: typography.cardTitle.lineHeight,
              letterSpacing: typography.cardTitle.letterSpacing,
            }}
          >
            {step.name}
          </span>
          <span className={s.swatchValue}>{step.desc}</span>
        </div>
      ))}
    </div>
  </Section>
)

const MotionSection = () => {
  const durations = Object.entries(motion.duration) as Array<[
    keyof typeof motion.duration,
    number,
  ]>
  return (
    <Section
      eyebrow="06 · motion"
      title="Tempo"
      lede="Six durations, four eases. The system has one heartbeat — instant for taps, slow for the rare reveal."
      delay={520}
    >
      <div className={s.motionGrid}>
        {durations.map(([key, value]) => (
          <div key={key} className={s.motionCell}>
            <div className={s.swatchLabel}>
              <span className={s.swatchName}>{key}</span>
              <span className={s.swatchValue}>{`${(value * 1000).toFixed(0)}ms`}</span>
            </div>
            <div
              className={s.motionDot}
              style={{ animationDuration: `${value * 4}s` }}
            />
          </div>
        ))}
      </div>
    </Section>
  )
}

export const DesignTokensPage = () => (
  <div className={s.page}>
    <div className={s.container}>
      <Hero />
      <ColorSection />
      <TypographySection />
      <SpacingSection />
      <RadiusSection />
      <SurfaceSection />
      <MotionSection />
    </div>
  </div>
)
