import { Token } from '../token/token'

export interface Node {
  tokenLiteral: () => string
  toString: () => string
}

// 语句
export interface Statement extends Node {
  statementNode: () => void
}

// 表达式
export interface Expression extends Node {
  expressionNode: () => void
}

// 程序入口
export class Program implements Node {
  statements: Statement[]

  tokenLiteral (): string {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral()
    } else {
      return ''
    }
  }

  toString (): string {
    let out = ''
    this.statements.forEach(stmt => {
      out += stmt.toString()
    })
    return out
  }
}

// TODO: Identifier 为什么是一个表达式
export class Identifier implements Expression {
  token: Token
  value: string

  constructor (token: Token, value: string) {
    this.token = token
    this.value = value
  }

  expressionNode (): void {}

  tokenLiteral (): string {
    return this.token.literal
  }

  toString (): string {
    return this.value
  }
}

export class IntegerLiteral implements Expression {
  token: Token
  value: number

  constructor (token: Token, value: number) {
    this.token = token
    this.value = value
  }

  expressionNode (): void {}

  tokenLiteral (): string {
    return this.token.literal
  }

  toString (): string {
    return this.token.literal
  }
}

// 前缀表示式
export class PrefixExpression implements Expression {
  token: Token
  operator: string
  right: Expression

  expressionNode (): void {}

  tokenLiteral (): string {
    return this.token.literal
  }

  toString (): string {
    return `(${this.operator}${this.right.toString()})`
  }
}

/**
 * let 语句
 * let <identifier> = <expression>;
 */
export class LetStatement implements Statement {
  token: Token
  name: Identifier
  value: Expression

  statementNode (): void {}

  tokenLiteral (): string {
    return this.token.literal
  }

  toString (): string {
    let out = `${this.token.literal} ${this.name.toString()} = `
    if (this.value !== undefined) {
      out += this.value.toString()
    }
    out += ';'

    return out
  }
}

/**
 * return 语句
 * return <expression>;
 */
export class ReturnStatement implements Statement {
  token: Token
  returnValue: Expression

  statementNode (): void {}

  tokenLiteral (): string {
    return this.token.literal
  }

  toString (): string {
    let out = `${this.token.literal} `

    if (this.returnValue !== undefined) {
      out += this.returnValue.toString()
    }
    out += ';'

    return out
  }
}

/**
 * 表达式语句
 */
export class ExpressionStatement implements Statement {
  token: Token
  expression: Expression

  statementNode (): void {}

  tokenLiteral (): string {
    return this.token.literal
  }

  toString (): string {
    if (this.expression !== undefined) {
      return this.expression.toString()
    }

    return ''
  }
}
