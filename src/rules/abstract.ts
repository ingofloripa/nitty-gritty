// Written by Ingo Schmidt, in 2024.

export abstract class AbstractRule {
  public passOrThrow(): void | never {
    if (!this.isSatisfied()) {
      throw this.createError()
    }
  }

  public abstract isSatisfied(): boolean

  protected abstract createError(): Error
}

// EOF
