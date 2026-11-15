import type { DefaultTheme } from 'valaxy'

export interface NavItem {
  text: string
  link: string
}

export interface ThemeConfig extends DefaultTheme.Config {
  /** Short identity above the homepage title. */
  eyebrow: string
  /** One short sentence below the site description. */
  motto: string
  /** Internal or external navigation links. */
  nav: NavItem[]
  /** Accent for actions; reading surfaces stay neutral. */
  accent: string
  footer: string
}
export type ThemeUserConfig = Partial<ThemeConfig>
