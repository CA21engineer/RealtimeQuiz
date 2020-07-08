import moment from 'moment'

export enum LEVEL {
  RUN,
  ERROR,
  WARN,
  LOG,
  INFO,
  DEBUG,
  FULL,
};

export default class Logger {
  public level: LEVEL = LEVEL.FULL
  public enable: boolean = true
  private namespace!: string

  constructor (namespace: string, level?: LEVEL) {
    if (level) this.level = level
    this.namespace = namespace
  }

  private time (): string {
    return moment().format("YYYY-MM-DD HH:mm:ssZ")
  }

  private format (level: LEVEL): string {
    return `${this.namespace} - [ ${LEVEL[level]} ] ${this.time()} |`
  }

  // 非推奨 Chromeでは表示されない
  debug (msg: any) {
    this.warn('logger.debug は非推奨です')
    if (this.enable && this.level >= LEVEL.DEBUG) console.debug(this.format(LEVEL.DEBUG), msg)
  }

  info (msg: any) {
    if (this.enable && this.level >= LEVEL.INFO) console.info(this.format(LEVEL.INFO), msg)
  }

  log (msg: any) {
    if (this.enable && this.level >= LEVEL.LOG) console.log(this.format(LEVEL.LOG), msg)
  }

  warn (msg: any) {
    if (this.enable && this.level >= LEVEL.WARN) console.warn(this.format(LEVEL.WARN), msg)
  }

  error (msg: any) {
    if (this.enable && this.level >= LEVEL.ERROR) console.error(this.format(LEVEL.ERROR), msg)
  }

}



