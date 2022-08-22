
export interface Node {
  tokenLiteral(): string
}

export interface Statement extends Node {
  statementNode(): void
}

export interface Expression extends Node {
  expressionNode(): void
}

export class Program implements Node {
  statements: Statement[]

  tokenLiteral(): string {
    if (this.statements && this.statements.length > 0) {
      return this.statements[0].tokenLiteral()
    } else {
      return ""
    }
  }
}